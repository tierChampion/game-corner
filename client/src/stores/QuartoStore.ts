import { create } from "zustand";
import { QuartoPieceData } from "../components/QuartoPiece";

interface QuartoState {
    selectedPiece: number;
    board: QuartoPieceData[];
    bank: QuartoPieceData[];
    setSelectedPiece: (newSelectedPiece: number) => void;
    setBoard: (newBoard: QuartoPieceData[]) => void;
    setBank: (newBank: QuartoPieceData[]) => void;
}

const getInitialBoard = () => {
    const board = [];
    for (let i = 0; i < 4 * 4; i++) {
        board.push({
            isValid: false,
            isBlack: false,
            isTall: false,
            isSquare: false,
            hasHole: false,
        });
    }
    return board;
};

const getInitialBank = () => {
    const bank = [];
    for (let i = 0; i < 4 * 4; i++) {
        bank.push({
            isValid: true,
            isBlack: (i & 8) === 0,
            isTall: (i & 4) !== 0,
            isSquare: (i & 2) === 0,
            hasHole: (i & 1) !== 0,
        });
    }
    return bank;
};

const useQuartoStore = create<QuartoState>()((set) => ({
    selectedPiece: -1,
    board: getInitialBoard(),
    bank: getInitialBank(),
    setSelectedPiece: (newSelectedPiece: number) => set(() => ({ selectedPiece: newSelectedPiece })),
    setBoard: (newBoard: QuartoPieceData[]) => set(() => ({ board: newBoard })),
    setBank: (newBank: QuartoPieceData[]) => set(() => ({ bank: newBank })),
}));

export default useQuartoStore;