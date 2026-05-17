import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (onEvent) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socketRef.current = socket;

    socket.emit('join:city', 'Jaipur');

    const events = ['listing:new', 'listing:claimed', 'listing:unclaimed', 'listing:completed', 'listing:deleted'];
    events.forEach(ev => socket.on(ev, (data) => onEvent(ev, data)));

    return () => socket.disconnect();
  }, []);

  return socketRef;
};
