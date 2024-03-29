export const runtime = "edge";

export async function GET(request: Request) {
  let hash = new URL(request.url).hash.replace(/^#/, "");
  if (!hash) return new Response("Missing URL hash", { status: 400 });

  let rules = new Blob();
  try {
    rules = await (
      await fetch(
        `https://github.com/Loyalsoldier/clash-rules/raw/release/${hash}.txt`
      )
    ).blob();
  } catch (e) {
    return new Response(`Unable to fetch rule ${hash}\n\n${e}`, {
      status: 400,
    });
  }

  return new Response(rules, {
    status: 200,
    headers: {
      "Content-Type": "application/x-yaml; charset=utf-8",
      "Content-Disposition": `attachment; filename="rules.yaml"`,
    },
  });
}
