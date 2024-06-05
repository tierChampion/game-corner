import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalStore from "../stores/GlobalStore";
import { Room } from "../utils/HTTPManager";
import InfoHeader from "@/components/InfoHeader";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CubeIcon, ReloadIcon } from "@radix-ui/react-icons";
import RoomCreationButton from "@/components/RoomCreationButton";
import { Separator } from "@radix-ui/react-separator";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "@radix-ui/react-label";

const JoinPage: React.FC = () => {
    const { api, setRoomId } = useGlobalStore();
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [roomWaiting, setRoomWaiting] = useState<number>(-1);
    const [rooms, setRooms] = useState<Room[]>([]);

    const roomsFetch = async () => {
        try {
            return await api.getAllRooms();
        } catch (err) {
            console.error("Error when connecting to server, could not get rooms.");
            return [];
        }
    }

    useEffect(() => {
        const initialFetch = async () => {
            setRooms(await roomsFetch());
            setLoaded(true);
        }
        initialFetch();
    }, []);

    const joinRoom = (index: number, roomId: string) => {
        setRoomWaiting(index);
        roomsFetch().then((newRooms) => {
            const room = newRooms.find((room: Room) => room._id === roomId);
            setRoomWaiting(-1);
            if (room !== undefined && room.members.length < 2) {
                setRoomId(roomId);
                navigate(`/room/${roomId}`);
            } else if (room !== undefined) {
                console.error("Error, the room you want to join is already full!");
            } else {
                console.error("Error, the room was inactive for too long.");
                setRooms(newRooms);
            }
        });
    }

    if (rooms.length > 0 || !loaded) {
        return (
            <div className="h-screen w-screen flex flex-col items-center bg-background">
                <InfoHeader />
                <div className="w-3/5 max-h-3/5 p-4 flex flex-col items-center">
                    <h4 className="mb-4 text-sm font-medium leading-none text-foreground">Rooms</h4>
                    {loaded &&
                        <ScrollArea className="w-full h-2/3 rounded-md border overflow-x-auto">
                            {rooms.map((room: Room, index) => (
                                <div key={index}>
                                    <Button variant="ghost" className="w-full text-foreground" onClick={() => joinRoom(index, room._id)}>
                                        {
                                            index !== roomWaiting &&
                                            <Label>
                                                {room._id}
                                            </Label>
                                        }
                                        {
                                            index === roomWaiting &&
                                            <ReloadIcon className="animate-spin" />
                                        }
                                    </Button>
                                    <Separator className="my-2" />
                                </div>
                            ))}
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                    }
                </div>
                <Link to="/" className="w-1/4 flex justify-center">
                    <Button>
                        Go back to Home page
                    </Button>
                </Link>
            </div>
        );
    }
    else {
        return (
            <div className="h-screen w-screen flex flex-col items-center bg-background">
                <InfoHeader />
                <Alert className="w-3/4">
                    <CubeIcon></CubeIcon>
                    <AlertTitle>There are no rooms for now.</AlertTitle>
                    <AlertDescription>Come back later or create your own!</AlertDescription>
                </Alert>
                <RoomCreationButton />
                <Link to="/" className="w-1/4 flex justify-center">
                    <Button>
                        Go back to Home page
                    </Button>
                </Link>
            </div>
        );
    }
};

export default JoinPage;