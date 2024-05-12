import { create } from "zustand";
import { QuartoPieceData } from "../components/QuartoPiece";

interface QuartoState {
    gameState: string;
    turn: boolean;
    selectedPiece: number;
    board: QuartoPieceData[];
    bank: QuartoPieceData[];
    setSelectedPiece: (newSelectedPiece: number) => void;
    setBoard: (newBoard: QuartoPieceData[]) => void;
    setBank: (newBank: QuartoPieceData[]) => void;
    setTurn: (newTurn: boolean) => void;
    startGame: (userId: string, command: any) => void;
    executeMove: (command: any) => void;
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

// this doesnt work
const analyseBoardState = (board: QuartoPieceData[]) => {
    console.log(board);
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
            let winning = true;
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
    selectedPiece: -1,
    board: getInitialBoard(),
    bank: getInitialBank(),
    setSelectedPiece: (newSelectedPiece: number) => set((state) => {
        const newValue = state.turn ? newSelectedPiece : state.selectedPiece;
        return { selectedPiece: newValue };
    }),
    setBoard: (newBoard: QuartoPieceData[]) => set((state) => {
        const newValue = state.turn ? newBoard : state.board;
        return { board: newValue };
    }),
    setBank: (newBank: QuartoPieceData[]) => set((state) => {
        const newValue = state.turn ? newBank : state.bank;
        return { bank: newValue };
    }),
    setTurn: (newTurn) => set(() => ({ turn: newTurn })),
    startGame: (userId: string, command: any) => set((state) => {
        return {
            gameState: "",
            board: getInitialBoard(),
            bank: getInitialBank(),
            selectedPiece: -1,
            turn: command.params.start === userId,
        };
    }),
    executeMove: (command: any) => set((state) => {
        const newBoard = [...state.board];
        const newBank = [...state.bank];
        newBoard[command.params.boardSquare] = { ...newBank[command.params.selectedPiece] };
        newBank[command.params.selectedPiece].isValid = false;
        let newTurn = !state.turn;

        const boardState = analyseBoardState(state.turn ? state.board : newBoard);
        let newGameState = "";
        if (boardState === "win") {
            newGameState = state.turn ? "winner" : "loser";
            newTurn = false;
        } else if (boardState === "draw") {
            newGameState = "draw";
            newTurn = false;
        }

        if (state.turn) return { gameState: newGameState, turn: newTurn };
        return {
            gameState: newGameState, board: newBoard, bank: newBank,
            selectedPiece: -1, turn: newTurn
        };
    }),
}));

export default useQuartoStore;
