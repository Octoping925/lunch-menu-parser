import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export async function GET() {
  try {
    const imageUrl = await get("menuImageUrl");
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

    await fetch(
      "https://api.vercel.com/v1/edge-config/ecfg_pjpdrctcqe5nl1uq8q2pxfaxjx9v/items",
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            { operation: "update", key: "menuImageUrl", value: imageUrl },
          ],
        }),
      }
    );

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Edge Config 저장 오류:", error);
    return NextResponse.json(
      { error: "설정 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}
