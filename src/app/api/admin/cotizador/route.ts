import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getCotizadorConfig, saveCotizadorConfig } from "@/lib/cotizador-config";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const config = await getCotizadorConfig();
  if (!config) return NextResponse.json({ error: "No se pudo leer la configuración" }, { status: 500 });
  return NextResponse.json(config);
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    await saveCotizadorConfig(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving cotizador config:", error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
