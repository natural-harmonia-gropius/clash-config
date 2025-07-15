import { handleError, safeFetch } from "@/app/api/utils";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const url = new URL(request.url);
    const os = url.searchParams.get("os");

    if (!os) {
      return NextResponse.json(
        { error: "OS parameter is required" },
        { status: 400 }
      );
    }

    const response = await safeFetch(
      "https://api.github.com/repos/chen08209/FlClash/releases/latest",
      { next: { revalidate: 3600 } }
    );

    const release = await response.json();
    const asset = release.assets.find((asset: { name: string }) =>
      asset.name.includes(os)
    );

    if (!asset) {
      return NextResponse.json(
        { error: "Release not found for this OS" },
        { status: 404 }
      );
    }

    const download = await safeFetch(asset.browser_download_url);

    return new Response(download.body, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename=${asset.name}`,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
