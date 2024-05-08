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

    return (
        <>
            {rooms.map((room: Room, index) => (
                <Link to={`/room/${room.id}`} key={index}>
                    <p>
                        {room.id}
                    </p>
                </Link>))}
        </>
    );
};

export default JoinPage;