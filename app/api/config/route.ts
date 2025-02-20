import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export async function GET() {
  try {
    const imageUrl = await get("menuImageUrl");
    imageUrl?.valueOf();
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Edge Config 읽기 오류:", error);
    return NextResponse.json(
      { error: "설정을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "이미지 URL이 필요합니다." },
        { status: 400 }
      );
    }

    /*
    curl  -X 'POST' 'https://api.vercel.com/v1/edge-config' \
      -H 'Authorization: Bearer your_vercel_api_token_here' \
      -H 'Content-Type: application/json; charset=utf-8' \
      -d $'{ "slug": "your_edge_config_name_here" }'
     */

    await fetch("https://api.vercel.com/v1/edge-config", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ menuImageUrl: imageUrl }),
    });

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Edge Config 저장 오류:", error);
    return NextResponse.json(
      { error: "설정 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}
