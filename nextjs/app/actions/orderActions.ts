"use server";

import { createOrderApi, processPaymentApi, CreateOrderPayload } from "@/services/orderService";
import { revalidatePath } from "next/cache";

export interface OrderActionResult {
  success: boolean;
  orderId?: number | string;
  clientSecret?: string;
  error?: string;
}

export async function createOrderAction(
  payload: CreateOrderPayload
): Promise<OrderActionResult> {
  try {
    if (!payload.items || payload.items.length === 0) {
      return { success: false, error: "El carrito está vacío" };
    }

    const order = await createOrderApi(payload);
    revalidatePath("/orders");

    return {
      success: true,
      orderId: order.id,
    };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Error al crear la orden";
    return { success: false, error };
  }
}

export async function processPaymentAction(data: {
  order_id: number | string;
  payment_method_id?: string;
  token?: string;
}): Promise<OrderActionResult> {
  try {
    const result = await processPaymentApi(data);
    revalidatePath("/orders");

    return {
      success: result.success,
      clientSecret: result.client_secret,
      error: result.message,
    };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Error al procesar el pago";
    return { success: false, error };
  }
}
