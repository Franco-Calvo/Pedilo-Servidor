import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

let io: Server;
const users: Record<string, Socket[]> = {};

export function emitEventToUser(userId: string, eventName: string, data: any) {
  const clients: Socket[] = users[userId];

  if (clients)
    clients.map((clientSocket) => {
      clientSocket.emit(eventName, data);
    });
}

export function setupSockets(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("Nuevo cliente conectado:", socket.id);

    socket.on("set-client", (roomId) => {
      if (!users[roomId]) users[roomId] = [];
      users[roomId].push(socket);
      console.log(roomId);
    });

    socket.on("join-order-room", (orderId) => {
      socket.join(`order-${orderId}`);
    });

    socket.on("disconnect", () => {
      for (let roomId in users) {
        users[roomId] = users[roomId].filter((s) => s.id !== socket.id);
        if (users[roomId].length === 0) delete users[roomId];
      }
      console.log("Cliente desconectado:", socket.id);
    });
  });
}

export const notifyOrderCreation = (io: Server, orderData: any) => {
  io.emit("new-order", orderData);
};

export const notifyOrderCompletion = (orderId: string, orderData: any) => {
  io.to(`order-${orderId}`).emit("order-completed", orderData);
};

export { io };
