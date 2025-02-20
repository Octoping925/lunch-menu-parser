import { NextResponse } from "next/server";
import sharp from "sharp";
import { get } from "@vercel/edge-config";

const DAY_OF_WEEKS_CROP: Record<
  string,
  { left: number; top: number; width: number; height: number }
> = {
  monday: { left: 125, top: 332, width: 209, height: 335 },
  tuesday: { left: 334, top: 332, width: 209, height: 335 },
  wednesday: { left: 542, top: 332, width: 209, height: 335 },
  thursday: { left: 750, top: 332, width: 209, height: 335 },
  friday: { left: 958, top: 332, width: 209, height: 335 },
};

export async function GET() {
  const dayOfWeek = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  try {
    // Edge Config에서 이미지 URL 가져오기
    const imageUrl = await get("menuImageUrl");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "메뉴 이미지 URL이 설정되지 않았습니다." },
        { status: 404 }
      );
    }

    const response = await fetch(imageUrl as string);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 선택된 요일의 좌표
    const coord = DAY_OF_WEEKS_CROP[dayOfWeek.toLowerCase()];
    if (!coord) {
      return NextResponse.json(
        { error: "잘못된 요일입니다." },
        { status: 400 }
      );
    }

    // 이미지 자르기
    const croppedImage = await sharp(buffer)
      .extract({
        left: coord.left,
        top: coord.top,
        width: coord.width,
        height: coord.height,
      })
      .toBuffer();

    // 이미지 반환
    return new NextResponse(croppedImage, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("이미지 처리 중 오류 발생:", error);
    return NextResponse.json(
      { error: "이미지 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
