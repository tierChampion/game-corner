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

const RoomPage: React.FC = () => {
    const { api, userId, roomId, setRoomId } = useGlobalStore();
    const startGame = useQuartoStore((state) => state.startGame);
    const navigate = useNavigate();

    const [ready, setReady] = useState<boolean>(false);
    const [members, setMembers] = useState<string[]>([]);

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
        <div className="w-screen h-screen flex flex-col items-center bg-slate-400">
            <InfoHeader />
            <Label>Users:</Label>
            <div>
                {members.map((member: string, index: number) => (
                    <p key={index}>{member}</p>
                ))}
            </div>
            <div className="w-full flex flex-row justify-center gap-4">
                <Label>Ready</Label>
                <Switch checked={ready} onCheckedChange={() => setReady(!ready)} />
            </div>
            <div className="w-full flex flex-row justify-center gap-4">
                <Button disabled={!ready || members.length !== 2} onClick={() => {
                    const startCommand = { action: "start", roomId: roomId };
                    sendJsonMessage(startCommand);
                }}>
                    Start game
                </Button>
                <Link to="/">
                    <Button variant="destructive" onClick={() => setRoomId("")}>
                        Leave room
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default RoomPage;