import { useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "../components/Dropdown";

const GAME_MODES = [
    "Quarto",
    "Tic-Tac-Toe"
];

const RoomPage: React.FC = () => {

    const [ready, setReady] = useState<boolean>(false);

    return (
        <div>
            Room page
            <Dropdown list={GAME_MODES}/>
            <button onClick={() => setReady(!ready)}>
                Ready?
            </button>
            <Link to="/game">
                <button disabled={!ready}>
                    Start game
                </button>
            </Link>
            <button>Leave room</button>
        </div>
    );
};

export default RoomPage;