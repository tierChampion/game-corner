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
import { ScrollArea } from "@radix-ui/react-scroll-area";

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
        <>
            <InfoHeader />
            <Label>Users:</Label>
            <div>
                {members.map((member: string, index: number) => (
                    <p key={index}>{member}</p>
                ))}
            </div>
            <Label>Ready</Label>
            <Switch checked={ready} onCheckedChange={() => setReady(!ready)} />
            <Button disabled={!ready} onClick={() => {
                const startCommand = { action: "start", roomId: roomId };
                sendJsonMessage(startCommand);
            }}>
                Start game
            </Button>
            <Link to="/">
                <Button onClick={() => setRoomId("")}>
                    Leave room
                </Button>
            </Link>
        </>
    );
};

export default RoomPage;