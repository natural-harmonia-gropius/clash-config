export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const response = await fetch(new URL("/wintun.dll", request.url));

  if (!response.ok) {
    return new Response(
      `Failed to fetch wintun.dll: ${response.status} ${response.statusText}`,
      { status: response.status }
    );
  }

  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="wintun.dll"`,
    },
  });
}
