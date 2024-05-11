import "../styles/Quarto.css"
import QuartoPiece, { QuartoPieceData } from "./QuartoPiece";
import useQuartoStore from "../stores/QuartoStore";

const QuartoPieceBank: React.FC = () => {

    const bank = useQuartoStore((state) => state.bank);
    const selectedPiece = useQuartoStore((state) => state.selectedPiece);
    const setSelectedPiece = useQuartoStore((state) => state.setSelectedPiece);

    return (
        <div className="bank">
            {bank.map((piece: QuartoPieceData, index: number) => {
                return (
                    <div key={`bank-square-${index}`} 
                    className={"bank-square" + (selectedPiece === index ? " selected" : "")} 
                    onClick={() => setSelectedPiece((selectedPiece !== index) ? index : -1)}>
                        <QuartoPiece key={`bank-piece-${index}`} {...piece} />
                    </div>
                )
            })}
        </div>
    );
}

export default QuartoPieceBank;