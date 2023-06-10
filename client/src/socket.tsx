import { Socket, io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
let socket: Socket | undefined;

if (process.env.NODE_ENV === "development") {
    socket = io('http://localhost:5000')
}
else {
    socket = io()
}

export { socket }