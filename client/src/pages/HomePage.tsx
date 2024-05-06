import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import { useContext } from "react";

const HomePage: React.FC = () => {

    const state = useContext(UserContext);

    return (
        <>
            Home page
            <Link to="/room">
                <button>
                    Create room
                </button>
            </Link>
            <Link to="/join">
                <button>
                    Join room
                </button>
            </Link>
            <p>
                id: {state.id}
            </p>
        </>
    );
};

export default HomePage;