import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import useRoomStore from "../stores/RoomStore";
import useGlobalStore from "../stores/GlobalStore";
import QuartoGame from "../components/QuartoGame";

const GamePage: React.FC = () => {

    const userId = useGlobalStore((state) => state.userId);
    const roomId = useRoomStore((state) => state.roomId);
    const ws = useRoomStore((state) => state.ws);
    const navigate = useNavigate();

    useEffect(() => {
        ws.initialise(userId, roomId || "", navigate);
    }, []);

    return (
        <>
            <QuartoGame/>
            <Link to={`/room/${roomId}`}>
                <button onClick={() => { ws.sendEndGame(); }}>
                    Leave game
                </button>
            </Link>
            <Link to={"/"}>
                <button onClick={() => { ws.close(); }}>
                    Leave room
                </button>
            </Link>
        </>
    );
};

export default GamePage;