import { fetchApi } from "@/lib/api";
import { Product } from "@/lib/types";

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetchApi<{ data?: Product[] } | Product[]>("/products", {
      next: { revalidate: 60, tags: ["products"] },
    });

    if (Array.isArray(res)) {
      return res;
    }
    if (res && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}

export async function getProductById(id: string | number): Promise<Product | null> {
  try {
    const res = await fetchApi<{ data?: Product } | Product>(`/products/${id}`, {
      next: { revalidate: 60, tags: [`product-${id}`] },
    });

    if (res && "data" in res && res.data) {
      return res.data;
    }
    return res as Product;
  } catch (error) {
    console.error(`Error al obtener producto ${id}:`, error);
    return null;
  }
}
