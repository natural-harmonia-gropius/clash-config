export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const rule = url.searchParams.get("rule");

  if (!rule) {
    return new Response("Missing parameter: rule", { status: 400 });
  }

  try {
    const response = await fetch(
      `https://github.com/Loyalsoldier/clash-rules/releases/latest/download/${rule}.txt`
    );

    if (!response.ok) {
      return new Response(`Failed to fetch ${rule}.txt`, {
        status: response.status,
      });
    }

    const rulesBlob = await response.blob();

    return new Response(rulesBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/x-yaml; charset=utf-8",
        "Content-Disposition": `attachment; filename="${rule}.yaml"`,
      },
    });
  } catch (error) {
    return new Response(
      `Error fetching rule ${rule}\n\n${(error as Error).message}`,
      {
        status: 500,
      }
    );
  }
}
