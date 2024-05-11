import QuartoPiece, { QuartoPieceData } from "./QuartoPiece";
import RoomContext, { useRoomContext } from "../contexts/RoomContext";
import { RoomActionType } from "../reducers/RoomReducer";
import { QuartoProps } from "./QuartoBoard";

const QuartoPieceBank: React.FC = () => {

    const { state, dispatch } = useRoomContext();

    const selectPiece = (index: number) => {
        dispatch({ type: RoomActionType.SELECT_PIECE, payload: { selectedPiece: index } });
    }

    return (
        <div className="bank">
            {state.bank.map((piece: QuartoPieceData, index: number) => {
                return (
                    <div key={`bank-square-${index}`} 
                    className={"bank-square" + (state.selectedPiece === index ? " selected" : "")} 
                    onClick={() => selectPiece(index)}>
                        <QuartoPiece key={`bank-piece-${index}`} {...piece} />
                    </div>
                )
            })}
        </div>
    );
}

export default QuartoPieceBank;