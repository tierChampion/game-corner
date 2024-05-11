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
            if (state.selectedPiece === action.payload.selectedPiece) {
                return {
                    ...state,
                    selectedPiece: -1,
                }
            }
            else {
                return {
                    ...state,
                    selectedPiece: action.payload.selectedPiece,
                }
            }

        case RoomActionType.PLACE_PIECE:
            if (state.bank[action.payload.index].isValid && state.selectedPiece !== -1) {
                const newBoard = [...state.board];
                const newBank = [...state.bank];
                newBoard[action.payload.index] = { ...state.bank[state.selectedPiece] };
                newBank[state.selectedPiece].isValid = false;
                return {
                    board: newBoard,
                    bank: newBank,
                    selectedPiece: -1,
                }
            } else {
                return state;
            }

        default:
            return state;
    }
}