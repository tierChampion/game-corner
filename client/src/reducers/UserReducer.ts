export enum ActionType {
    JOIN_ROOM = "joinRoom",
}
 
export interface Action {
    type: ActionType;
    payload?: any;
}
 
interface UserReducerState {
    userId: string;
    roomId: string;
}
 
export default function reducer(state: UserReducerState, action: Action) {

    switch (action.type) {
        case ActionType.JOIN_ROOM:
            return {
                ...state,
                roomId: action.payload.roomId,
            }
        default:
            return state;
    }
}
