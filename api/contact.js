export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, contact, purpose, email } = req.body;

    if (!name || !email || !purpose) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_RECEIVER_EMAIL = process.env.CONTACT_RECEIVER_EMAIL || 'posj2004@gmail.com';
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Call Resend API natively via fetch
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'UniAgriQ Contact <onboarding@resend.dev>',
        to: CONTACT_RECEIVER_EMAIL,
        subject: `New Contact Form Submission: ${purpose}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>New Inquiry from ${name}</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Contact:</strong> ${contact || 'Not provided'}</p>
            <p><strong>Purpose:</strong> ${purpose}</p>
            <hr />
            <p style="color: #666; font-size: 12px;">Submitted via UniAgriQ Website</p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, data });
    } else {
      console.error('Resend API Error:', data);
      return res.status(response.status).json({ error: data.message || 'Failed to send email' });
    }
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
