import { Server } from "socket.io";

export const notifyOrderCreation = (io: Server, orderData: any) => {
  io.emit("new-order", orderData);
};

export const notifyOrderCompletion = (io: Server, orderData: any) => {
  io.emit("order-completed", orderData);
};
