export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  // 从请求的 URL 提取主机名
  const url = new URL(request.url);
  const host = url.hostname;

  // 构建 public 目录中的 winsw.xml 文件的 URL
  const baseURL = `${url.protocol}//${host}`;
  const xmlURL = `${baseURL}/winsw.xml`;

  try {
    // 从 public 目录读取 winsw.xml 文件
    const response = await fetch(xmlURL);

    if (!response.ok) {
      return new Response(`Failed to fetch winsw.xml`, {
        status: response.status,
      });
    }

    const xmlContent = await response.text();

    return new Response(xmlContent, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": `attachment; filename="winsw.xml"`,
      },
    });
  } catch (error) {
    return new Response(
      `Unable to process winsw.xml file\n\n${(error as Error).message}`,
      {
        status: 500,
      }
    );
  }
}
