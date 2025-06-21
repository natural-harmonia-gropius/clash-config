import YAML from "yaml";

export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const searchParamUrl = url.searchParams.get("url");

  if (!searchParamUrl) {
    return new Response("Missing parameter: url", { status: 400 });
  }

  const configUrl = decodeURIComponent(searchParamUrl);

  const head = await fetch(configUrl, {
    method: "HEAD",
    headers: {
      "User-Agent": "Clash/v1.18.0",
    },
  });

  if (!head.ok) {
    return new Response(
      `Failed to fetch ${configUrl}: ${head.status} ${head.statusText}`,
      { status: 404 }
    );
  }

  const response = await fetch(new URL("/config.yaml", request.url));
  if (!response.ok) {
    return new Response("Missing file: config.yaml", { status: 404 });
  }

  const content = await response.text();
  const updatedContent = updateContent(content, url, searchParamUrl);

  return new Response(updatedContent, { status: 200, headers: head.headers });
}

function updateContent(content: string, url: URL, proxy: string) {
  const config = YAML.parse(content);

  url.pathname = "/api/proxy-provider";
  url.search = `?url=${encodeURIComponent(proxy)}`;
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
