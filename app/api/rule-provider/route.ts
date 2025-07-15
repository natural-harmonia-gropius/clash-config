import { NextRequest, NextResponse } from "next/server";
import { safeFetch, handleError } from "@/app/api/utils";

export const runtime = "edge";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const url = new URL(request.url);
    const rule = url.searchParams.get("rule");

    if (!rule) {
      return NextResponse.json(
        { error: "Missing parameter: rule" },
        { status: 400 }
      );
    }

    const response = await safeFetch(
      `https://github.com/Loyalsoldier/clash-rules/releases/latest/download/${rule}.txt`
    );

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "application/x-yaml; charset=utf-8",
        "Content-Disposition": `attachment; filename="${rule}.yaml"`,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
