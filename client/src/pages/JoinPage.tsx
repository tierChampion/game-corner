import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Room } from "../components/RoomCreation";
import useGlobalStore from "../stores/GlobalStore";

const JoinPage: React.FC = () => {

    const api = useGlobalStore((state) => state.api);

    const [rooms, setRooms] = useState([]);

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

    if (rooms.length > 0) {
        return (
            <>
                {rooms.map((room: Room, index) => (
                    <Link to={`/room/${room.id}`} key={index}>
                        <p>
                            {room.id}
                        </p>
                    </Link>))
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