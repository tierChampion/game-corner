import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalStore from "../stores/GlobalStore";
import { Room } from "../utils/HTTPManager";
import InfoHeader from "@/components/InfoHeader";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CubeIcon } from "@radix-ui/react-icons";
import RoomCreationButton from "@/components/RoomCreationButton";

const JoinPage: React.FC = () => {
    const { api, setRoomId } = useGlobalStore();
    const navigate = useNavigate();
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
        }
        initialFetch();
    }, []);

    const joinRoom = (roomId: string) => {
        const roomJoining = async (roomId: string) => {
            const newRooms = await roomsFetch();
            if (newRooms.find((room: Room) => room.id === roomId) !== undefined) {
                setRoomId(roomId);
                navigate(`/room/${roomId}`);
            } else {
                console.error("Error, the room was inactive for too long.");
                setRooms(newRooms);
            }
        }
        roomJoining(roomId);
    }

    if (rooms.length > 0) {
        return (
            <>
                {rooms.map((room: Room, index) => (
                    <Button key={index} onClick={() => joinRoom(room.id)}>
                        {room.id + " (" + room.members.length + ")"}
                    </Button>
                ))
                }
                <Link to="/">
                    <Button>
                        Go back to Home page
                    </Button>
                </Link>
            </>
        );
    }
    else {
        return (
            <div className="h-screen w-screen flex flex-col bg-slate-400">
                <InfoHeader />
                <Alert>
                    <CubeIcon></CubeIcon>
                    <AlertTitle>There are no rooms for now.</AlertTitle>
                    <AlertDescription>Come back later or create your own!</AlertDescription>
                </Alert>
                <RoomCreationButton />
                <Link to="/">
                    <Button className="w-full">
                        Go back to Home page
                    </Button>
                </Link>
            </div>
        );
    }
};

export default JoinPage;