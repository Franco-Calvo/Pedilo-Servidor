import mercadopago from "mercadopago";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

mercadopago.configure({
    access_token: process.env.PRIVATE_ACCESS_MERCADO_PAGO || ""
  });
