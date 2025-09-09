// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appointmentId, userEmail, appointmentDate, appointmentTime, doctorId }: AppointmentRequest = await req.json();

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

    // For demo purposes, we'll simulate email sending
    // In production, you would integrate with an email service like SendGrid, Resend, etc.
    console.log(`Simulated email sent to: ${userEmail}`);
    console.log(`Email content: ${emailHtml}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Confirmation email sent (simulated)",
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
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});