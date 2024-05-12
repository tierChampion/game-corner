import useQuartoStore from "../stores/QuartoStore";
import "../styles/Quarto.css"
import QuartoBoard from "./QuartoBoard";
import QuartoPieceBank from "./QuartoPieceBank";

const QuartoGame: React.FC = () => {
    const turn = useQuartoStore((state) => state.turn);

    return (
        <div className="game-container">
            <QuartoBoard />
            <QuartoPieceBank />
        </div>
    );
}

export default QuartoGame;