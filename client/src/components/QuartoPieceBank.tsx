import "../styles/Quarto.css"
import QuartoPiece, { QuartoPieceData } from "./QuartoPiece";
import useQuartoStore from "../stores/QuartoStore";

const QuartoPieceBank: React.FC = () => {
    const turn = useQuartoStore((state) => state.turn);
    const bank = useQuartoStore((state) => state.bank);
    const pick = useQuartoStore((state) => state.pick);
    const setPick = useQuartoStore((state) => state.setPick);

    const selectPiece = (index: number) => {
        if (turn && bank[index].isValid) {
            setPick((pick !== index) ? index : -1)
        }
    }

    return (
        <div className="bank">
            {bank.map((piece: QuartoPieceData, index: number) => {
                return (
                    <div key={`bank-square-${index}`}
                        className={"bank-square" + (pick === index ? " selected" : "")}
                        onClick={() => selectPiece(index)}>
                        <QuartoPiece key={`bank-piece-${index}`} {...piece} />
                    </div>
                )
            })}
        </div>
    );
}

export default QuartoPieceBank;