import { NextResponse } from "next/server"
import { getNotificationTemplates } from "@/lib/notifications"

// In a production environment, you would use a proper email service
// like SendGrid, Mailgun, AWS SES, etc.
async function sendEmail(to: string, subject: string, body: string) {
  // This is a mock implementation
  console.log(`Sending email to ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Body: ${body}`)

  // In production, you would use something like:
  // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     personalizations: [{ to: [{ email: to }] }],
  //     from: { email: 'notifications@shiptrackpro.com' },
  //     subject,
  //     content: [{ type: 'text/plain', value: body }],
  //   }),
  // });

  // For now, we'll just simulate a successful email send
  return { success: true }
}

export async function POST(request: Request) {
  try {
    const { shipmentId, clientEmail, clientName, notificationType, additionalData } = await request.json()

    if (!shipmentId || !clientEmail || !notificationType) {
      return NextResponse.json(
        {
          error: "Missing required fields: shipmentId, clientEmail, or notificationType",
        },
        { status: 400 },
      )
    }

    const template = getNotificationTemplates(notificationType, {
      shipmentId,
      clientName: clientName || "Client",
      ...additionalData,
    })

    // Send the actual email
    await sendEmail(clientEmail, template.subject, template.body)

    return NextResponse.json({
      success: true,
      message: `Notification of type ${notificationType} sent to ${clientEmail} for shipment ${shipmentId}`,
      emailSubject: template.subject,
      emailPreview: template.body.substring(0, 100) + "...",
    })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json(
      {
        error: "Failed to send notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
