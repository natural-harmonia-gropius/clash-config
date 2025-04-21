import YAML from "yaml";

export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const proxy = url.searchParams.get("proxy");

  if (!proxy) {
    return new Response("Missing parameter: proxy", { status: 400 });
  }

  const proxyUrl = decodeURIComponent(proxy);

  const head = await fetch(proxyUrl, {
    method: "HEAD",
    headers: {
      "User-Agent": "Clash/v1.18.0",
    },
  });

  if (!head.ok) {
    return new Response(
      `Failed to fetch ${proxyUrl}: ${head.status} ${head.statusText}`,
      { status: 404 }
    );
  }

  const response = await fetch(new URL("/config.yaml", request.url));
  if (!response.ok) {
    return new Response("Missing file: config.yaml", { status: 404 });
  }

  const content = await response.text();
  const updatedContent = updateContent(content, url, proxy);

  return new Response(updatedContent, { status: 200, headers: head.headers });
}

function updateContent(content: string, url: URL, proxy: string) {
  const config = YAML.parse(content);

  url.pathname = "/api/proxy-provider";
  url.search = `?proxy=${encodeURIComponent(proxy)}`;
  config["proxy-providers"].proxy.url = url.toString();

  url.pathname = "/api/rule-provider";
  url.search = `?rule=direct`;
  config["rule-providers"].direct.url = url.toString();
  url.search = `?rule=reject`;
  config["rule-providers"].reject.url = url.toString();
  url.search = `?rule=gfw`;
  config["rule-providers"].gfw.url = url.toString();
  url.search = `?rule=proxy`;
  config["rule-providers"].proxy.url = url.toString();

  return YAML.stringify(config);
}
