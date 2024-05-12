import "../styles/Quarto.css";
import QuartoPiece, { QuartoPieceData } from "./QuartoPiece";
import useQuartoStore from "../stores/QuartoStore";
import useRoomStore from "../stores/RoomStore";

const QuartoBoard: React.FC = () => {

    const ws = useRoomStore((state) => state.ws);
    const turn = useQuartoStore((state) => state.turn);
    const board = useQuartoStore((state) => state.board);
    const bank = useQuartoStore((state) => state.bank);
    const selectedPiece = useQuartoStore((state) => state.selectedPiece);
    const setBoard = useQuartoStore((state) => state.setBoard);
    const setBank = useQuartoStore((state) => state.setBank);
    const setSelectedPiece = useQuartoStore((state) => state.setSelectedPiece);

    const placePiece = (index: number) => {
        if (!board[index].isValid && selectedPiece !== -1) {
            const piece = selectedPiece;
            const newBoard = [...board];
            const newBank = [...bank];
            newBoard[index] = { ...newBank[selectedPiece] };
            newBank[selectedPiece].isValid = false;
            setBoard(newBoard);
            setBank(newBank);
            setSelectedPiece(-1);
            if (turn) {
                ws.sendMove(piece, index);
                console.log("sent the move!");
            }
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