import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { UserActionType } from "../reducers/UserReducer";
import { useRoomContext } from "../contexts/RoomContext";

const RoomPage: React.FC = () => {

    const { state, dispatch, api } = useUserContext();
    const ws = useRoomContext().ws;
    const [ready, setReady] = useState<boolean>(false);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch({ type: UserActionType.JOIN_ROOM, payload: { roomId: params.roomId } })
        ws.initialise(state.userId, params.roomId || "", navigate);
    }, []);


    return (
        <div>
            {`Room ${params.roomId}`}

            <button onClick={() => setReady(!ready)}>
                Ready?
            </button>
            <button disabled={!ready} onClick={() => { ws.sendStartGame(); }}>
                Start game
            </button>
            <Link to="/">
                <button onClick={() => { ws.close(); }}>
                    Leave room
                </button>
            </Link>
        </div>
    );
};

export default RoomPage;