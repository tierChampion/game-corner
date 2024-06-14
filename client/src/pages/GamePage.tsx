import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { ReloadIcon } from "@radix-ui/react-icons";

const GamePage: React.FC = () => {
    const { api, roomId } = useGlobalStore();
    const { status, turn, pick, place, piece, updateGame } = useQuartoStore();
    const navigate = useNavigate();

    const [isSendingMove, setIsSendingMove] = useState<boolean>(false);

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
                    setIsSendingMove(false);
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
            setIsSendingMove(true);
            const moveAction = { action: "move", gameId: roomId, pick: pick, place: place };
            sendJsonMessage(moveAction);
        } else {
            console.error("Error, the move you tried to send is not valid.");
        }
    }

    const statusMessage = () => {
        switch (status) {
            case GameStatus.WON: return "You won!";
            case GameStatus.LOST: return "You lost!";
            case GameStatus.DRAWN: return "Draw!";
            default: return turn ? "Your turn" : "Waiting...";
        }
    }

    return (
        <div className="w-screen h-screen flex flex-col items-center bg-background overflow-hidden">
            <InfoHeader />
            <div className="w-full flex flex-row items-center justify-around grow">
                <div className="w-1/2 h-3/4 flex items-center justify-center">
                    <QuartoBoard />
                    <QuartoBank />
                </div>
                <div className="w-1/2 h-full flex flex-col justify-center items-center">
                    <div className="w-1/4 h-1/3 flex flex-col items-center justify-center gap-5">
                        <div className="flex flex-col items-center">
                            <Label className="text-foreground">{statusMessage()}</Label>
                            <Label className="text-foreground">Piece to play</Label>
                        </div>
                        <div className="scale-125 chosen-piece-square w-1/2">
                            {place === -1 &&
                                <QuartoPiece {...piece} />
                            }
                        </div>
                    </div>
                    <div className="w-full h-1/4 flex items-center justify-center">
                        <Link to={`/room/${roomId}`}>
                            <Button variant="destructive" onClick={() => {
                                const endCommand = { action: "end", roomId: roomId };
                                sendJsonMessage(endCommand);
                            }}>
                                Leave game
                            </Button>
                        </Link>
                        <Button disabled={!isMoveValid()}
                            onClick={sendMove}>
                            {
                                !isSendingMove &&
                                <Label>
                                    Confirm move
                                </Label>
                            }
                            {
                                isSendingMove &&
                                <ReloadIcon className="animate-spin" />
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;