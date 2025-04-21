export const runtime = "edge";

export async function GET(): Promise<Response> {
  const response = await fetch(
    "https://github.com/Loyalsoldier/geoip/releases/latest/download/Country.mmdb"
  );

  if (!response.ok) {
    return new Response(
      `Failed to fetch Country.mmdb: ${response.status} ${response.statusText}`,
      { status: response.status }
    );
  }

  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="Country.mmdb"`,
    },
  });
}
