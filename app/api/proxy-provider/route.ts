import YAML from "yaml";

export const runtime = "edge";

export async function GET(request: Request) {
  let hash = new URL(request.url).hash.replace(/^#/, "");
  if (!hash) return new Response("Missing URL hash", { status: 400 });

  let yaml = "";
  try {
    yaml = await (
      await fetch(hash, {
        headers: {
          "User-Agent":
            "ClashX Pro/1.97.0.4 (com.west2online.ClashXPro; build:1.97.0.4; macOS 14.0.0) Alamofire/5.9.0",
        },
      })
    ).text();
  } catch (e) {
    return new Response(`Unable to fetch ${hash}\n\n${e}`, {
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
