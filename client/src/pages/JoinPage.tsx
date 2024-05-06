import { Link } from "react-router-dom";

const JoinPage: React.FC = () => {
    return (
        <Link to="/room">
            <button>
                Join
            </button>
        </Link>
    );
};

export default JoinPage;