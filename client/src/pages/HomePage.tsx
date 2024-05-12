import { Link } from "react-router-dom";
import RoomCreationButton from "../components/RoomCreationButton";
import useGlobalStore from "../stores/GlobalStore";

const HomePage: React.FC = () => {
    const userId = useGlobalStore((state) => state.userId);

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
                id: {userId}
            </p>
        </>
    );
};

export default HomePage;