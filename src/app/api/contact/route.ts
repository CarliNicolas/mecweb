import { NextRequest, NextResponse } from "next/server";
import { isRateLimited, tooManyRequests } from "@/lib/rate-limit";

const LIMITS = { nombre: 120, email: 200, telefono: 40, asunto: 60, mensaje: 5000 };

// Los datos del formulario van dentro de un mail HTML: se escapan siempre.
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function POST(request: NextRequest) {
  if (await isRateLimited("CONTACT_LIMITER", request)) return tooManyRequests();
  try {
    const raw = (await request.json()) as Record<string, unknown>;
    const field = (k: keyof typeof LIMITS) => (typeof raw[k] === "string" ? (raw[k] as string).trim() : "");
    const fields = {
      nombre: field("nombre"), email: field("email"), telefono: field("telefono"),
      asunto: field("asunto"), mensaje: field("mensaje"),
    };
    const tooLong = (Object.keys(LIMITS) as (keyof typeof LIMITS)[]).some((k) => fields[k].length > LIMITS[k]);
    if (tooLong || (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    const nombre = escapeHtml(fields.nombre);
    const email = fields.email; // validado arriba; se escapa al insertarlo en el HTML
    const telefono = escapeHtml(fields.telefono);
    const asunto = fields.asunto;
    const mensaje = escapeHtml(fields.mensaje);

    // Validate required fields
    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json(
        { error: "Todos los campos requeridos deben ser completados" },
        { status: 400 }
      );
    }

    // Subject mapping
    const subjectMap: Record<string, string> = {
      enfriadores: "Enfriadores Evaporativos",
      calefactores: "Calefactores Radiantes",
      ventilacion: "Ventilación Industrial",
      filtracion: "Filtración de Aire",
      control: "Control y Automatización",
      otro: "Otro",
    };

    const subjectPlain = (subjectMap[asunto] || asunto).replace(/[\r\n]+/g, " ");
    const subjectText = escapeHtml(subjectPlain);

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      // Sin datos personales en los logs
      console.warn("Contact form submission received but RESEND_API_KEY is not configured: message not delivered");

      return NextResponse.json({
        success: true,
        message: "Mensaje recibido (modo demo)",
      });
    }

    // Dynamically import Resend only when needed
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "MECSA Contact Form <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL || "info@mecsa.com.ar"],
      replyTo: email || undefined,
      subject: `[MECSA Web] Consulta: ${subjectPlain}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #ac493f; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Nueva Consulta desde la Web</h1>
          </div>

          <div style="padding: 30px; background-color: #f8f1f0;">
            <h2 style="color: #ac493f; margin-top: 0;">Información del Contacto</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">Nombre:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Teléfono:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${telefono || "No proporcionado"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Asunto:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${subjectText}</td>
              </tr>
            </table>

            <h3 style="color: #ac493f; margin-top: 30px;">Mensaje:</h3>
            <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
              <p style="margin: 0; white-space: pre-wrap;">${mensaje}</p>
            </div>
          </div>

          <div style="background-color: #4d4844; padding: 15px; text-align: center;">
            <p style="color: #ccc; margin: 0; font-size: 12px;">
              Este mensaje fue enviado desde el formulario de contacto de mecsa.com.ar
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Error al enviar el mensaje" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mensaje enviado correctamente",
      id: data?.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
