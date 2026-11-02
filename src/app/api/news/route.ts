import { NextResponse } from "next/server";
import { getAllNews } from "@/lib/news-server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getAllNews());
}
