import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import useRoomStore from "../stores/RoomStore";
import useGlobalStore from "../stores/GlobalStore";
import QuartoGame from "../components/QuartoGame";
import useQuartoStore from "../stores/QuartoStore";

const GamePage: React.FC = () => {

    const userId = useGlobalStore((state) => state.userId);
    const roomId = useRoomStore((state) => state.roomId);
    const ws = useRoomStore((state) => state.ws);
    const gameState = useQuartoStore((state) => state.gameState);
    const turn = useQuartoStore((state) => state.turn);
    const setTurn = useQuartoStore((state) => state.setTurn);
    const executeMove = useQuartoStore((state) => state.executeMove);
    const navigate = useNavigate();

    const handleMove = (command: any) => {
        executeMove(command);
    }

    useEffect(() => {
        setTurn(ws.getLastCommand().params?.start === userId);
        ws.initialise(userId, roomId || "", navigate);
        ws.setMoveAction(handleMove);
    }, []);

    return (
        <>
            <QuartoGame />
            {turn && <div>Your turn.</div>}
            {gameState === "winner" && <div>You won!</div>}
            {gameState === "loser" && <div>You lost!</div>}
            {gameState === "draw" && <div>Game drawn!</div>}
            <Link to={`/room/${roomId}`}>
                <button onClick={() => { ws.sendEndGame(); }}>
                    Leave game
                </button>
            </Link>
        </>
    );
};

export default GamePage;