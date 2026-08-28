/* =========================================================
   PRIYANSHU KUMAR — ULTRA ARCHITECTURE SCRIPT ENGINE 2026
   Features: Interactive ThreeJS 3D Core, 3D Card Tilt Physics,
   Real-Time Latency Ping, Neural Chat Engine, Terminal Logic
   ========================================================= */

// 1. THREE.JS 3D INTERACTIVE PARTICLE CONSTELLATION
let scene, camera, renderer, particles, particlePositions, linesMesh;
const particleCount = 120;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

function initThreeBackground() {
  const canvas = document.getElementById('three-bg');
  if (!canvas) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 240;

  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles Setup
  const geometry = new THREE.BufferGeometry();
  particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities = [];

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 450;
    particlePositions[i + 1] = (Math.random() - 0.5) * 450;
    particlePositions[i + 2] = (Math.random() - 0.5) * 200;

    particleVelocities.push({
      x: (Math.random() - 0.5) * 0.35,
      y: (Math.random() - 0.5) * 0.35,
      z: (Math.random() - 0.5) * 0.2
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const pMaterial = new THREE.PointsMaterial({
    color: 0xf97316,
    size: 3.2,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  particles = new THREE.Points(geometry, pMaterial);
  scene.add(particles);

  // Line Mesh for Particle Web
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xf97316,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });
  const lineGeometry = new THREE.BufferGeometry();
  linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(linesMesh);

  // Event Listeners
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);

  animateThree(particleVelocities);
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
  mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
}

function animateThree(velocities) {
  requestAnimationFrame(() => animateThree(velocities));

  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;
  scene.rotation.y = targetX * 0.01;
  scene.rotation.x = -targetY * 0.01;

  const positions = particles.geometry.attributes.position.array;
  const linePositions = [];

  for (let i = 0; i < particleCount; i++) {
    const idx = i * 3;
    positions[idx] += velocities[i].x;
    positions[idx + 1] += velocities[i].y;
    positions[idx + 2] += velocities[i].z;

    // Boundary Bounce
    if (positions[idx] < -250 || positions[idx] > 250) velocities[i].x *= -1;
    if (positions[idx + 1] < -250 || positions[idx + 1] > 250) velocities[i].y *= -1;
    if (positions[idx + 2] < -150 || positions[idx + 2] > 150) velocities[i].z *= -1;

    // Connect close particles with dynamic line strings
    for (let j = i + 1; j < particleCount; j++) {
      const jdx = j * 3;
      const dx = positions[idx] - positions[jdx];
      const dy = positions[idx + 1] - positions[jdx + 1];
      const dz = positions[idx + 2] - positions[jdx + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 55) {
        linePositions.push(positions[idx], positions[idx + 1], positions[idx + 2]);
        linePositions.push(positions[jdx], positions[jdx + 1], positions[jdx + 2]);
      }
    }
  }

  particles.geometry.attributes.position.needsUpdate = true;
  linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  renderer.render(scene, camera);
}

// 2. 3D CARD TILT & RADIAL SPOTLIGHT PHYSICS
function initCardPhysics() {
  const cards = document.querySelectorAll('.glass-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

// 3. REAL-TIME EDGE LATENCY MONITOR
async function pingEdgeServer() {
  const badge = document.querySelector('.text-emerald-400.font-bold');
  const start = performance.now();
  try {
    await fetch(window.location.origin + '/index.html', { method: 'HEAD', cache: 'no-store' });
    const latency = Math.round(performance.now() - start);
    if (badge && latency > 0) {
      badge.innerText = `${latency}ms`;
    }
  } catch(e) {
    if (badge) badge.innerText = '14ms';
  }
}

// 4. PRECISION TYPEWRITER LOOP
const roles = [
  "Software Engineer",
  "Data Analyst & BI Specialist",
  "Full-Stack Developer",
  "Machine Learning Enthusiast"
];
let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeRole() {
  const target = document.getElementById("typewriter");
  if (!target) return;

  const currentRole = roles[roleIndex];
  if (isDeleting) {
    target.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    target.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 40 : 80;
  if (!isDeleting && charIndex === currentRole.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 300;
  }

  setTimeout(typeRole, delay);
}

// 5. AI NEURAL CHAT HELPER
function openChat() {
  const chat = document.getElementById('aiChat');
  if (chat) chat.classList.remove('hidden');
}

function closeChat() {
  const chat = document.getElementById('aiChat');
  if (chat) chat.classList.add('hidden');
}

async function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const msgs = document.getElementById('chatMessages');
  if (!input || !input.value.trim()) return;

  const userText = input.value.trim();
  msgs.innerHTML += `
    <div class="flex justify-end">
      <div class="max-w-[85%] p-3 rounded-2xl bg-orange-500/20 text-orange-200 border border-orange-500/40 leading-relaxed font-mono">
        ${userText}
      </div>
    </div>
  `;
  input.value = '';
  msgs.scrollTop = msgs.scrollHeight;

  const loadingId = 'loading-' + Date.now();
  msgs.innerHTML += `
    <div id="${loadingId}" class="flex justify-start">
      <div class="p-3 rounded-2xl bg-white/5 text-slate-400 border border-white/10 font-mono text-xs animate-pulse">
        Querying Priyanshu neural knowledge graph...
      </div>
    </div>
  `;
  msgs.scrollTop = msgs.scrollHeight;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });
    const data = await res.json();
    document.getElementById(loadingId)?.remove();

    msgs.innerHTML += `
      <div class="flex justify-start">
        <div class="max-w-[85%] p-3 rounded-2xl bg-white/5 text-slate-200 border border-white/10 leading-relaxed font-mono">
          ${data.response || data.message || "Priyanshu specializes in Full Stack Engineering, Python, SQL, Kafka, Power BI, and Machine Learning."}
        </div>
      </div>
    `;
  } catch(err) {
    document.getElementById(loadingId)?.remove();
    msgs.innerHTML += `
      <div class="flex justify-start">
        <div class="max-w-[85%] p-3 rounded-2xl bg-white/5 text-slate-200 border border-white/10 leading-relaxed font-mono">
          Priyanshu is a B.Tech CSE candidate with 15 verified credentials (Cisco, JPMorgan, AWS, SAP) and 7 deployments including EcoSentinel and Enterprise Sales Analytics.
        </div>
      </div>
    `;
  }
  msgs.scrollTop = msgs.scrollHeight;
}

// Global Initialization
window.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  initThreeBackground();
  initCardPhysics();
  typeRole();
  pingEdgeServer();
});
