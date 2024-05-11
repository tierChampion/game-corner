import "../styles/Quarto.css";
import QuartoPiece, { QuartoPieceData } from "./QuartoPiece";
import useQuartoStore from "../stores/QuartoStore";

const QuartoBoard: React.FC = () => {

    const board = useQuartoStore((state) => state.board);
    const bank = useQuartoStore((state) => state.bank);
    const selectedPiece = useQuartoStore((state) => state.selectedPiece);
    const setBoard = useQuartoStore((state) => state.setBoard);
    const setBank = useQuartoStore((state) => state.setBank);
    const setSelectedPiece = useQuartoStore((state) => state.setSelectedPiece);

    const placePiece = (index: number) => {
        if (!board[index].isValid && selectedPiece !== -1) {
            const newBoard = [...board];
            const newBank = [...bank];
            newBoard[index] = { ...newBank[selectedPiece] };
            newBank[selectedPiece].isValid = false;
            setBoard(newBoard);
            setBank(newBank);
            setSelectedPiece(-1);
        }
    };

    return (
        <div className="board">
            <div className="ring">
                <div className="play-board">
                    {board.map((piece: QuartoPieceData, index: number) => {
                        return (
                            <div
                                key={`board-square-${index}`}
                                className="board-square"
                                onClick={() => placePiece(index)}
                            >
                                <QuartoPiece
                                    key={`board-piece-${index}`}
                                    {...piece}
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