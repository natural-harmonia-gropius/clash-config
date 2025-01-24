import YAML from "yaml";

export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const proxyParam = new URL(request.url).searchParams.get("proxy");

  if (!proxyParam) {
    return new Response("Missing parameter: proxy", { status: 400 });
  }

  const proxyUrl = decodeURIComponent(proxyParam);

  try {
    const response = await fetch(proxyUrl, {
      headers: {
        "User-Agent": "Clash/v1.18.0",
      },
    });

    if (!response.ok) {
      return new Response(`Failed to fetch from ${proxyUrl}`, {
        status: response.status,
      });
    }

    const yamlText = await response.text();

    try {
      const { proxies } = YAML.parse(yamlText);
      const providers = YAML.stringify({ proxies });

      return new Response(providers, {
        status: 200,
        headers: {
          "Content-Type": "application/x-yaml; charset=utf-8",
          "Content-Disposition": `attachment; filename="proxies.yaml"`,
        },
      });
    } catch (parseError) {
      return new Response(
        `Unable to parse config\n\n${(parseError as Error).message}`,
        {
          status: 400,
        }
      );
    }
  } catch (fetchError) {
    return new Response(
      `Unable to fetch from ${proxyUrl}\n\n${(fetchError as Error).message}`,
      {
        status: 500,
      }
    );
  }
}
