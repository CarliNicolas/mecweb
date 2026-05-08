import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, asunto, mensaje } = body;

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

    const subjectText = subjectMap[asunto] || asunto;

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.log("Contact form submission (no Resend API key configured):", {
        nombre,
        email,
        telefono,
        asunto: subjectText,
        mensaje,
      });

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
      replyTo: email,
      subject: `[MECSA Web] Consulta: ${subjectText}`,
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
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
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
