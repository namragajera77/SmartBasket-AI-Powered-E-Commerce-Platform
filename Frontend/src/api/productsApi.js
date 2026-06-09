import { axiosClient, unwrapResponse } from "./axiosClient";

export async function getProducts(query) {
  return unwrapResponse(
    axiosClient.get("/api/products", {
      params: query,
    }),
  );
}

export async function getProductById(id) {
  return unwrapResponse(axiosClient.get(`/api/products/${id}`));
}

export async function createProduct(payload) {
  return unwrapResponse(axiosClient.post("/api/products", payload));
}

export async function updateProduct(id, payload) {
  await axiosClient.put(`/api/products/${id}`, payload);
}

export async function deleteProduct(id) {
  await axiosClient.delete(`/api/products/${id}`);
}

export async function uploadProductImage(image) {
  const formData = new FormData();
  // Backend action expects the exact form field name "imageFile".
  formData.append("imageFile", image);

  const response = await axiosClient.post(
    "/api/products/upload-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  const payload =
    typeof response.data === "string"
      ? response.data
      : (response.data.data ?? response.data);

  if (typeof payload === "string") {
    return payload;
  }

  const imageUrl = payload?.imageUrl;
  if (typeof imageUrl === "string" && imageUrl.length > 0) {
    return imageUrl;
  }

  throw new Error("Upload succeeded but image URL was missing in response.");
}
