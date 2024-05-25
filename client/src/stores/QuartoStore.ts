import { create } from "zustand";
import { QuartoPieceData } from "../components/QuartoPiece";

// whether the game is done or not
// myTurn
// board
// bank
// pick
// place
// piece

interface QuartoState {
    gameState: string;
    turn: boolean;
    board: QuartoPieceData[];
    bank: QuartoPieceData[];
    piece: QuartoPieceData;
    pick: number;
    place: number;
    setTurn: (newTurn: boolean) => void;
    setBoard: (newBoard: QuartoPieceData[]) => void;
    setBank: (newBank: QuartoPieceData[]) => void;
    setPiece: (newPiece: QuartoPieceData) => void;
    setPick: (newPick: number) => void;
    setPlace: (newPlace: number) => void;
    startGame: (userId: string, command: any) => void;
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

const getPiece = (index: number) => {
    if (index === -1) {
        return {
            isValid: false,
            isBlack: false,
            isTall: false,
            isSquare: false,
            hasHole: false,
        }
    } else {
        return {
            isValid: true,
            isBlack: (index & 8) === 0,
            isTall: (index & 4) !== 0,
            isSquare: (index & 2) === 0,
            hasHole: (index & 1) !== 0,
        }
    }
}

const analyseBoardState = (board: QuartoPieceData[]) => {
    for (let i = 0; i < 4; i++) {
        const first = board[i * 5];
        if (first.isValid) {
            for (let d = 0; d < 2; d++) {
                let matches = [true, true, true, true];
                for (let j = 0; j < 4; j++) {
                    const index = d === 0 ? i * 4 + j : j * 4 + i;
                    const other = board[index];
                    if (other === first) continue;
                    if (!other.isValid) {
                        matches[0] = false;
                        matches[1] = false;
                        matches[2] = false;
                        matches[3] = false;
                        break;
                    }
                    matches[0] = matches[0] && (other.isBlack === first.isBlack);
                    matches[1] = matches[1] && (other.isSquare === first.isSquare);
                    matches[2] = matches[2] && (other.isTall === first.isTall);
                    matches[3] = matches[3] && (other.hasHole === first.hasHole);
                }
                if (matches[0] || matches[1] || matches[2] || matches[3]) return "win";
            }
        }
    }

    for (let d = 0; d < 2; d++) {
        const first = board[d * 3];
        if (first.isValid) {
            let matches = [true, true, true, true];
            for (let i = 1; i < 4; i++) {
                const index = (d === 0) ? 5 * i : 3 * (i + 1);
                const other = board[index];
                if (!other.isValid) {
                    matches[0] = false;
                    matches[1] = false;
                    matches[2] = false;
                    matches[3] = false;
                    break;
                }
                matches[0] = matches[0] && (other.isBlack === first.isBlack);
                matches[1] = matches[1] && (other.isSquare === first.isSquare);
                matches[2] = matches[2] && (other.isTall === first.isTall);
                matches[3] = matches[3] && (other.hasHole === first.hasHole);
            }
            if (matches[0] || matches[1] || matches[2] || matches[3]) return "win";
        }
    }

    let validCount = 0;
    for (let i = 0; i < 4 * 4; i++) {
        validCount += board[i].isValid === true ? 1 : 0;
    }

    return validCount === 16 ? "draw" : "";
}

const useQuartoStore = create<QuartoState>()((set) => ({
    gameState: "",
    turn: false,
    board: getInitialBoard(),
    bank: getInitialBank(),
    piece: getPiece(-1),
    pick: -1,
    place: -1,
    setTurn: (newTurn) => set(() => ({ turn: newTurn })),
    setBoard: (newBoard: QuartoPieceData[]) => set((state) => {
        const newValue = state.turn ? newBoard : state.board;
        return { board: newValue };
    }),
    setBank: (newBank: QuartoPieceData[]) => set((state) => {
        const newValue = state.turn ? newBank : state.bank;
        return { bank: newValue };
    }),
    setPiece: (newPiece: QuartoPieceData) => set(() => {
        return {piece: newPiece};
    }),
    setPick: (newPick: number) => set(() => {
        return { pick: newPick };
    }),
    setPlace: (newPlace: number) => set(() => {
        return { place: newPlace };
    }),
    startGame: (userId: string, command: any) => set(() => {
        return {
            gameState: "",
            board: getInitialBoard(),
            bank: getInitialBank(),
            selectedPiece: -1,
            turn: command.params.start === userId,
        };
    }),
}));

export default useQuartoStore;
