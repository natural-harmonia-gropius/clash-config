import YAML from "yaml";
import { NextRequest, NextResponse } from "next/server";
import { safeFetch, handleError } from "@/app/api/utils";

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

    const response = await safeFetch(configUrl, {
      headers: {
        "User-Agent": "Clash/v1.18.0",
      },
    });

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
  } catch (error) {
    return handleError(error);
  }
}
