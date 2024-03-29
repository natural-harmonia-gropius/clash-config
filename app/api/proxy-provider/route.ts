import YAML from "yaml";

export const runtime = "edge";

export async function GET(request: Request) {
  let url = new URL(request.url).searchParams.get("url");
  if (!url) return new Response("Missing parameter: url", { status: 400 });
  url = decodeURIComponent(url);

  let yaml = "";
  try {
    yaml = await (
      await fetch(url, {
        headers: {
          "User-Agent":
            "ClashX Pro/1.97.0.4 (com.west2online.ClashXPro; build:1.97.0.4; macOS 14.0.0) Alamofire/5.9.0",
        },
      })
    ).text();
  } catch (e) {
    return new Response(`Unable to fetch from ${url}\n\n${e}`, {
      status: 400,
    });
  }

  let providers = "";
  try {
    const { proxies } = YAML.parse(yaml);
    providers = YAML.stringify({ proxies });
  } catch (e) {
    return new Response(`Unable to parse config\n\n${e}`, {
      status: 400,
    });
  }

  return new Response(providers, {
    status: 200,
    headers: {
      "Content-Type": "application/x-yaml; charset=utf-8",
      "Content-Disposition": `attachment; filename="proxies.yaml"`,
    },
  });
}
