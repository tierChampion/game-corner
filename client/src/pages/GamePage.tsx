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
    const api = useGlobalStore((state) => state.api);
    const userId = useGlobalStore((state) => state.userId);
    const roomId = useRoomStore((state) => state.roomId);
    const gameState = useQuartoStore((state) => state.gameState);
    const turn = useQuartoStore((state) => state.turn);
    const setTurn = useQuartoStore((state) => state.setTurn);
    const navigate = useNavigate();

    const {sendJsonMessage, lastJsonMessage} = useTestWebSocket();

    useEffect(() => {
        const processCommand = async () => {
            if (lastJsonMessage !== null) {
                const command = (lastJsonMessage as Command);
                if (command.action === "end") {
                    navigate(`../room/${roomId}`);
                }
                else if (command.action === "move") {
                    // fetch new board from the server
                    const game = await api.getGame(roomId);
                    console.log(game);
                }
            }
        }
        processCommand();
    }, [lastJsonMessage]);

    const sendMove = () => {
        const moveAction = {action: "move", gameId: roomId, pick: 0, place: -1};
        sendJsonMessage(moveAction);
    }

    return (
        <>
            <QuartoGame />
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
            <button onClick={sendMove}>Send random move!</button>
        </>
    );
};

export default GamePage;