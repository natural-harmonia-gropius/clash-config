export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const apiUrl = "https://api.github.com/repos/winsw/winsw/releases";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return new Response(`Failed to fetch releases from GitHub`, {
        status: response.status,
      });
    }

    const releases = await response.json();

    // 找到最新的预发布版本
    let latestRelease = releases.find((release: any) => release.prerelease);

    // 如果没有预发布版本，找到最新的发布版本
    if (!latestRelease) {
      latestRelease = releases.find((release: any) => !release.draft);
    }

    if (!latestRelease) {
      return new Response(`No suitable releases found`, { status: 404 });
    }

    // 获取 WinSW-x64.exe 的下载链接
    const asset = latestRelease.assets.find(
      (asset: any) => asset.name === "WinSW-x64.exe"
    );

    if (!asset) {
      return new Response(`WinSW-x64.exe not found in the latest release`, {
        status: 404,
      });
    }

    const downloadUrl = asset.browser_download_url;

    // 下载并返回文件
    const fileResponse = await fetch(downloadUrl);

    if (!fileResponse.ok) {
      return new Response(
        `Failed to download WinSW-x64.exe from ${downloadUrl}`,
        { status: fileResponse.status }
      );
    }

    const exeBlob = await fileResponse.blob();

    return new Response(exeBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="winsw.exe"`,
      },
    });
  } catch (fetchError) {
    return new Response(
      `Unable to process request\n\n${(fetchError as Error).message}`,
      {
        status: 500,
      }
    );
  }
}
