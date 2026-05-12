import { NextResponse } from "next/server";
import { getChatConfig, saveChatConfig } from "@/lib/chat-config";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const config = await getChatConfig();
  return NextResponse.json(config);
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const config = await req.json();
    await saveChatConfig(config);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
