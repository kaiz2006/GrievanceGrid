const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://localhost:8000/api/v1";

export interface GraphQLContext {
  authHeader?: string;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit,
  ctx?: GraphQLContext
): Promise<T> {
  const headers = new Headers(init.headers ?? {});
  headers.set("Content-Type", "application/json");

  if (ctx?.authHeader) {
    headers.set("Authorization", ctx.authHeader);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const body = await parseResponse(response);

  if (!response.ok) {
    let detail = response.statusText;
    if (body && typeof body === "object" && "detail" in body) {
      detail = String((body as { detail: unknown }).detail);
    }
    throw new ApiError(detail, response.status);
  }

  return body as T;
}
