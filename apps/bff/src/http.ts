export class HttpError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function fetchJson<T>(
  url: string,
  options: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText, body);
  }

  return body as T;
}
