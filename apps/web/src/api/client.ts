import type {
  BlogListDTO,
  BlogPostDTO,
  CarbonPredictionRequest,
  CarbonPredictionResponse,
  GlobalDTO,
  ProjectDTO,
  ProjectSummaryDTO,
  PageDTO
} from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const DEFAULT_CACHE_TTL_MS = 60_000;

type CacheEntry = {
  expiresAt: number;
  value: unknown;
};

const responseCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<unknown>>();

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function fetchJson<T>(path: string): Promise<T> {
  const now = Date.now();
  const cached = responseCache.get(path);
  if (cached && cached.expiresAt > now) {
    return cached.value as T;
  }

  const existingRequest = inFlightRequests.get(path);
  if (existingRequest) {
    return existingRequest as Promise<T>;
  }

  const request = fetch(`${API_BASE}${path}`)
    .then(async (response) => {
      if (!response.ok) {
        throw new ApiError(response.status, response.statusText);
      }
      const data = (await response.json()) as T;
      responseCache.set(path, { value: data, expiresAt: Date.now() + DEFAULT_CACHE_TTL_MS });
      return data;
    })
    .finally(() => {
      inFlightRequests.delete(path);
    });

  inFlightRequests.set(path, request as Promise<unknown>);
  return request;
}

async function postJson<T, B>(path: string, body: B): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }
  return response.json() as Promise<T>;
}

export const api = {
  getGlobal: (): Promise<GlobalDTO> => fetchJson("/global"),
  getPage: (slug: string): Promise<PageDTO> =>
    fetchJson(`/pages/${encodeURIComponent(slug)}`),
  getBlogList: (params: { page?: number; limit?: number; category?: string; tag?: string }) => {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.category) search.set("category", params.category);
    if (params.tag) search.set("tag", params.tag);
    const query = search.toString();
    return fetchJson<BlogListDTO>(`/blog${query ? `?${query}` : ""}`);
  },
  getBlogPost: (slug: string): Promise<BlogPostDTO> =>
    fetchJson(`/blog/${encodeURIComponent(slug)}`),
  getProjects: (params?: { limit?: number }): Promise<ProjectSummaryDTO[]> => {
    const search = new URLSearchParams();
    if (params?.limit) search.set("limit", String(params.limit));
    const query = search.toString();
    return fetchJson(`/projects${query ? `?${query}` : ""}`);
  },
  getProject: (slug: string): Promise<ProjectDTO> =>
    fetchJson(`/projects/${encodeURIComponent(slug)}`),
  predictCarbon: (payload: CarbonPredictionRequest): Promise<CarbonPredictionResponse> =>
    postJson("/predict-carbon", payload),
  preloadCritical: () =>
    Promise.allSettled([fetchJson("/global"), fetchJson("/pages/home"), fetchJson("/projects?limit=6")]).then(
      () => undefined
    )
};

export { ApiError };
