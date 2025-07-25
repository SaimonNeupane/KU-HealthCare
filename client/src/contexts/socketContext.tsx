import * as React from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

type SocketContextType = Socket | null;

const SocketContext = React.createContext<SocketContextType>(null);

export const useSocket = (): SocketContextType => {
  const socket = React.useContext(SocketContext);
  if (!socket) {
    console.log("socket not initialized");
  }
  return socket;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = React.useMemo(() => io("http://localhost:3000/"), []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
