import { NextResponse } from "next/server";

export class FetchError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "FetchError";
    this.status = status;
  }
}

export function handleError(error: unknown): NextResponse {
  if (error instanceof FetchError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("Internal Server Error:", error);
  return NextResponse.json(
    { error: "Internal Server Error" },
    { status: 500 }
  );
}

export async function safeFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new FetchError(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
      response.status
    );
  }
  return response;
}
