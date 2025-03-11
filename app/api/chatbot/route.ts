import { get } from "@vercel/edge-config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const messengerUrls = await get("messengerUrls");

    if (!Array.isArray(messengerUrls)) {
      return new NextResponse("messengerUrls is not an array", { status: 400 });
    }

    for (const url of messengerUrls) {
      await fetch(url as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          botName: "밥먹는 봇",
          botIconImage:
            "https://i.namu.wiki/i/b4vCFcxoyUzgBHLeqIV_Q9xEeFpK7e-H7cwLfjqzMakmfeERWKASNS8rO9VpvFqndaxD-lFplv3TK6kkLfeFaQ.webp",
          attachments: [
            {
              title: "오늘의 메뉴",
              imageUrl: `https://lunch-menu-parser.vercel.app/api/menu?cache-bust=${Date.now()}`,
              color: "blue",
            },
          ],
        }),
      });
    }

    return new NextResponse("success");
  } catch (error) {
    console.error("챗봇 처리 중 오류 발생:", error);
    return NextResponse.json(
      { error: "챗봇 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
