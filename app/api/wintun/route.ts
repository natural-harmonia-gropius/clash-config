export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  // 从请求的 URL 提取主机名
  const url = new URL(request.url);
  const host = url.hostname;

  // 构建 public 目录中的 wintun.dll 文件的 URL
  const baseURL = `${url.protocol}//${host}`;
  const dllURL = `${baseURL}/wintun.dll`;

  try {
    // 从 public 目录读取 wintun.dll 文件
    const response = await fetch(dllURL);

    if (!response.ok) {
      return new Response(`Failed to fetch wintun.dll`, {
        status: response.status,
      });
    }

    const dllBlob = await response.blob();

    return new Response(dllBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        "Content-Disposition": `attachment; filename="wintun.dll"`,
      },
    });
  } catch (error) {
    return new Response(
      `Unable to process wintun.dll file\n\n${(error as Error).message}`,
      {
        status: 500,
      }
    );
  }
}
