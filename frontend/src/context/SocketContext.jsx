import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        // Only connect if the user is an admin
        if (user && user.role === 'admin') {
            // Connect to your backend server
            const newSocket = io("http://localhost:5000"); 
            setSocket(newSocket);

            // Clean up the connection when the component unmounts or the user logs out
            return () => newSocket.close();
        } else if (socket) {
            // If a user logs out or is not an admin, disconnect the existing socket
            socket.close();
            setSocket(null);
        }
    }, [user]); // Re-run this effect whenever the user state changes

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

