import { useUserContext } from "../contexts/UserContext";
import { ActionType } from "../reducers/UserReducer";
import { useNavigate } from "react-router-dom";

interface RoomCreationText {
    text: string;
}

export interface Room {
    id: string;
}

const RoomCreationButton: React.FC<RoomCreationText> = ({ text }) => {
    const { state, dispatch, api } = useUserContext();

    const navigate = useNavigate();

    const createRoom = () => {
        const roomCreation = async () => {
            const room = await api.createRoom();
            dispatch({ type: ActionType.CREATE_ROOM, payload: { roomId: room.id } });
            navigate(`/room/?room=${room.id}`);
        }
        roomCreation();
    };

    return (
            <button onClick={createRoom}>
                {text}
            </button>
    );
};

export default RoomCreationButton;