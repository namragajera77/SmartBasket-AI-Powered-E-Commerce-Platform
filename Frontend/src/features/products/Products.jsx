import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/categoriesApi";
import { getProducts } from "../../api/productsApi";
import { PageSkeleton } from "../../components/feedback/PageSkeleton";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { formatCurrency } from "../../utils/http";
import { ProductImage } from "../../components/ui/ProductImage";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, PackageX, ShoppingBag } from "lucide-react";

const defaultPageSize = 10;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = useMemo(
    () => ({
      page: Number(searchParams.get("page") ?? "1"),
      pageSize: Number(searchParams.get("pageSize") ?? String(defaultPageSize)),
      categoryId: searchParams.get("categoryId")
        ? Number(searchParams.get("categoryId"))
        : undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      sortBy: searchParams.get("sortBy") ?? undefined,
    }),
    [searchParams],
  );

  const productsQuery = useQuery({
    queryKey: ["products-list", query],
    queryFn: () => getProducts(query),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories-list"],
    queryFn: getCategories,
  });

  const page = query.page ?? 1;

  function patchParams(values) {
    const next = new URLSearchParams(searchParams);

    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    if (values.page === undefined) {
      next.set("page", "1");
    }

    setSearchParams(next);
  }

  if (productsQuery.isLoading) {
    return (
      <div className="container-custom py-8">
        <PageSkeleton rows={6} />
      </div>
    );
  }

  if (productsQuery.isError) {
    return (
      <div className="container-custom py-8">
        <ErrorMessage message={productsQuery.error.message} />
      </div>
    );
  }

  const data = productsQuery.data ?? {
    page: 1,
    pageSize: defaultPageSize,
    totalItems: 0,
    items: [],
  };

  return (
    <div className="container-custom py-8 pb-20">
      {/* Header Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Explore Products
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Discover our curated collection of premium products. Filter, sort, and
          find exactly what you need.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="lg:w-1/4 flex-shrink-0"
        >
          <div className="glass-card rounded-2xl p-6 sticky top-28">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold border-b border-gray-100 pb-4">
              <Filter className="w-5 h-5" /> Filters
            </div>

            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      patchParams({ categoryId: undefined, page: 1 })
                    }
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!query.categoryId ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    All Categories
                  </button>
                  {(categoriesQuery.data ?? []).map((category) => (
                    <button
                      key={category.id}
                      onClick={() =>
                        patchParams({ categoryId: category.id, page: 1 })
                      }
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${query.categoryId === category.id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="input-field py-2 px-3 text-sm"
                    value={query.minPrice ?? ""}
                    onChange={(e) =>
                      patchParams({
                        minPrice: e.target.value || undefined,
                        page: 1,
                      })
                    }
                  />

                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="input-field py-2 px-3 text-sm"
                    value={query.maxPrice ?? ""}
                    onChange={(e) =>
                      patchParams({
                        maxPrice: e.target.value || undefined,
                        page: 1,
                      })
                    }
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  className="input-field py-2 px-3 text-sm"
                  value={query.sortBy ?? ""}
                  onChange={(e) =>
                    patchParams({
                      sortBy: e.target.value || undefined,
                      page: 1,
                    })
                  }
                >
                  <option value="">Recommended</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="createdDate">Newest Arrivals</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <button
                className="w-full btn-secondary text-sm mt-4"
                onClick={() =>
                  setSearchParams({
                    page: "1",
                    pageSize: String(defaultPageSize),
                  })
                }
              >
                Reset Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="lg:w-3/4 flex-1">
          {/* Top Bar inside Grid area */}
          <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {data.items.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-900">{data.totalItems}</span>{" "}
              products
            </div>

            {/* Mobile Filter Toggle (hidden on desktop) */}
            <button className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>

          {data.items.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any products matching your current filters. Try
                adjusting your search criteria.
              </p>
              <button
                className="mt-6 btn-primary"
                onClick={() =>
                  setSearchParams({
                    page: "1",
                    pageSize: String(defaultPageSize),
                  })
                }
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {data.items.map((product) => (
                <motion.div
                  variants={fadeUp}
                  key={product.id}
                  className="h-full"
                >
                  <Link
                    to={`/products/${product.id}`}
                    className="h-full group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col items-start relative pb-4"
                  >
                    <div className="w-full h-56 bg-gray-50 overflow-hidden relative">
                      <ProductImage
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full transition-transform duration-700 group-hover:scale-110 object-center"
                      />

                      {/* Subtle overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-10"></div>

                      <button
                        className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to cart logic here
                        }}
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-5 flex flex-col flex-1 w-full z-20 bg-white">
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1.5">
                        {product.categoryName}
                      </p>
                      <h3 className="text-gray-900 font-semibold mb-2 line-clamp-2 leading-tight flex-1">
                        {product.name}
                      </h3>
                      <div className="mt-auto flex items-center justify-between w-full pt-2">
                        <span className="text-xl font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {data.totalItems > 0 && (
            <div className="mt-10 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">
                Page{" "}
                <span className="font-bold text-gray-900">{data.page}</span> of{" "}
                {Math.max(1, Math.ceil(data.totalItems / data.pageSize))}
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="btn-secondary px-4 py-2 text-sm"
                  disabled={page <= 1}
                  onClick={() => patchParams({ page: page - 1 })}
                >
                  Previous
                </button>
                <button
                  className="btn-secondary px-4 py-2 text-sm"
                  disabled={page >= Math.ceil(data.totalItems / data.pageSize)}
                  onClick={() => patchParams({ page: page + 1 })}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
