export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const os = url.searchParams.get("os");

  if (!os) {
    return new Response("OS parameter is required", { status: 400 });
  }

  const response = await fetch(
    "https://api.github.com/repos/chen08209/FlClash/releases/latest"
  );

  if (!response.ok) {
    return new Response("Failed to fetch latest releases", {
      status: response.status,
    });
  }

  const release = await response.json();
  const asset = release.assets.find((asset: { name: string }) =>
    asset.name.includes(os)
  );

  if (!asset) {
    return new Response("Release not found for this OS", { status: 404 });
  }

  const download = await fetch(asset.browser_download_url);
  if (!download.ok) {
    return new Response("Failed to download", { status: 500 });
  }

  return new Response(download.body, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename=${asset.name}`,
    },
  });
}
