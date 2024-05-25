import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import useGlobalStore from "../stores/GlobalStore";
import QuartoGame from "../components/QuartoGame";
import useQuartoStore, { GameStatus } from "../stores/QuartoStore";
import useCustomWebSocket from "../components/CustomWebSocket";
import { Command } from "../components/CustomWebSocket";

const GamePage: React.FC = () => {
    const api = useGlobalStore((state) => state.api);
    const roomId = useGlobalStore((state) => state.roomId);
    const status = useQuartoStore((state) => state.status);
    const turn = useQuartoStore((state) => state.turn);
    const pick = useQuartoStore((state) => state.pick);
    const place = useQuartoStore((state) => state.place);
    const piece = useQuartoStore((state) => state.piece);
    const updateGame = useQuartoStore((state) => state.updateGame);
    const navigate = useNavigate();

    const { sendJsonMessage, lastJsonMessage } = useCustomWebSocket();

    useEffect(() => {
        const processCommand = async () => {
            if (lastJsonMessage !== null) {
                const command = (lastJsonMessage as Command);
                if (command.action === "end") {
                    navigate(`../room/${roomId}`);
                }
                else if (command.action === "move") {
                    const game = await api.getGame(roomId);
                    updateGame(game);
                }
            }
        }
        processCommand();
    }, [lastJsonMessage]);

    const isMoveValid = () => {
        return status === GameStatus.IN_PROGRESS && turn &&
            pick !== -1 && (place !== -1 || !piece.isValid);
    }

    const sendMove = () => {
        if (isMoveValid()) {
            const moveAction = { action: "move", gameId: roomId, pick: pick, place: place };
            sendJsonMessage(moveAction);
        }
    }

    const statusMessage = () => {
        switch (status) {
            case GameStatus.WON: return "You won!";
            case GameStatus.LOST: return "You lost!";
            case GameStatus.DRAWN: return "draw!";
            default: return turn ? "Your turn" : "";
        }
    }

    return (
        <>
            <QuartoGame />
            <div>{statusMessage()}</div>
            <Link to={`/room/${roomId}`}>
                <button onClick={() => {
                    const endCommand = { action: "end", roomId: roomId };
                    sendJsonMessage(endCommand);
                }}>
                    Leave game
                </button>
            </Link>
            <button disabled={!isMoveValid()}
                onClick={sendMove}>Confirm move</button>
        </>
    );
};

export default GamePage;