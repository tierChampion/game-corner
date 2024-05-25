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

            style += piece.isBlack ? "black " : "white ";
            style += piece.isTall ? "tall " : "short ";
            style += piece.isSquare ? "square" : "circle";
        }

        return style;
    }

    return (
        <div className={getStyle(pieceData)}>
            {pieceData.hasHole &&
                <div className={getStyle(pieceData) + " hole"}>
                </div>
            }
        </div>
    );
};

export default QuartoPiece;