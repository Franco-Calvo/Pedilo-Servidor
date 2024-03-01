import axios from "axios";
import dotenv from "dotenv";
import express, { Request, Response, Router } from "express";
import mercadopago from "mercadopago";
import { io, notifyOrderCreation } from "../Config/socket.js";
import { createPaymentPreference } from "../Controllers/PaymentController.js";
import authenticateToken from "../Middlewares/JwtMiddleware.js";
import CartTemp from "../Models/Cart.js";
import Order from "../Models/Order.js";
import User from "../Models/Users.js";

dotenv.config({ path: ".env" });

const router: Router = express.Router();

router.post("/create-preference", async (req: Request, res: Response) => {
  try {
    const { cartDetails, sellerId, tableNumber } = req.body;

    const user = await User.findById(sellerId);
    if (!user || !user.mercadopagoAccessToken) {
      return res
        .status(400)
        .send("No se pudo encontrar el token de acceso del vendedor");
    }

    mercadopago.configure({
      access_token: user.mercadopagoAccessToken,
    });

    const tempCart = new CartTemp({
      cartDetails: cartDetails,
      sellerId: sellerId,
      tableNumber: tableNumber,
    });
    await tempCart.save();

    const preference = await createPaymentPreference(
      cartDetails,
      tempCart._id.toString()
    );

    tempCart.preferenceId = preference.body.external_reference;
    await tempCart.save();

    res.json(preference);
  } catch (error: any) {
    console.error("Error creating preference:", error);
    res.status(500).send("Internal server error");
  }
});

router.post(
  "/link-mercadopago",
  authenticateToken,
  async (req: Request, res: Response) => {
    const code = req.body.code;

    try {
      const response = await axios.post(
        "https://api.mercadopago.com/oauth/token",
        {
          client_id: process.env.PRIVATE_ACCESS_MERCADO_PAGO_CLIENT_ID,
          client_secret: process.env.PRIVATE_ACCESS_MERCADO_PAGO_CLIENT_SECRET,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: "https:pedilo.app/admin/productos",
        }
      );

      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      const user = await User.findById((req.user as any).id);
      if (user) {
        user.mercadopagoAccessToken = accessToken;
        user.mercadopagoRefreshToken = refreshToken;
        await user.save();
      }

      res.json({ success: true, message: "Cuenta vinculada con éxito" });
    } catch (error) {
      console.error("Error vinculando la cuenta:", error);
      res.status(500).send("Error vinculando la cuenta");
    }
  }
);

router.post("/verifypayment", async (req: Request, res: Response) => {
  try {
    const { body, query } = req;

    if (!query.id || query.topic !== "payment") {
      return res.status(200).send("Notificación ignorada");
    }

    const topic = query.topic || query.type;
    let merchantOrder;
    let tempCart: any;
    let payment: any;

    switch (topic) {
      case "payment":
        const paymentId: any =
          query.id?.toString() || query["data.id"]?.toString();

        payment = await mercadopago.payment.findById(paymentId);

        const existingOrder = await Order.findOne({
          paymentId: payment.body.id,
        });
        if (existingOrder) {
          console.log("Pago ya procesado anteriormente");
          return res.status(200).send("Pago ya procesado anteriormente");
        }

        tempCart = await CartTemp.findOne({
          preferenceId: payment.body.external_reference,
        });

        merchantOrder = await mercadopago.merchant_orders.findById(
          payment.body.order.id
        );
        break;

      // case "merchant_order":
      //   const orderId: any = query.id;
      //   merchantOrder = await mercadopago.merchant_orders.findById(orderId);
      //   break;
    }

    let paidAmount = 0;

    merchantOrder?.body.payments.forEach((payment: any) => {
      if (payment.status === "approved") {
        paidAmount += payment.transaction_amount;
      }
    });

    if (paidAmount >= merchantOrder?.body.total_amount) {
      setTimeout(async () => {
        const productsInOrder = tempCart?.cartDetails.map((item: any) => {
          return {
            product: item._id,
            title: item.title,
            quantity: item.quantity,
          };
        });

        const totalAmount = tempCart?.cartDetails.reduce(
          (acc: any, item: any) => acc + item.quantity * item.unit_price,
          0
        );

        const order = new Order({
          user: tempCart?.sellerId,
          paymentId: payment?.body.id,
          productsInOrder: productsInOrder,
          totalAmount: totalAmount,
          status: "paid",
          paymentDetails: "",
          tableNumber: tempCart?.tableNumber,
        });

        await order.save();
        notifyOrderCreation(io, order);
        await tempCart?.deleteOne();

        console.log("Pago completado exitosamente después de 5 segundos");
      }, 5000);
      console.log("No se completó el pago");
    }

    res.sendStatus(200);
  } catch (error: any) {
    console.error("Error, verifying payment:", error);
    res.status(500).send("Error verificando el pago");
  }
});

export default router;
