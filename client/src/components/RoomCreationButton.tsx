import useGlobalStore from "@/stores/GlobalStore";
import { Room } from "@/utils/HTTPManager";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "./ui/use-toast";

const RoomCreationButton: React.FC = () => {
    const { api, setRoomId } = useGlobalStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const createRoom = () => {
        setIsLoading(true);
        api.createRoom().then((room: Room) => {
            setRoomId(room._id);
            navigate(`/room/${room._id}`);
            setIsLoading(false);
        }).catch((err) => {
            console.error("Error when connecting to server, could not create room.");
            console.error(err);
            setIsLoading(false);
            toast({
                variant: "destructive",
                title: "Error, could not create the room",
            });
        });
    };

    return (
        <Button onClick={createRoom}>
            {
                !isLoading &&
                <Label>
                    Create room
                </Label>
            }
            {
                isLoading &&
                <ReloadIcon className="animate-spin" />
            }
        </Button>
    );
}

export default RoomCreationButton;