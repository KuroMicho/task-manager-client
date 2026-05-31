import { io } from "socket.io-client";

const SOCKET_URL = (import.meta as any).env?.VITE_SOCKET_URL || "http://localhost:3000";

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Lo conectamos manualmente cuando haya sesión
  withCredentials: true,
});
