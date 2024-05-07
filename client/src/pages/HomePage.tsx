import { Link } from "react-router-dom";
import UserContext, { useUserContext } from "../contexts/UserContext";
import { useContext } from "react";
import RoomCreationButton from "../components/RoomCreation";

const HomePage: React.FC = () => {
    const state = useUserContext().state;

    return (
        <>
            Home page
            <RoomCreationButton text="Create room"/>
            <Link to="/join">
                <button>
                    Join room
                </button>
            </Link>
            <p>
                id: {state.userId}
            </p>
        </>
    );
};

export default HomePage;