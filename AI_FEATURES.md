**AI Features & Implementation**

This document lists all AI-powered features in the project, how they are implemented, where to find the code, required configuration, and example requests.

**Overview**
- **Smart Search**: semantic/product-aware search using embeddings and a Hugging Face model.
- **Product Description Generation**: generate product descriptions using a chat/completion model.
- **Reviews Summary**: summarization/insights over product reviews.
- **Personalized Recommendations**: content-based / heuristic recommendations per product.

**Backend: controllers & endpoints**
- **AIController endpoints**: [Backend/Controllers/AIController.cs](Backend/Controllers/AIController.cs)
  - **POST /api/ai/smart-search** — Smart search request (uses `SmartSearchEngine`).
  - **POST /api/ai/generate-description** — Generate product description (uses `HuggingFaceClient`).
  - **GET /api/ai/reviews-summary/{productId}** — Reviews summarization for a product.
  - **GET /api/ai/recommendations/{productId}** — Get recommended products for a product (uses `RecommendationEngine`).

**Core implementation files**
- [Backend/AI/HuggingFaceClient.cs](Backend/AI/HuggingFaceClient.cs): HTTP client wrapper for Hugging Face API calls; handles model selection and request shaping.
- [Backend/AI/IHuggingFaceClient.cs](Backend/AI/IHuggingFaceClient.cs): interface for the client.
- [Backend/AI/SmartSearchEngine.cs](Backend/AI/SmartSearchEngine.cs): builds semantic queries and ranking using embeddings + DB lookups.
- [Backend/AI/RecommendationEngine.cs](Backend/AI/RecommendationEngine.cs): recommendation logic (content similarity, heuristics). 
- [Backend/Services/AIService.cs] (registered as `IAIService` in Program.cs): higher-level orchestration used by `AIController`.

**Data transfer objects (DTOs)**
- Request/response DTOs are defined in [Backend/DTOs/](Backend/DTOs/) such as `SmartSearchRequestDTO`, `GenerateDescriptionRequestDTO`, `RecommendationResponseDTO`, and `SmartSearchResponseDTO`.

**Frontend integration**
- The frontend calls the above endpoints from the web app (ecommerceai-web). Look for API client code under ecommerceai-web/src/api or pages consuming search/recommendations. Example pages: smart-search UI and product detail pages request recommendations and review summaries.

**Required configuration (environment variables)**
- `HuggingFace__ApiKey` — your Hugging Face API key (set in `Backend/.env` locally). 
- `HuggingFace__Model` — primary model used for chat/completion (`deepseek-ai/DeepSeek-V3.1:together` in examples).
- `HuggingFace__Endpoint` — API endpoint (router/chat completions URL in examples).
- `HuggingFace__EmbeddingModel` — embedding model id used to produce vectors.
- `HuggingFace__EmbeddingFallbackModel` — fallback embedding model.

Example local `.env` entries (already present in `Backend/.env` locally):

```
HuggingFace__ApiKey=hf_YOUR_KEY
HuggingFace__Model=deepseek-ai/DeepSeek-V3.1:together
HuggingFace__Endpoint=https://router.huggingface.co/v1/chat/completions
HuggingFace__EmbeddingModel=sentence-transformers/all-MiniLM-L6-v2
HuggingFace__EmbeddingFallbackModel=BAAI/bge-small-en-v1.5
```

**Example requests**
- Smart Search (example):

```
POST /api/ai/smart-search
Content-Type: application/json

{
  "query": "wireless noise cancelling headphones",
  "page": 1,
  "pageSize": 20
}
```

- Generate Description (example):

```
POST /api/ai/generate-description
Content-Type: application/json

{
  "productId": 123,
  "tone": "concise",
  "length": "short"
}
```

**Operational notes & recommendations**
- These endpoints call external models and may have variable latency; add client-side timeouts and server-side rate limits (rate limiting already enabled in Program.cs).
- Monitor Hugging Face usage and set sensible caching for generated descriptions, embeddings, and search results.
- If you change providers (OpenAI, Cohere, etc.), replace `HuggingFaceClient` implementation and update `IHuggingFaceClient` + configuration.

**Where to start in code**
- Controller: [Backend/Controllers/AIController.cs](Backend/Controllers/AIController.cs)
- Service & engines: [Backend/Services/AIService.cs](Backend/Services/AIService.cs), [Backend/AI/SmartSearchEngine.cs](Backend/AI/SmartSearchEngine.cs), [Backend/AI/RecommendationEngine.cs](Backend/AI/RecommendationEngine.cs)
- Client: [Backend/AI/HuggingFaceClient.cs](Backend/AI/HuggingFaceClient.cs)

**Next steps you may want**
- Add unit tests for `SmartSearchEngine` and `RecommendationEngine` using mocked `IHuggingFaceClient`.
- Add server-side caching for embeddings and summary results (Redis recommended for production).
- Add usage quotas or billing alerts on your Hugging Face account.

---
Generated: 2026-06-08
