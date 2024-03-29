export const runtime = "edge";

export async function GET(request: Request) {
  let rule = new URL(request.url).searchParams.get("rule");
  if (!rule) return new Response("Missing parameter: rule", { status: 400 });

  let rules = new Blob();
  try {
    rules = await (
      await fetch(
        `https://github.com/Loyalsoldier/clash-rules/raw/release/${rule}.txt`
      )
    ).blob();
  } catch (e) {
    return new Response(`Unable to fetch rule ${rule}\n\n${e}`, {
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
