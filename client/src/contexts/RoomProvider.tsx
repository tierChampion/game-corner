import React, { ReactNode, useReducer } from "react";
import RoomContext from "./RoomContext";
import ClientWebSocket from "../utils/Socket";
import { QuartoPieceData } from "../components/QuartoPiece";
import roomReducer from "../reducers/RoomReducer";

interface RoomProviderProps {
    children: ReactNode;
}

const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {

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

    const [state, dispatch] = useReducer(roomReducer, { board: getInitialBoard(), bank: getInitialBank(), selectedPiece: -1 });

    return (
        <RoomContext.Provider value={{
            ws: new ClientWebSocket(),
            state: state,
            dispatch: dispatch
        }}>
            {children}
        </RoomContext.Provider>
    );
};

export default RoomProvider;