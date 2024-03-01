import mercadopago from "mercadopago";
import "../Config/payments.js";

type CreatePaymentPreferenceInput = {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: Currency;
};

export type Currency = "USD" | "ARS";

export const createPaymentPreference = async (
  inputs: CreatePaymentPreferenceInput[],
  externalReference: string
) => {
  const items = inputs.map((input) => {
    const { title, quantity, unit_price } = input;

    return {
      title: title,
      quantity: quantity,
      currency_id: input.currency_id || "ARS",
      unit_price: unit_price,
    };
  });

  const totalComission = items.reduce(
    (acc, item) => acc + item.unit_price * item.quantity * 0.05,
    0
  );

  const preference = {
    items: items,
    back_urls: {
      success: "https://pedilo.app/order",
    },
    notification_url: "https://pediloserver.onrender.com/pay/verifypayment",

    marketplace_fee: totalComission,
    auto_return: "all",
    external_reference: externalReference,
  };

  const createdPreference = await mercadopago.preferences.create(
    preference as any
  );

  return createdPreference;
};
