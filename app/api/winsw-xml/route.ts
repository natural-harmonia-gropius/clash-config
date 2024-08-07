import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { join } from "path";

export const runtime = "edge";

export async function GET() {
  try {
    // 文件路径为当前目录下的 winsw.xml
    const filePath = join(
      process.cwd(),
      "app",
      "api",
      "winsw-xml",
      "winsw.xml"
    );
    const xmlContent = await fs.readFile(filePath, "utf-8");

    return new NextResponse(xmlContent, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": `attachment; filename="winsw.xml"`,
      },
    });
  } catch (error) {
    return new NextResponse(
      `Unable to read winsw.xml file\n\n${(error as Error).message}`,
      {
        status: 500,
      }
    );
  }
}
