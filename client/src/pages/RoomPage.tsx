import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useRoomStore from "../stores/RoomStore";
import useGlobalStore from "../stores/GlobalStore";
import useQuartoStore from "../stores/QuartoStore";

const RoomPage: React.FC = () => {

    const userId = useGlobalStore((state) => state.userId);
    const setRoomId = useRoomStore((state) => state.setRoomId);
    const ws = useRoomStore((state) => state.ws);
    const startGame = useQuartoStore((state) => state.startGame);
    const [ready, setReady] = useState<boolean>(false);
    const params = useParams();
    const roomId = params.roomId || "";
    const navigate = useNavigate();

    const handleGameStart = (command: any) => {
        startGame(userId, command);
    };

    useEffect(() => {
        setRoomId(roomId);
        ws.initialise(userId, params.roomId || "", navigate);
        ws.setGameStartAction(handleGameStart);
    }, []);


    return (
        <div>
            {`Room ${params.roomId}`}

            <button onClick={() => setReady(!ready)}>
                Ready?
            </button>
            <button disabled={!ready} onClick={() => {
                ws.sendStartGame();
            }}>
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