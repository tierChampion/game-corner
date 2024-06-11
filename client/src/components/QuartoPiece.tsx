import "../styles/Quarto.css"

export interface QuartoPieceData {
    isValid: boolean;
    isBlack: boolean;
    isTall: boolean;
    isSquare: boolean;
    hasHole: boolean;
}

const QuartoPiece: React.FC<QuartoPieceData> = (pieceData) => {
    const getStyle = (piece: QuartoPieceData) => {
        let style = "piece";
        if (piece.isValid) {
            style += " valid ";

            // fix colors for dark and light mode
            style += piece.isBlack ? "black " : "white ";
            style += piece.isTall ? "scale-110 " : "scale-75 ";
            style += piece.isSquare ? " " : "rounded-full ";
        }

        return style;
    }

    return (
        <div className={getStyle(pieceData)}>
            {pieceData.hasHole &&
                <div className={getStyle(pieceData) + " scale-90"}/>
            }
        </div>
    );
};

export default QuartoPiece;