import { NextResponse } from "next/server"
import { Resend } from "resend"

// Initialize Resend with key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_dev")

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, email, workType, info } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      )
    }

    // Fallback behavior if RESEND_API_KEY is not defined to prevent crashing during local development
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_dummy_key_for_dev") {
      console.warn("RESEND_API_KEY is not configured. Simulating email transmission.")
      console.log("Simulated Email Payload:", {
        to: "posj2004@gmail.com",
        from: "onboarding@resend.dev",
        subject: `New Contact Submission from ${name} [${workType || "Other"}]`,
        data: { name, phone, email, workType, info }
      })
      return NextResponse.json({ success: true, simulated: true })
    }

    // Send structured email notification
    const { data, error } = await resend.emails.send({
      from: "UniAgric Contact <onboarding@resend.dev>",
      to: ["posj2004@gmail.com"],
      subject: `New Contact Form Submission: ${name} (${workType || "General"})`,
      html: `
        <div style="font-family: sans-serif; padding: 25px; color: #333; max-width: 600px; border: 1px solid #ddd; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #165F39; border-bottom: 2px solid #165F39; padding-bottom: 12px; margin-top: 0;">New Contact Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 120px; color: #666;">Name:</td>
              <td style="padding: 6px 0; color: #111;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #666;">Email:</td>
              <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #165F39; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #666;">Phone:</td>
              <td style="padding: 6px 0; color: #111;">${phone || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #666;">User Role:</td>
              <td style="padding: 6px 0; color: #111;"><span style="background-color: #e8f5e9; color: #1b5e20; padding: 3px 8px; border-radius: 4px; font-size: 0.85em; font-weight: bold;">${workType || "Other"}</span></td>
            </tr>
          </table>
          
          <div style="margin-top: 25px; padding: 18px; background-color: #f9f9f9; border-left: 5px solid #165F39; border-radius: 6px;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #165F39;">Inquiry Message:</p>
            <p style="margin: 0; white-space: pre-wrap; color: #444; line-height: 1.5;">${info}</p>
          </div>
          
          <p style="font-size: 11px; color: #888; margin-top: 35px; border-top: 1px solid #eee; padding-top: 12px; text-align: center;">
            This notification was generated automatically by UniAgric via Resend.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend API error response:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    console.error("Unhandle exception in contact submission route:", err)
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 })
  }
}
