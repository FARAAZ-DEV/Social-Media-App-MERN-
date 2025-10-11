import React, { createContext } from 'react';
import socketIoClient from 'socket.io-client';

export const SocketContext = createContext();

// Use environment variable for backend URL
const WS = process.env.REACT_APP_API_URL;

const socket = socketIoClient(WS);

export const SocketContextProvider = ({ children }) => {
    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}
