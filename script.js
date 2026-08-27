// Lucide Icons initialization
lucide.createIcons();

// 1. Advanced 3D Three.js Geometric Neural Orb + Particles
const canvas = document.getElementById('three-bg');
if (canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 3D Geometric Wireframe Sphere
  const sphereGeo = new THREE.IcosahedronGeometry(1.6, 2);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0xea580c,
    wireframe: true,
    transparent: true,
    opacity: 0.22
  });
  const neuralOrb = new THREE.Mesh(sphereGeo, sphereMat);
  neuralOrb.position.set(2.2, 0, -1);
  scene.add(neuralOrb);

  // Background Starfield Particles
  const particlesCount = 450;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 9.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const material = new THREE.PointsMaterial({
    size: 0.024,
    color: 0xfb923c,
    transparent: true,
    opacity: 0.6
  });

  const particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);
  camera.position.z = 3.2;

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  const clock = new THREE.Clock();
  function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Smooth camera / orb interpolation
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    neuralOrb.rotation.x = elapsedTime * 0.12;
    neuralOrb.rotation.y = elapsedTime * 0.18 + targetX * 1.5;
    neuralOrb.position.y = Math.sin(elapsedTime * 0.8) * 0.15;

    particlesMesh.rotation.y = elapsedTime * 0.02 + targetX * 0.2;
    particlesMesh.rotation.x = -targetY * 0.2;

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

// 2. Interactive 3D Tilt on Cards (Parallax Hover)
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 25}deg) rotateY(${x / 25}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
  });
});

// 3. Multi-Role Typewriter Effect
const words = ["Software Engineer", "Data Analyst", "Machine Learning Dev", "Cloud Architect"];
let wordIdx = 0;
const typewriterElem = document.getElementById('typewriter');

function typeEffect() {
  if (!typewriterElem) return;
  let currentWord = words[wordIdx].split("");
  
  const loopTyping = () => {
    if (currentWord.length > 0) {
      typewriterElem.innerHTML += currentWord.shift();
      setTimeout(loopTyping, 85);
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
      setTimeout(loopErasing, 40);
    } else {
      wordIdx = (wordIdx + 1) % words.length;
      setTimeout(typeEffect, 250);
    }
  };
  loopErasing();
}

if (typewriterElem) {
  typewriterElem.innerHTML = "";
  typeEffect();
}

// 4. AI Recruiter Assistant Modal
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

async function processAiResponse(userText) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const userDiv = document.createElement('div');
  userDiv.className = 'flex justify-end';
  userDiv.innerHTML = `<div class="max-w-[85%] p-3 rounded-2xl bg-orange-500 text-black font-bold">${userText}</div>`;
  container.appendChild(userDiv);
  container.scrollTop = container.scrollHeight;

  let reply = "Priyanshu is a Software Engineer & Data Analyst pursuing B.Tech CSE (2022-2026).";

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userText })
    });
    if (res.ok) {
      const data = await res.json();
      reply = data.reply;
    }
  } catch(e) {}

  setTimeout(() => {
    const aiDiv = document.createElement('div');
    aiDiv.className = 'flex justify-start';
    aiDiv.innerHTML = `<div class="max-w-[85%] p-3 rounded-2xl bg-white/5 text-slate-200 border border-white/10 leading-relaxed whitespace-pre-line">${reply}</div>`;
    container.appendChild(aiDiv);
    container.scrollTop = container.scrollHeight;
  }, 200);
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
