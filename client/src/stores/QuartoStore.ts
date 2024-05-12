import { create } from "zustand";
import { QuartoPieceData } from "../components/QuartoPiece";

interface QuartoState {
    winner: string;
    turn: boolean;
    selectedPiece: number;
    board: QuartoPieceData[];
    bank: QuartoPieceData[];
    setWinner: (newWinner: string) => void;
    setSelectedPiece: (newSelectedPiece: number) => void;
    setBoard: (newBoard: QuartoPieceData[]) => void;
    setBank: (newBank: QuartoPieceData[]) => void;
    setTurn: (newTurn: boolean) => void;
    startGame: (userId:string, command: any) => void;
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

const useQuartoStore = create<QuartoState>()((set) => ({
    winner: "",
    turn: false,
    selectedPiece: -1,
    board: getInitialBoard(),
    bank: getInitialBank(),
    setWinner: (newWinner: string) => set(() => { 
        return { winner: newWinner }; 
    }),
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
        return {board: getInitialBoard(), 
            bank: getInitialBank(), 
            selectedPiece: -1, 
            turn: command.params.start === userId,
        };
    }),
    executeMove: (command: any) => set((state) => {
        if (state.turn) return { turn: !state.turn };
        const newBoard = [...state.board];
        const newBank = [...state.bank];
        newBoard[command.params.boardSquare] = { ...newBank[command.params.selectedPiece] };
        newBank[command.params.selectedPiece].isValid = false;
        return { board: newBoard, bank: newBank, selectedPiece: -1, turn: !state.turn };
    }),
}));

export default useQuartoStore;
