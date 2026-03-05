import qs from "qs";
import { env } from "../env.js";
import { fetchJson } from "../http.js";

export type StrapiEntity<T> = {
  id: number;
  attributes: T;
};

export type StrapiResponse<T> = {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export async function strapiFetch<T>(
  path: string,
  query?: Record<string, unknown>
): Promise<StrapiResponse<T>> {
  const url = new URL(`/api/${path}`.replace(/\/+/g, "/"), env.STRAPI_URL);
  if (query) {
    url.search = qs.stringify(query, { encodeValuesOnly: true });
  }

  const headers: Record<string, string> = {
    Accept: "application/json"
  };

  if (env.STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${env.STRAPI_TOKEN}`;
  }

  return fetchJson<StrapiResponse<T>>(url.toString(), { headers });
}
