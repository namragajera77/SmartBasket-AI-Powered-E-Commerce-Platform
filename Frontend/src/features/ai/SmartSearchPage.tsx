import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { smartSearch } from "../../api/aiApi";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { EmptyState } from "../../components/feedback/EmptyState";
import { useToast } from "../../components/feedback/ToastProvider";
import { formatCurrency } from "../../utils/http";

export function SmartSearchPage() {
  const [query, setQuery] = useState("");
  const { showToast } = useToast();

  const searchMutation = useMutation({
    mutationFn: () => smartSearch({ query }),
    onSuccess: (results) => {
      showToast({
        title: "Search complete",
        description: `${results.length} matching products found.`,
        variant: "info",
      });
    },
    onError: (error) => {
      showToast({ title: "Search failed", description: error.message, variant: "error" });
    },
  });

  return (
    <div className="section-stack">
      <Card className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">AI Smart Search</h1>
        <p className="text-sm text-gray-600">Search by intent, not just keywords.</p>
        <div className="flex flex-col gap-3 md:flex-row">
          <Input
            className="flex-1"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: budget laptop for students"
          />
          <Button className="md:min-w-36" onClick={() => searchMutation.mutate()} disabled={query.trim().length < 2 || searchMutation.isPending}>
            {searchMutation.isPending ? "Searching..." : "Search"}
          </Button>
        </div>
        {searchMutation.isError ? <ErrorMessage message={searchMutation.error.message} /> : null}
      </Card>

      {searchMutation.data?.length === 0 ? (
        <EmptyState title="No results" message="Try refining your request with more detail." />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(searchMutation.data ?? []).map((result) => (
          <Link key={result.productId} to={`/products/${result.productId}`} className="card-surface-hover space-y-2 p-4">
            <p className="text-sm font-semibold text-gray-900">{result.name}</p>
            <p className="line-clamp-2 text-sm text-gray-500">{result.description || "No description"}</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(result.price)}</p>
            <p className="text-xs font-semibold text-blue-600">Similarity {result.similarityScore.toFixed(3)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

