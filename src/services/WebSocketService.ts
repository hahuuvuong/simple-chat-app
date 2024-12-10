class WebSocketService {
    private static sockets: { [room: string]: WebSocket } = {};

    static connect(room: string): WebSocket {
        if (!this.sockets[room]) {
            const socket = new WebSocket(`ws://your-websocket-server/${room}`);
            this.sockets[room] = socket;
        }
        return this.sockets[room];
    }

    static disconnect(room: string): void {
        if (this.sockets[room]) {
            this.sockets[room].close();
            delete this.sockets[room];
        }
    }

    static sendMessage(room: string, message: string): void {
        if (this.sockets[room]) {
            this.sockets[room].send(message);
        }
    }
}

export default WebSocketService;