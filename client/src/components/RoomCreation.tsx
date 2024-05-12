import { useNavigate } from "react-router-dom";
import useGlobalStore from "../stores/GlobalStore";

interface RoomCreationText {
    text: string;
}

export interface Room {
    id: string;
}

const RoomCreationButton: React.FC<RoomCreationText> = ({ text }) => {
    const api = useGlobalStore((state) => state.api);

    const navigate = useNavigate();

    const createRoom = () => {
        const roomCreation = async () => {
            try {
            const room = await api.createRoom();
            navigate(`/room/${room.id}`);
            } catch (err) {
                console.error("Error when connecting to server, could not create room.");
            }
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