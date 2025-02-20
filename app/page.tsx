"use client";

import { useState, useTransition } from "react";

export default function ConfigPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const response = await fetch("/api/config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus({
            type: "success",
            message: "이미지 URL이 성공적으로 업데이트되었습니다.",
          });
          setImageUrl("");
        } else {
          setStatus({
            type: "error",
            message: data.error || "업데이트 중 오류가 발생했습니다.",
          });
        }
      } catch (_: unknown) {
        setStatus({
          type: "error",
          message: "서버와 통신 중 오류가 발생했습니다.",
        });
      }
    });
  };

  const handleFetchCurrentUrl = () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/config");
        const data = await response.json();
        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
        }
      } catch (_: unknown) {
        setStatus({
          type: "error",
          message: "현재 URL을 가져오는데 실패했습니다.",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          메뉴 이미지 URL 설정
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              이미지 URL
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/menu-image.jpg"
              required
              disabled={isPending}
            />
          </div>

          {status.message && (
            <div
              className={`p-4 rounded-md ${
                status.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {isPending ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                처리중...
              </span>
            ) : (
              "URL 업데이트"
            )}
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-500">
          <h2 className="font-medium mb-2">현재 설정된 URL 확인</h2>
          <button
            onClick={handleFetchCurrentUrl}
            disabled={isPending}
            className={`text-blue-600 hover:text-blue-800 underline ${
              isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            현재 URL 가져오기
          </button>
        </div>
      </div>
    </div>
  );
}
