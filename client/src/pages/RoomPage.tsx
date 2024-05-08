import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { SERVER_SOCKET_URL } from "../env";
import { useUserContext } from "../contexts/UserContext";
import { ActionType } from "../reducers/UserReducer";
import ClientWebSocket from "../utils/Socket";

const RoomPage: React.FC = () => {

    const { state, dispatch, api } = useUserContext();
    const [ready, setReady] = useState<boolean>(false);
    const params = useParams();
    const navigate = useNavigate();
    const ws = useMemo(() => new ClientWebSocket(SERVER_SOCKET_URL, state.userId, 
        params.roomId || "", navigate), []);

    useEffect(() => {
        dispatch({ type: ActionType.JOIN_ROOM, payload: { roomId: params.roomId } })
    }, []);


    return (
        <div>
            {`Room ${params.roomId}`}

            <button onClick={() => setReady(!ready)}>
                Ready?
            </button>
            <Link to="/game">
                <button disabled={!ready} onClick={() => {ws.startGame();}}>
                    Start game
                </button>
            </Link>
            <Link to="/">
                <button onClick={() => {ws.close();}}>
                    Leave room
                </button>
            </Link>
        </div>
    );
};

export default RoomPage;