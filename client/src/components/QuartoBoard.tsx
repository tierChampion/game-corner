import "../styles/Quarto.css";
import QuartoPiece, { QuartoPieceData } from "./QuartoPiece";
import useQuartoStore, {GameStatus} from "../stores/QuartoStore";

const QuartoBoard: React.FC = () => {
    const {status, turn, board, piece, place, setPlace} = useQuartoStore();

    const placePiece = (index: number) => {
        if (status === GameStatus.IN_PROGRESS && turn && piece.isValid) {
            setPlace((index === place) ? -1 : index);
        }
    }

    return (
        <div className="board aspect-square w-3/4">
            <div className="quarto-ring">
                <div className="play-board">
                    {board.map((boardPiece: QuartoPieceData, index: number) => {
                        const usedPiece = (index === place) ? piece : boardPiece;
                        return (
                            <div
                                key={`board-square-${index}`}
                                className="board-square"
                                onClick={() => {placePiece(index)}}
                            >
                                <QuartoPiece
                                    key={`board-piece-${index}`}
                                    {...usedPiece}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default QuartoBoard;