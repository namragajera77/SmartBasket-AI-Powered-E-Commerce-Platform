import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { generateDescription, summarizeReviews } from "../../api/aiApi";
import { getProducts } from "../../api/productsApi";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { useToast } from "../../components/feedback/ToastProvider";

export function AdminAiToolsPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [summaryProductId, setSummaryProductId] = useState("");
  const { showToast } = useToast();

  const productsQuery = useQuery({
    queryKey: ["admin", "ai-tools", "products-for-id-picker"],
    queryFn: () => getProducts({ page: 1, pageSize: 200 }),
  });

  const descriptionMutation = useMutation({
    mutationFn: () => generateDescription({ productName: name, category, keywords }),
    onSuccess: () => {
      showToast({ title: "Description generated", variant: "success" });
    },
    onError: (error) => {
      showToast({ title: "Generation failed", description: error.message, variant: "error" });
    },
  });

  const summaryMutation = useMutation({
    mutationFn: () => summarizeReviews(Number(summaryProductId)),
    onSuccess: () => {
      showToast({ title: "Summary ready", variant: "success" });
    },
    onError: (error) => {
      showToast({ title: "Summarization failed", description: error.message, variant: "error" });
    },
  });

  return (
    <div className="section-stack">
      <Card className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">AI Content Tools</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Product Name" value={name} onChange={(event) => setName(event.target.value)} />
          <Input label="Category" value={category} onChange={(event) => setCategory(event.target.value)} />
          <div className="md:col-span-2">
            <Input label="Keywords" value={keywords} onChange={(event) => setKeywords(event.target.value)} />
          </div>
        </div>
        <Button onClick={() => descriptionMutation.mutate()} disabled={descriptionMutation.isPending || !name || !category}>
          {descriptionMutation.isPending ? "Generating..." : "Generate Description"}
        </Button>
        {descriptionMutation.isError ? <ErrorMessage message={descriptionMutation.error.message} /> : null}
        {descriptionMutation.data ? (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">{descriptionMutation.data.description}</div>
        ) : null}
      </Card>

      <Card className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">AI Review Summarization</h2>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Choose Product</label>
          <select
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={summaryProductId}
            onChange={(event) => setSummaryProductId(event.target.value)}
          >
            <option value="">Select product (ID - Name)</option>
            {(productsQuery.data?.items ?? []).map((product) => (
              <option key={product.id} value={String(product.id)}>
                {product.id} - {product.name}
              </option>
            ))}
          </select>
          {productsQuery.isError ? (
            <p className="mt-1 text-xs text-red-600">Could not load product list. You can still enter ID manually below.</p>
          ) : null}
        </div>
        <Input
          label="Product Id"
          type="number"
          value={summaryProductId}
          onChange={(event) => setSummaryProductId(event.target.value)}
        />
        <Button onClick={() => summaryMutation.mutate()} disabled={summaryMutation.isPending || Number(summaryProductId) <= 0}>
          {summaryMutation.isPending ? "Summarizing..." : "Summarize Reviews"}
        </Button>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
          <p className="font-semibold text-gray-700">Quick Product IDs</p>
          <p className="mt-1">{productsQuery.isLoading ? "Loading products..." : `${productsQuery.data?.items.length ?? 0} products loaded`}</p>
          <div className="mt-2 max-h-40 overflow-auto rounded border border-gray-200 bg-white p-2">
            {(productsQuery.data?.items ?? []).slice(0, 30).map((product) => (
              <button
                key={product.id}
                type="button"
                className="block w-full cursor-pointer rounded px-2 py-1 text-left hover:bg-blue-50"
                onClick={() => setSummaryProductId(String(product.id))}
              >
                #{product.id} - {product.name}
              </button>
            ))}
            {(productsQuery.data?.items ?? []).length === 0 && !productsQuery.isLoading ? (
              <p className="px-2 py-1 text-gray-500">No products found.</p>
            ) : null}
          </div>
        </div>
        {summaryMutation.isError ? <ErrorMessage message={summaryMutation.error.message} /> : null}
        {summaryMutation.data ? (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
            <p className="font-semibold text-gray-900">Product #{summaryMutation.data.productId}</p>
            <p className="mt-2">{summaryMutation.data.summary}</p>
            <p className="mt-2 text-xs text-gray-500">Reviews used: {summaryMutation.data.reviewCount}</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

