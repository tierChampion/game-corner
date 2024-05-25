import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalStore from "../stores/GlobalStore";
import useQuartoStore from "../stores/QuartoStore";
import useCustomWebSocket, { Command } from "../components/CustomWebSocket";
import { Room } from "../utils/HTTPManager";

const RoomPage: React.FC = () => {
    const api = useGlobalStore((state) => state.api);
    const userId = useGlobalStore((state) => state.userId);
    const roomId = useGlobalStore((state) => state.roomId);
    const [members, setMembers] = useState<string[]>([]);
    const startGame = useQuartoStore((state) => state.startGame);
    const [ready, setReady] = useState<boolean>(false);
    const navigate = useNavigate();

    const { sendJsonMessage, lastJsonMessage } = useCustomWebSocket();

    useEffect(() => {
        const processCommand = async () => {
            if (lastJsonMessage !== null) {
                const command = (lastJsonMessage as Command);
                if (command.action === "members") {
                    const room: Room = await api.getRoom(roomId);
                    setMembers(room.members.sort() || []);
                }
                else if (command.action === "start" && command.params.isValid) {
                    startGame(userId, command);
                    navigate(`../game/${roomId}`);
                }
            }
        }
        processCommand();
    }, [lastJsonMessage]);

    return (
        <>
            <p>
                {`Room ${roomId}`}
            </p>
            <div>
                Users:
                {members.map((member: string, index: number) => (
                    <p key={index}>{member}</p>
                ))}
            </div>
            <button onClick={() => setReady(!ready)}>
                Ready?
            </button>
            <button disabled={!ready} onClick={() => {
                const startCommand = { action: "start", roomId: roomId };
                sendJsonMessage(startCommand);
            }}>
                Start game
            </button>
            <Link to="/">
                <button>
                    Leave room
                </button>
            </Link>
        </>
    );
};

export default RoomPage;