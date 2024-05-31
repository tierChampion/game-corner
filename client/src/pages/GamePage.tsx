import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useGlobalStore from "../stores/GlobalStore";
import QuartoBoard from "@/components/QuartoBoard";
import QuartoBank from "@/components/QuartoBank";
import QuartoPiece from "@/components/QuartoPiece";
import useQuartoStore, { GameStatus } from "../stores/QuartoStore";
import useCustomWebSocket from "../components/CustomWebSocket";
import { Command } from "../components/CustomWebSocket";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import InfoHeader from "@/components/InfoHeader";

const GamePage: React.FC = () => {
    const { api, roomId } = useGlobalStore();
    const { status, turn, pick, place, piece, updateGame } = useQuartoStore();
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
            default: return turn ? "Your turn" : "Waiting for the opponent...";
        }
    }

    return (
        <div className="w-screen h-screen flex flex-col items-center bg-background overflow-hidden">
            <InfoHeader />
            <div className="w-full flex flex-row items-center justify-around grow">
                <div className="flex items-center">
                    <QuartoBoard />
                    <QuartoBank />
                </div>
                <div className="h-full flex flex-col justify-around">
                    <div className="flex flex-col items-center gap-5">
                        <div className="flex flex-col items-center gap-8">
                            <Label className="text-foreground">{statusMessage()}</Label>
                            <Label className="text-foreground">Piece to play</Label>
                        </div>
                        <div className="scale-125 chosen-piece-square">
                            {place === -1 &&
                                <QuartoPiece {...piece} />
                            }
                        </div>
                    </div>
                    <div className="w-1/2 flex items-center justify-around">
                        <Link to={`/room/${roomId}`}>
                            <Button variant="destructive" onClick={() => {
                                const endCommand = { action: "end", roomId: roomId };
                                sendJsonMessage(endCommand);
                            }}>
                                Leave game
                            </Button>
                        </Link>
                        <Button disabled={!isMoveValid()}
                            onClick={sendMove}>Confirm move</Button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;