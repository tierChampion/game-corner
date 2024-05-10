import { useEffect, useState, useContext } from "react";
import QuartoPiece, { QuartoPieceData } from "./QuartoPiece";
import RoomContext, { useRoomContext } from "../contexts/RoomContext";
import { RoomActionType } from "../reducers/RoomReducer";

const QuartoPieceBank: React.FC = () => {

    const {state, dispatch} = useRoomContext();
    const [pieces, setPieces] = useState<QuartoPieceData[]>(state.bank);

    const selectPiece = (index: number) => {
        dispatch({type: RoomActionType.SELECT_PIECE, payload: {selectedPiece: index}});
    }

    useEffect(() => {
        setPieces(state.bank);
    }, [state.bank]);

    return (
        <div className="bank">
            {state.bank.map((piece: QuartoPieceData, index: number) => {
                return (
                    <div key={`bank-square-${index}`} className="bank-square" onClick={() => selectPiece(index)}>
                        <QuartoPiece key={`bank-piece-${index}`} {...piece} />
                    </div>
                )
            })}
        </div>
    );
}

export default QuartoPieceBank;