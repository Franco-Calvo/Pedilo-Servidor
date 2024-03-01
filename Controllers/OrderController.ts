import { Request, Response } from "express";
import Order from "../Models/Order.js";
import User from "../Models/Users.js";
import { notifyOrderCompletion } from "../Services/socketFunctions.js";
import { io } from "../Config/socket.js";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user;
    const {
      paymentId,
      productsInOrder,
      totalAmount,
      status,
      paymentDetails,
      orderStatus,
      tableNumber,
    } = req.body;

    if (
      userId === undefined ||
      paymentId === undefined ||
      productsInOrder === undefined ||
      totalAmount === undefined ||
      status === undefined ||
      paymentDetails === undefined ||
      tableNumber === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Faltan datos para crear la orden" });
    }

    const order = new Order({
      user: userId,
      paymentId: paymentId,
      productsInOrder: productsInOrder,
      totalAmount: totalAmount,
      status: status,
      paymentDetails: paymentDetails,
      orderStatus: orderStatus,
      tableNumber: tableNumber,
    });

    await User.findByIdAndUpdate(
      userId,
      { $push: { orders: order._id } },
      { new: true, useFindAndModify: false }
    );

    await order.save();
    return res
      .status(201)
      .json({ message: "Orden creada exitosamente", order });
  } catch (error: any) {
    console.error("Error al crear la orden:", error);
    return res.status(500).json({ message: "Error al crear la orden" });
  }
};

export const getAllOrdersByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "No se proporcionó un ID de usuario" });
    }

    const orders = await Order.find({ user: userId });

    if (!orders) {
      return res
        .status(404)
        .json({ message: "No se encontraron órdenes para el usuario" });
    }

    return res.status(200).json({ orders });
  } catch (error: any) {
    console.error("Error al obtener las órdenes:", error);
    return res.status(500).json({ message: "Error al obtener las órdenes" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const order = await Order.findOne({
      _id: req.params.ordedId,
      user: userId,
    });

    if (!order) {
      return res.status(404).send("Orden no encontrada");
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).send("Error al obtener la orden");
  }
};

export const getOrderByPaymentId = async (req: Request, res: Response) => {
  try {
    const { payment_id } = req.query;

    if (!payment_id) {
      return res
        .status(400)
        .json({ message: "No se proporcionó un payment_id" });
    }

    const order = await Order.findOne({ paymentId: payment_id });

    if (!order) {
      return res.status(404).json({
        message: "Orden no encontrada con el payment_id proporcionado",
      });
    }

    return res.status(200).json({ order });
  } catch (error: any) {
    console.error("Error al obtener la orden por payment_id:", error);
    return res.status(500).json({ message: "Error al obtener la orden" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const updatedData = req.body;

    const currentOrder = await Order.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!currentOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Orden no encontrada" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      updatedData,
      { new: true }
    );

    if (order?.orderStatus === "success") {
      io.to(`order-${order._id}`).emit("order-completed", order);
    }

    return res.json({ success: true, data: order });
  } catch (error: any) {
    console.log(
      "Error al actualizar la orden",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la orden",
      error: error.response ? error.response.data : error.message,
    });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const order = await Order.findOneAndDelete({
      _id: req.params.orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).send("Orden no encontrada");
    }
  } catch (error: any) {
    res.status(500).send("Error al eliminar la orden");
  }
};
