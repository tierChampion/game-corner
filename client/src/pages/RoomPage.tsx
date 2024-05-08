import { useEffect, useState } from "react";
import { Link, useParams, useNavigation, useNavigate } from "react-router-dom";
import { SERVER_SOCKET_URL } from "../env";
import { useUserContext } from "../contexts/UserContext";
import { ActionType } from "../reducers/UserReducer";

const RoomPage: React.FC = () => {

    const { state, dispatch, api } = useUserContext();
    const ws = new WebSocket(SERVER_SOCKET_URL);
    const [ready, setReady] = useState<boolean>(false);
    const [members, setMembers] = useState<string[]>([]);
    const params = useParams();
    const navigate = useNavigate();

    const startGame = () => {
        const startCommand = { action: "startGame", roomId: params.roomId };
        ws.send(JSON.stringify(startCommand));
    };

    useEffect(() => {
        dispatch({ type: ActionType.JOIN_ROOM, payload: { roomId: params.roomId } })

        ws.onopen = () => {
            const connectionCommand = { action: "connect", roomId: params.roomId, userId: state.userId };
            ws.send(JSON.stringify(connectionCommand));
        }
        ws.onmessage = (event) => {
            if (event.data === "ping") {
                ws.send("pong");
            }
            else if (event.data === "updateMembers") {
                const getMembers = async () => {
                    setMembers((await api.getRoom(params.roomId || "")).members);
                }
                getMembers();
            }
            else if (event.data === "startGame") {
                navigate("../game");
            }
        }

        return () => { ws.close(); }
    }, []);


    return (
        <div>
            Room page
            <p> Members: </p>
            {members.map((member, index) => {
                return (
                    <p key={index}>
                        {member}
                    </p>
                );
            })}

            <button onClick={() => setReady(!ready)}>
                Ready?
            </button>
            <Link to="/game">
                <button disabled={!ready} onClick={startGame}>
                    Start game
                </button>
            </Link>
            <Link to="/">
                <button onClick={() => ws.close()}>
                    Leave room
                </button>
            </Link>
        </div>
    );
};

export default RoomPage;