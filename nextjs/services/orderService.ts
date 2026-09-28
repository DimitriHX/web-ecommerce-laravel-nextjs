import { fetchApi } from "@/lib/api";
import { Order } from "@/lib/types";

export interface CreateOrderPayload {
  items: {
    product_id: number | string;
    quantity: number;
    price?: number;
  }[];
  shipping_address?: string;
}

export async function createOrderApi(payload: CreateOrderPayload): Promise<Order> {
  const res = await fetchApi<{ data?: Order } | Order>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
    requiresAuth: true,
  });

  if (res && "data" in res && res.data) {
    return res.data;
  }
  return res as Order;
}

export async function getOrdersApi(): Promise<Order[]> {
  try {
    const res = await fetchApi<{ data?: Order[] } | Order[]>("/orders", {
      requiresAuth: true,
      cache: "no-store",
    });

    if (Array.isArray(res)) {
      return res;
    }
    if (res && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    return [];
  }
}

export async function processPaymentApi(data: {
  order_id: number | string;
  payment_method_id?: string;
  token?: string;
}): Promise<{ success: boolean; client_secret?: string; message?: string }> {
  return await fetchApi<{ success: boolean; client_secret?: string; message?: string }>(
    "/payments/process",
    {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    }
  );
}
