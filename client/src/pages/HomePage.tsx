import { Link, useNavigate } from "react-router-dom";
import useGlobalStore from "../stores/GlobalStore";
import { Room } from "../utils/HTTPManager";
import { Button } from "@/components/ui/button";

const HomePage: React.FC = () => {
    const {api, userId, setRoomId} = useGlobalStore();
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
            <Button onClick={createRoom}>
                Create room
            </Button>
            <Link to="/join">
                <Button>
                    Join room
                </Button>
            </Link>
            <p>
                id: {userId}
            </p>
        </>
    );
};

export default HomePage;