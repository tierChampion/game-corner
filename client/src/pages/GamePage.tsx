import { Link, useNavigate, useParams } from "react-router-dom";
import { useRoomContext } from "../contexts/RoomContext";
import { useEffect } from "react";
import { useUserContext } from "../contexts/UserContext";

const GamePage: React.FC = () => {

    const state = useUserContext().state;
    const ws = useRoomContext().ws;
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        ws.initialise(state.userId, params.roomId || "", navigate);
    }, []);

    return (
        <>
            <div>
                Game page
            </div>
            <Link to={`/room/${params.roomId}`}>
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