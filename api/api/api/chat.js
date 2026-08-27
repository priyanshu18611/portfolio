export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query } = req.body;
  const q = (query || '').toLowerCase();

  let response = "Priyanshu is a Software Engineer & Data Analyst pursuing B.Tech CSE at Shershah Engineering College.";

  if (q.includes('backend') || q.includes('api') || q.includes('fullstack')) {
    response = "⚡ Full-Stack Architecture Active:\n• Backend: Node.js Vercel Serverless Functions (/api)\n• Database & Cloud: MongoDB, AWS Data Engineering, REST Endpoints\n• Frontend: Cyberpunk UI with Tailwind CSS & Three.js 3D particles.";
  } else if (q.includes('project') || q.includes('kisan') || q.includes('ecosentinel')) {
    response = "🚀 Production Repositories:\n1. EcoSentinel (IoT & Kafka Wildlife Tracker)\n2. Brain Tumor Detection (TensorFlow/Keras CNN)\n3. Kisan-Mitra & AgroSmart AI (Smart Farming ML)\n4. Fake Payment & Spam Mail Detectors";
  } else if (q.includes('contact') || q.includes('phone') || q.includes('hire')) {
    response = "📬 Direct Channels:\n• Phone: +91-6202018611\n• Email: priyanshu6202018611@gmail.com\n• LinkedIn: linkedin.com/in/priyanshuroy18";
  } else if (q.includes('education') || q.includes('college')) {
    response = "🎓 Academic Background:\n1. B.Tech CSE: Shershah Engineering College (2022-2026)\n2. Intermediate (PCM): RB College (2018-2020)\n3. Matriculation: JPNS Narhan (2017-2018)";
  }

  return res.status(200).json({ reply: response });
}
