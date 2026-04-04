import { axiosClient, unwrapResponse } from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type {
  Product,
  ProductCreatePayload,
  ProductPage,
  ProductQuery,
  ProductUpdatePayload,
} from "../types/domain";

export async function getProducts(query: ProductQuery): Promise<ProductPage> {
  return unwrapResponse<ProductPage>(
    axiosClient.get<ApiResponse<ProductPage>>("/api/products", {
      params: query,
    }),
  );
}

export async function getProductById(id: number): Promise<Product> {
  return unwrapResponse<Product>(axiosClient.get<ApiResponse<Product>>(`/api/products/${id}`));
}

export async function createProduct(payload: ProductCreatePayload): Promise<Product> {
  return unwrapResponse<Product>(axiosClient.post<ApiResponse<Product>>("/api/products", payload));
}

export async function updateProduct(id: number, payload: ProductUpdatePayload): Promise<void> {
  await axiosClient.put(`/api/products/${id}`, payload);
}

export async function deleteProduct(id: number): Promise<void> {
  await axiosClient.delete(`/api/products/${id}`);
}

export async function uploadProductImage(image: File): Promise<string> {
  const formData = new FormData();
  // Backend action expects the exact form field name "imageFile".
  formData.append("imageFile", image);

  const response = await axiosClient.post<ApiResponse<unknown> | string>("/api/products/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const payload = typeof response.data === "string"
    ? response.data
    : ((response.data as { data?: unknown }).data ?? response.data);

  if (typeof payload === "string") {
    return payload;
  }

  const imageUrl = (payload as { imageUrl?: string } | null)?.imageUrl;
  if (typeof imageUrl === "string" && imageUrl.length > 0) {
    return imageUrl;
  }

  throw new Error("Upload succeeded but image URL was missing in response.");
}

