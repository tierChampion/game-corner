export enum UserActionType {
    JOIN_ROOM = "joinRoom",
}
 
export interface UserAction {
    type: UserActionType;
    payload?: any;
}
 
interface UserReducerState {
    userId: string;
    roomId: string;
}
 
export default function userReducer(state: UserReducerState, action: UserAction) {
    switch (action.type) {
        case UserActionType.JOIN_ROOM:
            return {
                ...state,
                roomId: action.payload.roomId,
            }
        default:
            return state;
    }
}
