import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import useRoomStore from "../stores/RoomStore";
import useGlobalStore from "../stores/GlobalStore";
import QuartoGame from "../components/QuartoGame";
import useQuartoStore from "../stores/QuartoStore";
import useTestWebSocket from "../components/WebSocket";
import { Command } from "../components/WebSocket";

const GamePage: React.FC = () => {

    // centralise the game on the server.

    const userId = useGlobalStore((state) => state.userId);
    const roomId = useRoomStore((state) => state.roomId);
    const gameState = useQuartoStore((state) => state.gameState);
    const turn = useQuartoStore((state) => state.turn);
    const setTurn = useQuartoStore((state) => state.setTurn);
    const executeMove = useQuartoStore((state) => state.executeMove);
    const navigate = useNavigate();

    const {sendJsonMessage, lastJsonMessage} = useTestWebSocket();

    useEffect(() => {
        const processCommand = async () => {
            if (lastJsonMessage !== null) {
                const command = (lastJsonMessage as Command);
                if (command.action === "end") {
                    navigate(`../room/${roomId}`);
                }
            }
        }
        processCommand();
    }, [lastJsonMessage]);

    return (
        <>
            {/* <QuartoGame /> */}
            {turn && <div>Your turn.</div>}
            {gameState === "winner" && <div>You won!</div>}
            {gameState === "loser" && <div>You lost!</div>}
            {gameState === "draw" && <div>Game drawn!</div>}
            <Link to={`/room/${roomId}`}>
                <button onClick={() => { 
                    const endCommand = {action: "end", roomId: roomId};
                    sendJsonMessage(endCommand);
                 }}>
                    Leave game
                </button>
            </Link>
        </>
    );
};

export default GamePage;