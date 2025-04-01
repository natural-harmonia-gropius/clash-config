import YAML from "yaml";

export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);

  const proxy = url.searchParams.get("proxy");
  if (!proxy) {
    return new Response("Missing parameter: proxy", { status: 400 });
  }

  url.pathname = "/config.yaml";
  const response = await fetch(url);
  if (!response.ok) {
    return new Response("Missing file: config.yaml", { status: 404 });
  }

  const head = await fetch(proxy, { method: "HEAD" });
  const headers = Object.fromEntries(head.headers.entries());

  const content = await response.text();
  const updatedContent = updateContent(content, url, proxy);

  return new Response(updatedContent, { status: 200, headers });
}

function updateContent(yamlContent: string, url: URL, proxy: string) {
  const config = YAML.parse(yamlContent);

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
