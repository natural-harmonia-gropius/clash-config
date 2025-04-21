export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const rule = url.searchParams.get("rule");

  if (!rule) {
    return new Response("Missing parameter: rule", { status: 400 });
  }

  const response = await fetch(
    `https://github.com/Loyalsoldier/clash-rules/releases/latest/download/${rule}.txt`
  );

  if (!response.ok) {
    return new Response(
      `Failed to fetch ${rule}.txt: ${response.status} ${response.statusText}`,
      { status: response.status }
    );
  }

  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": "application/x-yaml; charset=utf-8",
      "Content-Disposition": `attachment; filename="${rule}.yaml"`,
    },
  });
}
