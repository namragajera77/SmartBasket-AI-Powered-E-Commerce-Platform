import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "../../api/categoriesApi";
import { createProduct, deleteProduct, getProducts, updateProduct, uploadProductImage } from "../../api/productsApi";
import { generateDescription } from "../../api/aiApi";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { ProductImage } from "../../components/ui/ProductImage";
import { PageSkeleton } from "../../components/feedback/PageSkeleton";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { useToast } from "../../components/feedback/ToastProvider";
import { formatCurrency } from "../../utils/http";
import type { Product } from "../../types/domain";

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
    imageUrl: "",
  });

  const productsQuery = useQuery({
    queryKey: ["products-list", "admin", page, pageSize],
    queryFn: () => getProducts({ page, pageSize }),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories-list"],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createProduct({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        categoryId: Number(form.categoryId),
        imageUrl: form.imageUrl || undefined,
      }),
    onSuccess: () => {
      setForm({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        categoryId: "",
        imageUrl: "",
      });
      setPage(1);
      queryClient.invalidateQueries({ queryKey: ["products-list"] });
      showToast({ title: "Product created", variant: "success" });
    },
    onError: (error) => {
      showToast({ title: "Create failed", description: error.message, variant: "error" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!editingProduct) {
        return Promise.resolve();
      }

      return updateProduct(editingProduct.id, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        categoryId: Number(form.categoryId),
        imageUrl: form.imageUrl || undefined,
        isActive: true,
      });
    },
    onSuccess: () => {
      setEditingProduct(null);
      setForm({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        categoryId: "",
        imageUrl: "",
      });
      queryClient.invalidateQueries({ queryKey: ["products-list"] });
      showToast({ title: "Product updated", variant: "success" });
    },
    onError: (error) => {
      showToast({ title: "Update failed", description: error.message, variant: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-list"] });
      showToast({ title: "Product deleted", variant: "success" });
    },
    onError: (error) => {
      showToast({ title: "Delete failed", description: error.message, variant: "error" });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadProductImage(file),
    onSuccess: (url) => {
      setForm((previous) => ({ ...previous, imageUrl: url }));
      showToast({ title: "Image uploaded", variant: "success" });
    },
    onError: (error) => {
      showToast({ title: "Upload failed", description: error.message, variant: "error" });
    },
  });

  const aiDescriptionMutation = useMutation({
    mutationFn: () =>
      generateDescription({
        productName: form.name,
        category: categoriesQuery.data?.find((item) => item.id === Number(form.categoryId))?.name ?? "General",
        keywords: form.description,
      }),
    onSuccess: (data) => {
      setForm((previous) => ({ ...previous, description: data.description }));
      showToast({ title: "Description generated", variant: "success" });
    },
    onError: (error) => {
      showToast({ title: "AI generation failed", description: error.message, variant: "error" });
    },
  });

  const canCreate = useMemo(
    () => form.name.trim().length > 1 && Number(form.price) > 0 && Number(form.categoryId) > 0,
    [form.categoryId, form.name, form.price],
  );

  function startEdit(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description ?? "",
      price: String(product.price),
      stockQuantity: String(product.stockQuantity),
      categoryId: String((categoriesQuery.data ?? []).find((c) => c.name === product.categoryName)?.id ?? ""),
      imageUrl: product.imageUrl ?? "",
    });
  }

  function resetForm() {
    setEditingProduct(null);
    setForm({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      categoryId: "",
      imageUrl: "",
    });
  }

  return (
    <div className="section-stack">
      <Card className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <p className="text-sm text-gray-600">Create, edit, delete, upload image, and generate AI descriptions from one panel.</p>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (editingProduct) {
              updateMutation.mutate();
            } else {
              createMutation.mutate();
            }
          }}
        >
          <Input label="Name" value={form.name} onChange={(event) => setForm((p) => ({ ...p, name: event.target.value }))} />
          <Input
            label="Price"
            type="number"
            value={form.price}
            onChange={(event) => setForm((p) => ({ ...p, price: event.target.value }))}
          />
          <Input
            label="Stock"
            type="number"
            value={form.stockQuantity}
            onChange={(event) => setForm((p) => ({ ...p, stockQuantity: event.target.value }))}
          />
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Category</label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              value={form.categoryId}
              onChange={(event) => setForm((p) => ({ ...p, categoryId: event.target.value }))}
            >
              <option value="">Select category</option>
              {(categoriesQuery.data ?? []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <Input
              label="Description"
              value={form.description}
              onChange={(event) => setForm((p) => ({ ...p, description: event.target.value }))}
            />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  uploadMutation.mutate(file);
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={() => aiDescriptionMutation.mutate()} disabled={!form.name}>
              AI Generate Description
            </Button>
            <Button type="submit" disabled={!canCreate || createMutation.isPending || updateMutation.isPending}>
              {editingProduct
                ? updateMutation.isPending
                  ? "Updating..."
                  : "Update Product"
                : createMutation.isPending
                  ? "Creating..."
                  : "Create Product"}
            </Button>
            {editingProduct ? (
              <Button type="button" variant="secondary" className="min-w-28" onClick={resetForm}>
                Cancel Edit
              </Button>
            ) : null}
          </div>
        </form>
        {createMutation.isError ? <ErrorMessage message={createMutation.error.message} /> : null}
        {updateMutation.isError ? <ErrorMessage message={updateMutation.error.message} /> : null}
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Catalog Items</h2>
        {productsQuery.isLoading ? <PageSkeleton rows={4} /> : null}
        {productsQuery.isError ? <ErrorMessage message={productsQuery.error.message} /> : null}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {productsQuery.data?.items.map((product) => (
                <tr key={product.id} className="transition-all duration-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-md bg-gray-100">
                        <ProductImage src={product.imageUrl} alt={product.name} />
                      </div>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.categoryName}</td>
                  <td className="px-4 py-3 text-gray-900">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3 text-gray-600">{product.stockQuantity}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => startEdit(product)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => deleteMutation.mutate(product.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing page {productsQuery.data?.page ?? page} of {Math.max(1, Math.ceil((productsQuery.data?.totalItems ?? 0) / (productsQuery.data?.pageSize ?? pageSize)))}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((previous) => Math.max(1, previous - 1))}>
              Previous
            </Button>
            <Button
              disabled={page >= Math.max(1, Math.ceil((productsQuery.data?.totalItems ?? 0) / (productsQuery.data?.pageSize ?? pageSize)))}
              onClick={() =>
                setPage((previous) =>
                  Math.min(
                    Math.max(1, Math.ceil((productsQuery.data?.totalItems ?? 0) / (productsQuery.data?.pageSize ?? pageSize))),
                    previous + 1,
                  ),
                )
              }
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

