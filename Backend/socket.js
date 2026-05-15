let io;

export function setIo(socketIo) {
    io = socketIo;
}

export function getIo() {
    return io;
}