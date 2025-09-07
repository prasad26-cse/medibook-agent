import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AppointmentRequest {
  appointmentId: string;
  userEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorId: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appointmentId, userEmail, appointmentDate, appointmentTime, doctorId }: AppointmentRequest = await req.json();

    // Using SendGrid free tier
    const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY");

    if (!sendgridApiKey) {
      throw new Error("SENDGRID_API_KEY not configured");
    }

    // Simple free tier email confirmation
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Appointment Confirmation</h2>
        <p>Your medical appointment has been successfully booked!</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Appointment Details:</h3>
          <p><strong>Date:</strong> ${appointmentDate}</p>
          <p><strong>Time:</strong> ${appointmentTime}</p>
          <p><strong>Status:</strong> Pending Confirmation</p>
          <p><strong>Appointment ID:</strong> ${appointmentId}</p>
        </div>
        
        <p>Please arrive 15 minutes early for your appointment.</p>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px;">
            <strong>Free Tier Service:</strong> This is a basic confirmation email. 
            Premium features include SMS reminders, calendar integration, and personalized health tips.
          </p>
        </div>
        
        <p>Thank you for choosing MedSchedule!</p>
      </div>
    `;

    const emailData = {
      personalizations: [{ to: [{ email: userEmail }] }],
      from: { email: "noreply@medschedule.com", name: "MedSchedule" },
      subject: "Appointment Confirmation - MedSchedule",
      content: [{ type: "text/html", value: emailHtml }],
    };

    // Send via SendGrid free tier
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sendgridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("SendGrid API error:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    // SendGrid returns 202 Accepted on success, with an empty body.
    console.log("Email sent successfully via SendGrid.");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Confirmation email sent",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-confirmation function:", error);

    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});