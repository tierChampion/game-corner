import useQuartoStore from "../stores/QuartoStore";
import "../styles/Quarto.css"
import QuartoBoard from "./QuartoBoard";
import QuartoPieceBank from "./QuartoPieceBank";
import QuartoPiece from "./QuartoPiece";

const QuartoGame: React.FC = () => {
    const piece = useQuartoStore((state) => state.piece);

    return (
        <div className="game-container">
            <QuartoBoard />
            <QuartoPieceBank />
            <div className={"chosen-piece-square"}>
                <QuartoPiece {...piece} />
            </div>
        </div>
    );
}

export default QuartoGame;