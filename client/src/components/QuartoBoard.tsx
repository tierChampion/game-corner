import "../styles/Quarto.css";
import QuartoPiece, { QuartoPieceData } from "./QuartoPiece";
import useQuartoStore from "../stores/QuartoStore";

const QuartoBoard: React.FC = () => {

    const turn = useQuartoStore((state) => state.turn);
    const board = useQuartoStore((state) => state.board);
    const piece = useQuartoStore((state) => state.piece);
    const place = useQuartoStore((state) => state.place);
    const setPlace = useQuartoStore((state) => state.setPlace);    

    const placePiece = (index: number) => {
        if (turn && piece.isValid) {
            setPlace((index === place) ? -1 : index);
        }
    }

    return (
        <div className="board">
            <div className="ring">
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