import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, getCategories } from "../../api/categoriesApi";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { PageSkeleton } from "../../components/feedback/PageSkeleton";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { useToast } from "../../components/feedback/ToastProvider";

export function AdminCategoriesPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const categoriesQuery = useQuery({
    queryKey: ["categories-list"],
    queryFn: getCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: () => createCategory({ name, description }),
    onSuccess: () => {
      setName("");
      setDescription("");
      setPage(1);
      queryClient.invalidateQueries({ queryKey: ["categories-list"] });
      showToast({ title: "Category created", variant: "success" });
    },
    onError: (error) => {
      showToast({
        title: "Create failed",
        description: error.message,
        variant: "error",
      });
    },
  });

  const categories = categoriesQuery.data ?? [];
  const totalPages = Math.max(1, Math.ceil(categories.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return categories.slice(start, start + pageSize);
  }, [categories, currentPage]);

  return (
    <div className="section-stack">
      <Card className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Category Management
        </h1>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            createCategoryMutation.mutate();
          }}
        >
          <Input
            label="Category Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={
                createCategoryMutation.isPending || name.trim().length < 2
              }
            >
              {createCategoryMutation.isPending
                ? "Creating..."
                : "Create Category"}
            </Button>
          </div>
        </form>
        {createCategoryMutation.isError ? (
          <ErrorMessage message={createCategoryMutation.error.message} />
        ) : null}
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Existing Categories
        </h2>
        {categoriesQuery.isLoading ? <PageSkeleton rows={3} /> : null}
        {categoriesQuery.isError ? (
          <ErrorMessage message={categoriesQuery.error.message} />
        ) : null}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {pagedCategories.map((category) => (
                <tr
                  key={category.id}
                  className="transition-all duration-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {category.id}
                  </td>
                  <td className="px-4 py-3 text-gray-900">{category.name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {category.description || "No description"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={currentPage <= 1}
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
            >
              Previous
            </Button>
            <Button
              disabled={currentPage >= totalPages}
              onClick={() =>
                setPage((previous) => Math.min(totalPages, previous + 1))
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
