import { handleError, safeFetch } from "@/app/api/utils";
import { NextRequest, NextResponse } from "next/server";
import YAML from "yaml";

export const runtime = "edge";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const url = new URL(request.url);
    const searchParamUrl = url.searchParams.get("url");

    if (!searchParamUrl) {
      return NextResponse.json(
        { error: "Missing parameter: url" },
        { status: 400 }
      );
    }

    const configUrl = decodeURIComponent(searchParamUrl);

    const head = await safeFetch(configUrl, {
      method: "HEAD",
      headers: {
        "User-Agent": "Clash/v1.18.0",
      },
    });

    const response = await safeFetch(
      new URL("/config.yaml", request.url).toString()
    );

    const content = await response.text();
    const updatedContent = updateContent(content, url, searchParamUrl);

    return new Response(updatedContent, {
      status: 200,
      headers: head.headers,
    });
  } catch (error) {
    return handleError(error);
  }
}

function updateContent(content: string, url: URL, proxy: string) {
  const config = YAML.parse(content);

  const proxyProviderUrl = new URL("/api/proxy-provider", url);
  proxyProviderUrl.searchParams.set("url", proxy);
  config["proxy-providers"].proxy.url = proxyProviderUrl.toString();

  const rules = ["direct", "reject", "gfw", "proxy"];
  for (const rule of rules) {
    const ruleProviderUrl = new URL("/api/rule-provider", url);
    ruleProviderUrl.searchParams.set("rule", rule);
    config["rule-providers"][rule].url = ruleProviderUrl.toString();
  }

  return YAML.stringify(config);
}
