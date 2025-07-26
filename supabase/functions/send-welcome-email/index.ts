import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, firstName, accountNumber } = await req.json()

    // Send email to admin
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CashPoint <noreply@cashpoint.com>',
        to: ['admin@cashpoint.com'],
        subject: 'New User Registration - CashPoint',
        html: `
          <h2>New User Registration</h2>
          <p><strong>Name:</strong> ${firstName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Account Number:</strong> ${accountNumber}</p>
          <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
        `,
      }),
    })

    // Send welcome email to user
    const userEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CashPoint <welcome@cashpoint.com>',
        to: [email],
        subject: 'Welcome to CashPoint - Your Account is Ready!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 40px; text-align: center;">
              <h1 style="color: #fbbf24; margin: 0; font-size: 32px;">Welcome to CashPoint</h1>
              <p style="color: #e5e7eb; margin: 10px 0 0 0; font-size: 18px;">Your Digital Banking Journey Starts Here</p>
            </div>
            
            <div style="padding: 40px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${firstName}!</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                Congratulations! Your CashPoint account has been successfully created. You now have access to our comprehensive digital banking platform.
              </p>
              
              <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin-top: 0;">Your Account Details</h3>
                <p style="color: #4b5563; margin: 5px 0;"><strong>Account Number:</strong> ${accountNumber}</p>
                <p style="color: #4b5563; margin: 5px 0;"><strong>Account Type:</strong> Checking Account</p>
                <p style="color: #4b5563; margin: 5px 0;"><strong>Status:</strong> Active</p>
              </div>
              
              <h3 style="color: #1f2937;">What's Next?</h3>
              <ul style="color: #4b5563; line-height: 1.6;">
                <li>Complete your KYC verification to unlock all features</li>
                <li>Set up direct deposit for your salary</li>
                <li>Explore our high-yield savings account (4.5% APY)</li>
                <li>Download our mobile app for banking on the go</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${Deno.env.get('SITE_URL')}/dashboard" 
                   style="background: #fbbf24; color: #1f2937; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Access Your Dashboard
                </a>
              </div>
              
              <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  <strong>Security Reminder:</strong> Never share your login credentials. CashPoint will never ask for your password via email or phone.
                </p>
              </div>
            </div>
            
            <div style="background: #1f2937; padding: 20px; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                Need help? Contact our 24/7 support team at support@cashpoint.com
              </p>
              <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 12px;">
                © 2025 CashPoint. All rights reserved. FDIC Insured up to $250,000.
              </p>
            </div>
          </div>
        `,
      }),
    })

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})