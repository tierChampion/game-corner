import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface RoomCreationText {
    text: string;
}

export interface Room {
    id: string;
}

const RoomCreationButton: React.FC<RoomCreationText> = ({ text }) => {
    const { state, api } = useUserContext();

    const navigate = useNavigate();

    const createRoom = () => {
        const roomCreation = async () => {
            const room = await api.createRoom();
            navigate(`/room/${room.id}`);
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