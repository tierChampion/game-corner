import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalStore from "../stores/GlobalStore";
import useQuartoStore from "../stores/QuartoStore";
import useCustomWebSocket, { Command } from "../components/CustomWebSocket";
import { Room } from "../utils/HTTPManager";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import InfoHeader from "@/components/InfoHeader";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";

const RoomPage: React.FC = () => {
    const { api, userId, roomId, setRoomId } = useGlobalStore();
    const startGame = useQuartoStore((state) => state.startGame);
    const navigate = useNavigate();

    const [ready, setReady] = useState<boolean>(false);
    const [members, setMembers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isStarting, setIsStarting] = useState<boolean>(false);

    const { sendJsonMessage, lastJsonMessage } = useCustomWebSocket();

    useEffect(() => {
        const processCommand = async () => {
            if (lastJsonMessage !== null) {
                const command = (lastJsonMessage as Command);
                if (command.action === "members") {
                    const room: Room = await api.getRoom(roomId);
                    setMembers(room.members.sort() || []);
                    setIsLoading(false);
                }
                else if (command.action === "start" && command.params.isValid) {
                    startGame(userId, command);
                    setIsStarting(false);
                    navigate(`../game/${roomId}`);
                }
            }
        }
        processCommand();
    }, [lastJsonMessage]);

    return (
        <div className="w-screen h-screen flex flex-col items-center bg-background">
            <InfoHeader />
            <div className="w-full h-full flex-grow flex items-center justify-around">
                <div className="w-1/2 h-full flex flex-col items-center justify-center">
                    <Label className="text-foreground">Users:</Label>
                    {!isLoading && <div className="w-full h-1/3 flex flex-col items-center border rounded">
                        {members.map((member: string, index: number) => (
                            <Label className="text-foreground" key={index}>
                                {member}
                            </Label>
                        ))}

                    </div>}
                    {isLoading &&
                        <Skeleton className="w-full h-1/3" />
                    }
                </div>
                <div>
                    <div className="w-full flex flex-row justify-center gap-4">
                        <Label className="text-foreground">Ready</Label>
                        <Switch checked={ready} onCheckedChange={() => setReady(!ready)} />
                    </div>
                    <div className="w-full flex flex-row justify-center">
                        <Button disabled={!ready || members.length !== 2} onClick={() => {
                            setIsStarting(true);
                            const startCommand = { action: "start", roomId: roomId };
                            sendJsonMessage(startCommand);
                        }}>
                            {
                                !isStarting &&
                                <Label>
                                    Start game
                                </Label>
                            }
                            {
                                isStarting &&
                                <ReloadIcon className="animate-spin" />
                            }
                        </Button>
                        <Link to="/">
                            <Button variant="destructive" onClick={() => setRoomId("")}>
                                Leave room
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomPage;