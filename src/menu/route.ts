import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// 요일별 자르기 좌표 (예시 - 실제 이미지에 맞게 조정 필요)
const DAY_OF_WEEKS_CROP: Record<
  string,
  { left: number; top: number; width: number; height: number }
> = {
  monday: { left: 0, top: 100, width: 200, height: 300 },
  tuesday: { left: 200, top: 100, width: 200, height: 300 },
  wednesday: { left: 400, top: 100, width: 200, height: 300 },
  thursday: { left: 600, top: 100, width: 200, height: 300 },
  friday: { left: 800, top: 100, width: 200, height: 300 },
};

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    // 요일
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString("ko-KR", { weekday: "long" });

    // 이미지 URL에서 이미지를 가져옴
    const response = await fetch(imageUrl);
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
