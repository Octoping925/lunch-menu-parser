import { get } from "@vercel/edge-config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const messengerUrl = await get("messengerUrl");
    await fetch(messengerUrl as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        botName: "밥먹는 봇",
        botIconImage:
          "https://i1.ruliweb.com/img/19/10/10/16db5b26c7a1b4b3.jpg",
        attachments: [
          {
            title: "오늘의 메뉴",
            imageUrl: "https://lunch-menu-parser.vercel.app/api/menu",
            color: "blue",
          },
        ],
      }),
    });

    return new NextResponse("success");
  } catch (error) {
    console.error("챗봇 처리 중 오류 발생:", error);
    return NextResponse.json(
      { error: "챗봇 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
