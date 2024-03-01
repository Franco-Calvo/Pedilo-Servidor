import express from "express";
import {
  createOrder,
  getAllOrdersByUser,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderByPaymentId,
} from "../Controllers/OrderController.js";

const router = express.Router();

router.post("/neworder", createOrder);

router.post("/getorders", getAllOrdersByUser);

router.get('/orderbypayment', getOrderByPaymentId);


router.get("/:id", getOrderById);

router.put("/:id", updateOrder);

router.delete("/:id", deleteOrder);

export default router;
