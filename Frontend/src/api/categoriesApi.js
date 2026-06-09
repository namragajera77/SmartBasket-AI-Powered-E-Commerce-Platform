import { axiosClient, unwrapResponse } from "./axiosClient";

export async function getCategories() {
  return unwrapResponse(axiosClient.get("/api/categories"));
}

export async function createCategory(payload) {
  return unwrapResponse(axiosClient.post("/api/categories", payload));
}
