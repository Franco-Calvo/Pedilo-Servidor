import express, { Router } from "express";
import userRouter from "./users.routes.js";
import productRouter from "./products.routes.js";
import profileRouter from "./userProfile.routes.js";
import paymentRouter from "./payment.routes.js";
import orderRouter from "./orders.routes.js";
import categoryRouter from "./category.routes.js";

const router: Router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/", profileRouter);
router.use("/auth", userRouter);
router.use("/products", productRouter);
router.use("/pay", paymentRouter);
router.use("/orders", orderRouter);
router.use("/category", categoryRouter);

export default router;
