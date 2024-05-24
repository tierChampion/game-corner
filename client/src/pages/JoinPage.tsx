import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalStore from "../stores/GlobalStore";
import { Room } from "../utils/HTTPManager";
import useRoomStore from "../stores/RoomStore";

const JoinPage: React.FC = () => {
    const api = useGlobalStore((state) => state.api);
    const setRoomId = useRoomStore((state) => state.setRoomId);
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const roomsFetch = async () => {
            try {
                setRooms(await api.getAllRooms());
            } catch (err) {
                setRooms([]);
                console.error("Error when connecting to server, could not get rooms.");
            }
        }
        roomsFetch();
    }, []);

    const joinRoom = (roomId: string) => {
        const roomJoining = async (roomId: string) => {
            setRoomId(roomId);
            // navigate(`/room/${roomId}`);
        }
        roomJoining(roomId);
    }

    if (rooms.length > 0) {
        return (
            <>
                {rooms.map((room: Room, index) => (
                    <Link key={index} to={`/room/${room.id}`}>
                        <p onClick={() => joinRoom(room.id)}>
                            {room.id}
                        </p>
                    </Link>
                ))
                }
                <Link to="/">
                    <button>
                        Go back to Home page
                    </button>
                </Link>
            </>
        );
    }
    else {
        return (
            <>
                <div>There are no rooms for now!</div>
                <Link to="/">
                    <button>
                        Go back to Home page
                    </button>
                </Link>
            </>
        );
    }
};

export default JoinPage;