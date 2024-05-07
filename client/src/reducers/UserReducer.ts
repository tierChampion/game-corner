import { isShorthandPropertyAssignment } from "typescript";

export enum ActionType {
    CREATE_ROOM = "createRoom",
    JOIN_ROOM = "joinRoom",
    SET_HOST = "setHost",
}
 
export interface Action {
    type: ActionType;
    payload?: any;
}
 
interface UserReducerState {
    userId: string;
    roomId: string;
    isHost: boolean;
}
 
export default function reducer(state: UserReducerState, action: Action) {

    switch (action.type) {
        case ActionType.CREATE_ROOM:
            return {
                ...state,
                roomId: action.payload.roomId,
                isHost: true,
            }
        case ActionType.JOIN_ROOM:
            return {
                ...state,
                roomId: action.payload.roomId,
                isHost: false,
            }
        case ActionType.SET_HOST:
            return {
                ...state,
                isHost: action.payload.isHost,
            }
        default:
            return state;
    }
}
