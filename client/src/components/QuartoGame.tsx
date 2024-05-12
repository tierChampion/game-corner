import "../styles/Quarto.css"
import QuartoBoard from "./QuartoBoard";
import QuartoPieceBank from "./QuartoPieceBank";

const QuartoGame: React.FC = () => {

    return (
        <div className="game-container">
            <QuartoBoard />
            <QuartoPieceBank />
        </div>
    );
}

export default QuartoGame;