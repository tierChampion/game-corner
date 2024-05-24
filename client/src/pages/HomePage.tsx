import { Link, useNavigate } from "react-router-dom";
import useGlobalStore from "../stores/GlobalStore";
import { Room } from "../utils/HTTPManager";
import useRoomStore from "../stores/RoomStore";

const HomePage: React.FC = () => {
    const api = useGlobalStore((state) => state.api);
    const userId = useGlobalStore((state) => state.userId);
    const setRoomId = useRoomStore((state) => state.setRoomId);
    const navigate = useNavigate();

    const createRoom = () => {
        const roomCreation = async () => {
            try {
                const room: Room = await api.createRoom();
                setRoomId(room.id);
                navigate(`/room/${room.id}`);
            } catch (err) {
                console.error("Error when connecting to server, could not create room.");
            }
        }
        roomCreation();
    };

    return (
        <>
            Home page
            <button onClick={createRoom}>
                Create room
            </button>
            <Link to="/join">
                <button>
                    Join room
                </button>
            </Link>
            <p>
                id: {userId}
            </p>
        </>
    );
};

export default HomePage;