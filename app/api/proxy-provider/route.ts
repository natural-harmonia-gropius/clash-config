import YAML from "yaml";

export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const proxy = url.searchParams.get("proxy");

  if (!proxy) {
    return new Response("Missing parameter: proxy", { status: 400 });
  }

  const proxyUrl = decodeURIComponent(proxy);

  const response = await fetch(proxyUrl, {
    headers: {
      "User-Agent": "Clash/v1.18.0",
    },
  });

  if (!response.ok) {
    return new Response(
      `Failed to fetch ${proxyUrl}: ${response.status} ${response.statusText}`,
      { status: response.status }
    );
  }

  const yamlText = await response.text();

  const { proxies } = YAML.parse(yamlText);
  const providers = YAML.stringify({ proxies });

  return new Response(providers, {
    status: 200,
    headers: {
      "Content-Type": "application/x-yaml; charset=utf-8",
      "Content-Disposition": `attachment; filename="proxies.yaml"`,
    },
  });
}
