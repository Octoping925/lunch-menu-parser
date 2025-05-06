import { NextResponse } from "next/server";
import sharp from "sharp";
import { get } from "@vercel/edge-config";
import { getDayOfWeek, getKorDate, getYYYYMMDD } from "@/util/date";

const DAY_OF_WEEKS_CROP = {
  monday: { left: 113, top: 299, width: 182, height: 292 },
  tuesday: { left: 295, top: 299, width: 182, height: 292 },
  wednesday: { left: 477, top: 299, width: 182, height: 292 },
  thursday: { left: 659, top: 299, width: 182, height: 292 },
  friday: { left: 841, top: 299, width: 182, height: 292 },
  saturday: null,
  sunday: null,
} as const;

export async function GET(request: Request) {
  const korDate = getKorDate();
  const dayOfWeek = getDayOfWeek(korDate);

  const coord = DAY_OF_WEEKS_CROP[dayOfWeek];
  if (!coord) {
    return NextResponse.json({ error: "잘못된 요일입니다." }, { status: 400 });
  }

  const etag = getYYYYMMDD(korDate);
  const ifNoneMatch = request.headers.get("if-none-match");

  if (ifNoneMatch === etag) {
    return new NextResponse(null, { status: 304 });
  }

  try {
    const imageUrl =
      "https://ep.einfomax.co.kr/boardupload/1745559387741_8470.png";
    // const imageUrl = await get("menuImageUrl"); // Edge Config에서 이미지 URL 가져오기

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json(
        { error: "메뉴 이미지 URL이 설정되지 않았습니다." },
        { status: 404 }
      );
    }

    const image = await cropImage(imageUrl, coord);

    return new NextResponse(image, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "no-cache",
        ETag: etag,
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

async function cropImage(
  imageUrl: string,
  coord: { left: number; top: number; width: number; height: number }
) {
  const buffer = await fetch(imageUrl)
    .then((res) => res.arrayBuffer())
    .then(Buffer.from);

  return sharp(buffer)
    .extract(coord)
    .resize(coord.width * 2, coord.height * 2)
    .toBuffer();
}
