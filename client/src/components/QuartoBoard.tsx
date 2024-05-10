import { useEffect, useState } from "react";
import QuartoPiece, { QuartoPieceData } from "./QuartoPiece";
import "../styles/Quarto.css";
import { useRoomContext } from "../contexts/RoomContext";
import { RoomActionType } from "../reducers/RoomReducer";

const QuartoBoard: React.FC = () => {

    const { state, dispatch } = useRoomContext();
    const [pieces, setPieces] = useState<QuartoPieceData[]>(state.board);

    const placePiece = (index: number) => {
        if (!state.board[index].isValid && state.selectedPiece !== -1) {
            dispatch({ type: RoomActionType.PLACE_PIECE, payload: { index: index } });
            console.log(state.board);
            setPieces(state.board);
        }
    };

    return (
        <div className="board">
            <div className="ring">
                <div className="play-board">
                    {state.board.map((piece: QuartoPieceData, index: number) => {
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