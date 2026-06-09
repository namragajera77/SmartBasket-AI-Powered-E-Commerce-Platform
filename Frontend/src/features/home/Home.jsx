import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Monitor,
  Shirt,
  Home as HomeIcon,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { getProducts } from "../../api/productsApi";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { PageSkeleton } from "../../components/feedback/PageSkeleton";
import { ProductImage } from "../../components/ui/ProductImage";

const categories = [
  { name: "Electronics", icon: <Monitor className="w-6 h-6" /> },
  { name: "Fashion", icon: <Shirt className="w-6 h-6" /> },
  { name: "Home & Garden", icon: <HomeIcon className="w-6 h-6" /> },
  { name: "Beauty", icon: <Sparkles className="w-6 h-6" /> },
];

const fallbackImage =
  "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

function ProductCard({ id, name, price, image, isSmall = false }) {
  return (
    <motion.div variants={fadeUp} className="h-full">
      <Link
        to={`/products/${id}`}
        className="h-full group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col items-start relative pb-4"
      >
        <div
          className={`w-full bg-gray-50 overflow-hidden relative ${isSmall ? "h-48" : "h-64"}`}
        >
          <ProductImage
            src={image}
            alt={name}
            className="w-full h-full transition-transform duration-700 group-hover:scale-110 object-center"
          />

          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-10"></div>

          <button className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white">
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col flex-1 w-full relative z-20 bg-white">
          <h3 className="text-gray-900 font-semibold mb-1 line-clamp-2 leading-tight flex-1">
            {name}
          </h3>
          <div className="flex items-center justify-between w-full mt-3">
            <span className="text-xl font-bold text-blue-600">{price}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function HomePage() {
  const navigate = useNavigate();

  const productsQuery = useQuery({
    queryKey: ["home", "products"],
    queryFn: () => getProducts({ page: 1, pageSize: 50 }),
  });

  const availableProducts = (productsQuery.data?.items ?? []).filter(
    (product) => product.stockQuantity > 0,
  );

  const mapProductToCard = (product) => ({
    id: product.id,
    name: product.name,
    price: `$${product.price.toFixed(2)}`,
    image: product.imageUrl ?? fallbackImage,
  });

  const featuredProducts = availableProducts.slice(0, 4).map(mapProductToCard);
  const recommendedProducts = availableProducts
    .slice(4, 12)
    .map(mapProductToCard);

  if (productsQuery.isLoading) {
    return <PageSkeleton rows={8} />;
  }

  if (productsQuery.isError) {
    return <ErrorMessage message={productsQuery.error.message} />;
  }

  return (
    <div className="w-full space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-b-[4rem] overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-purple-400/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="container-custom relative z-10 pt-10 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 text-blue-700 mb-6 font-medium text-sm backdrop-blur-sm border border-blue-200/50"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Personalization Built-in</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6"
              >
                Shop Smarter, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Not Harder.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg"
              >
                Discover the best premium products tailored just for you. Our AI
                engine finds exactly what you need in seconds.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/products"
                  className="btn-primary text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/20"
                >
                  Shop Now{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/search"
                  className="btn-secondary text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-2 group"
                >
                  <Search className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />{" "}
                  AI Search
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                alt="Premium shopping"
                className="w-full h-[600px] object-cover rounded-3xl shadow-2xl z-10 relative"
              />

              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl -z-10 opacity-20 blur-2xl"></div>

              {/* Floating Element */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-10 -left-12 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 z-20 border border-gray-100"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Trending</p>
                  <p className="text-gray-900 font-bold">Smart Watches</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES */}
      <section className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeUp}
            className="flex justify-between items-end mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900">
              Explore Categories
            </h2>
            <Link
              to="/products"
              className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 group"
            >
              View all{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <motion.div key={i} variants={fadeUp} className="h-full">
                <Link
                  to={`/products?category=${cat.name}`}
                  className="group flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl group-hover:bg-blue-50 flex items-center justify-center text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300 mb-4">
                    {cat.icon}
                  </div>
                  <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-bold text-gray-900 mb-8"
          >
            Featured Collection
          </motion.h2>
          {featuredProducts.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
              No products available right now.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* 4. AI SMART SEARCH */}
      <section className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="relative rounded-3xl overflow-hidden bg-gray-900 text-white p-10 md:p-16 text-center"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 z-0"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 text-sm font-medium border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-300" /> Powered by AI
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Find exactly what you want.
            </h2>
            <p className="text-lg text-gray-300">
              Type naturally. E.g., "I need a light laptop for video editing
              under $1500"
            </p>

            <div className="relative group max-w-2xl mx-auto mt-8">
              <input
                type="text"
                placeholder="Ask our AI assistant..."
                className="w-full bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder-white/50 px-6 py-5 rounded-2xl text-lg outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-all shadow-2xl focus:shadow-[0_0_40px_rgba(59,130,246,0.6)]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate("/search");
                }}
              />

              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors"
                onClick={() => navigate("/search")}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5. RECOMMENDATIONS */}
      <section className="container-custom overflow-hidden pb-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeUp}
            className="flex justify-between items-end mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900">
              Recommended For You
            </h2>
          </motion.div>

          {recommendedProducts.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
              No more products to recommend yet.
            </div>
          ) : (
            <motion.div
              variants={fadeUp}
              className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide"
            >
              {recommendedProducts.map((product) => (
                <div
                  key={product.id}
                  className="min-w-[280px] sm:min-w-[300px] snap-center"
                >
                  <ProductCard {...product} isSmall={true} />
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
