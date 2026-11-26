import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id || !/^[a-zA-Z0-9_-]{10,}$/.test(id)) {
    return new NextResponse("Invalid image ID", { status: 400 });
  }

  const candidateUrls = [
    `https://drive.google.com/thumbnail?id=${id}&sz=w1200`,
    `https://lh3.googleusercontent.com/d/${id}=w1200`,
    `https://drive.google.com/uc?export=view&id=${id}`,
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const contentType = res.headers.get("content-type") || "image/jpeg";
        if (contentType.startsWith("image/")) {
          const buffer = await res.arrayBuffer();
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
            },
          });
        }
      }
    } catch {
      // Intentar con el siguiente endpoint de Google Drive
    }
  }

  return new NextResponse("Image not accessible", { status: 404 });
}
