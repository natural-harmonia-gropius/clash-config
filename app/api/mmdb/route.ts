export const runtime = "edge";

export async function GET(): Promise<Response> {
  const releaseUrl =
    "https://github.com/Loyalsoldier/geoip/releases/latest/download/Country.mmdb";

  try {
    const response = await fetch(releaseUrl);

    if (!response.ok) {
      return new Response(`Failed to fetch Country.mmdb`, {
        status: response.status,
      });
    }

    const mmdbBlob = await response.blob();

    return new Response(mmdbBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="Country.mmdb"`,
      },
    });
  } catch (fetchError) {
    return new Response(
      `Unable to fetch Country.mmdb\n\n${(fetchError as Error).message}`,
      {
        status: 500,
      }
    );
  }
}
