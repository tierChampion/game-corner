import useGlobalStore from "@/stores/GlobalStore";
import { Room } from "@/utils/HTTPManager";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

const RoomCreationButton: React.FC = () => {
    const { api, setRoomId } = useGlobalStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const createRoom = () => {
        const roomCreation = async () => {
            setIsLoading(true);
            try {
                api.createRoom().then((room: Room) => {
                    setRoomId(room._id);
                    navigate(`/room/${room._id}`);
                    setIsLoading(false);
                });
            } catch (err) {
                console.error("Error when connecting to server, could not create room.");
                setIsLoading(false);
            }
        }
        roomCreation();
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
                <ReloadIcon className="animate-spin"/>
            }
        </Button>
    );
}

export default RoomCreationButton;