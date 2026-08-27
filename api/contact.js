export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Production Server Log / Database Handshake
  console.log(`[RECRUITER LEAD] From: ${name} (${email}) - Message: ${message}`);

  return res.status(200).json({
    success: true,
    message: `Thank you ${name}! Your dispatch has been processed by Priyanshu's backend API.`,
    timestamp: new Date().toISOString()
  });
}
