import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { Room } from "../components/RoomCreation";

const JoinPage: React.FC = () => {

    const api = useUserContext().api;

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const roomsFetch = async () => {
            setRooms(await api.getAllRooms());
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