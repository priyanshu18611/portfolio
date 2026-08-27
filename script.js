// Lucide Icons initialization
lucide.createIcons();

// 1. Interactive 3D Three.js Field
const canvas = document.getElementById('three-bg');
if (canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const particlesCount = 350;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 8.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const material = new THREE.PointsMaterial({
    size: 0.022,
    color: 0xea580c,
    transparent: true,
    opacity: 0.65
  });

  const particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);
  camera.position.z = 3;

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  const clock = new THREE.Clock();
  function animate() {
    const elapsedTime = clock.getElapsedTime();
    particlesMesh.rotation.y = elapsedTime * 0.03 + mouseX * 0.2;
    particlesMesh.rotation.x = -mouseY * 0.2;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// 2. Typewriter Effect
const words = ["Software Engineer", "Data Analyst", "Machine Learning Dev", "Cloud Architect"];
let wordIdx = 0;
const typewriterElem = document.getElementById('typewriter');

function typeEffect() {
  if (!typewriterElem) return;
  let currentWord = words[wordIdx].split("");
  
  const loopTyping = () => {
    if (currentWord.length > 0) {
      typewriterElem.innerHTML += currentWord.shift();
      setTimeout(loopTyping, 90);
    } else {
      setTimeout(eraseEffect, 1800);
    }
  };
  loopTyping();
}

function eraseEffect() {
  if (!typewriterElem) return;
  let wordLen = typewriterElem.innerHTML.length;
  
  const loopErasing = () => {
    if (wordLen > 0) {
      typewriterElem.innerHTML = typewriterElem.innerHTML.substring(0, wordLen - 1);
      wordLen--;
      setTimeout(loopErasing, 45);
    } else {
      wordIdx = (wordIdx + 1) % words.length;
      setTimeout(typeEffect, 300);
    }
  };
  loopErasing();
}

if (typewriterElem) {
  typewriterElem.innerHTML = "";
  typeEffect();
}

// 3. AI Assistant System
function openChat() {
  const modal = document.getElementById('aiChat');
  const btn = document.getElementById('floatingAiBtn');
  if (modal) modal.classList.remove('hidden');
  if (btn) btn.classList.add('hidden');
  const input = document.getElementById('chatInput');
  if (input) input.focus();
}

function closeChat() {
  const modal = document.getElementById('aiChat');
  const btn = document.getElementById('floatingAiBtn');
  if (modal) modal.classList.add('hidden');
  if (btn) btn.classList.remove('hidden');
}

function processAiResponse(userText) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const userDiv = document.createElement('div');
  userDiv.className = 'flex justify-end';
  userDiv.innerHTML = `<div class="max-w-[85%] p-3 rounded-2xl bg-orange-500 text-black font-bold">${userText}</div>`;
  container.appendChild(userDiv);
  container.scrollTop = container.scrollHeight;

  const q = userText.toLowerCase();
  let reply = "Priyanshu is a Software Engineer & Data Analyst pursuing B.Tech CSE at Shershah Engineering College (2022-2026).";

  if (q.includes('project') || q.includes('kisan') || q.includes('agrosmart') || q.includes('ecosentinel')) {
    reply = "🚀 Featured Deployments:\n• EcoSentinel: IoT & Full Stack Wildlife Platform\n• Kisan-Mitra: Smart Farming Dashboard\n• AgroSmart AI Farmer Assistant: Crop Recommendation ML\n• Fake Payment Detector & Spam Mail Classifier\n• Cricket Score Predictor & PDF Resume Parser";
  } else if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('linkedin')) {
    reply = "📬 Contact Info:\n• Phone: +91-6202018611\n• Email: priyanshu6202018611@gmail.com\n• LinkedIn: linkedin.com/in/priyanshuroy18\n• GitHub: github.com/priyanshu18611";
  } else if (q.includes('education') || q.includes('college') || q.includes('10th') || q.includes('12th')) {
    reply = "🎓 Education:\n1. B.Tech in CSE: Shershah Engineering College (2022-2026)\n2. Intermediate (PCM): RB College Dalsingsaray (2018-2020)\n3. Matriculation: JPNS Narhan (2017-2018)";
  } else if (q.includes('certif') || q.includes('skills')) {
    reply = "📜 Credentials:\n• Cisco: Data Analytics Essentials\n• JPMorgan Chase: Software Engineering Simulation\n• AWS: Data Engineering & Prompt Engineering\n• SAP: ABAP & Analytics Cloud";
  }

  setTimeout(() => {
    const aiDiv = document.createElement('div');
    aiDiv.className = 'flex justify-start';
    aiDiv.innerHTML = `<div class="max-w-[85%] p-3 rounded-2xl bg-white/5 text-slate-200 border border-white/10 leading-relaxed whitespace-pre-line">${reply}</div>`;
    container.appendChild(aiDiv);
    container.scrollTop = container.scrollHeight;
  }, 250);
}

function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  input.value = '';
  processAiResponse(val);
}

function askQuickPrompt(txt) {
  processAiResponse(txt);
}
