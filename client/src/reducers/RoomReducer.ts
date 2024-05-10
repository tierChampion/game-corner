import { QuartoPieceData } from "../components/QuartoPiece";

export enum RoomActionType {
    SELECT_PIECE = "selectPiece",
    PLACE_PIECE = "placePiece",
}

export interface RoomAction {
    type: RoomActionType;
    payload?: any;
}

interface RoomReducerState {
    selectedPiece: number;
    board: QuartoPieceData[];
    bank: QuartoPieceData[];
}

export default function roomReducer(state: RoomReducerState, action: RoomAction) {
    switch (action.type) {
        case RoomActionType.SELECT_PIECE:
            return {
                ...state,
                selectedPiece: action.payload.selectedPiece,
            }

        case RoomActionType.PLACE_PIECE:
            const newBoard = [...state.board];
            const newBank = [...state.bank];
            newBoard[action.payload.index] = {...state.bank[state.selectedPiece]};
            newBank[state.selectedPiece].isValid = false;
            return {
                board: newBoard,
                bank: newBank,
                selectedPiece: -1,
            }
        default:
            return state;
    }
}