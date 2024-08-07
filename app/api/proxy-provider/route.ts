import YAML from "yaml";

export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const urlParam = new URL(request.url).searchParams.get("url");

  if (!urlParam) {
    return new Response("Missing parameter: url", { status: 400 });
  }

  const url = decodeURIComponent(urlParam);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "ClashX Pro/1.97.0.4",
      },
    });

    if (!response.ok) {
      return new Response(`Failed to fetch from ${url}`, {
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
      `Unable to fetch from ${url}\n\n${(fetchError as Error).message}`,
      {
        status: 500,
      }
    );
  }
}
