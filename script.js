/* =========================================================
   PRIYANSHU KUMAR — PORTFOLIO V3 ENGINE
   Advanced UI / 3D / Animation / AI / Interaction
========================================================= */

(() => {
  "use strict";

  /* =========================================================
     CONFIG
  ========================================================= */

  const CONFIG = {
    particleCountDesktop: 150,
    particleCountMobile: 70,
    maxConnections: 2,
    mouseStrength: 0.035,
    cardTilt: 7,
    magneticStrength: 0.28,
    cursorEnabled: true,
    typingSpeed: 65,
    deletingSpeed: 35,
    pauseAfterTyping: 1500,
    pauseAfterDeleting: 500
  };

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isMobile = window.matchMedia &&
    window.matchMedia("(max-width: 768px)").matches;


  /* =========================================================
     SAFE HELPERS
  ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  const lerp = (a, b, t) =>
    a + (b - a) * t;


  /* =========================================================
     MICRO AUDIO / HAPTIC ENGINE
  ========================================================= */

  class MicroAudio {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (this.ctx) return;

      try {
        const AudioContext =
          window.AudioContext ||
          window.webkitAudioContext;

        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      } catch (error) {
        this.ctx = null;
      }
    }

    beep(frequency = 520, duration = 0.035, volume = 0.018) {
      if (!this.ctx) return;

      try {
        if (this.ctx.state === "suspended") {
          this.ctx.resume();
        }

        const oscillator = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          this.ctx.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(this.ctx.destination);

        oscillator.start();
        oscillator.stop(this.ctx.currentTime + duration);
      } catch (error) {}
    }
  }

  const audio = new MicroAudio();

  document.addEventListener(
    "pointerdown",
    () => audio.init(),
    { once: true, passive: true }
  );


  /* =========================================================
     THREE.JS — INTERACTIVE PARTICLE NETWORK
  ========================================================= */

  let scene = null;
  let camera = null;
  let renderer = null;
  let particleGroup = null;

  const particleObjects = [];

  const threeMouse = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  };

  function initThreeBackground() {
    const canvas = $("#three-bg");

    if (!canvas || !window.THREE || prefersReducedMotion) {
      return;
    }

    try {
      scene = new THREE.Scene();

      scene.fog = new THREE.FogExp2(
        0x030406,
        0.0018
      );

      camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      camera.position.z = 115;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobile,
        powerPreference: "high-performance"
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.7)
      );

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );

      particleGroup = new THREE.Group();

      scene.add(particleGroup);

      createParticleField();
      createAmbientGeometry();

      window.addEventListener(
        "resize",
        resizeThree,
        { passive: true }
      );

      window.addEventListener(
        "pointermove",
        handleThreePointer,
        { passive: true }
      );

      animateThree();

    } catch (error) {
      console.warn("Three.js initialization failed:", error);
    }
  }


  function createParticleField() {
    if (!particleGroup) return;

    const count = isMobile
      ? CONFIG.particleCountMobile
      : CONFIG.particleCountDesktop;

    const particleGeometry =
      new THREE.SphereGeometry(
        0.35,
        6,
        6
      );

    const particleMaterial =
      new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.72
      });

    const positions = [];

    for (let i = 0; i < count; i++) {

      const x =
        (Math.random() - 0.5) * 150;

      const y =
        (Math.random() - 0.5) * 85;

      const z =
        (Math.random() - 0.5) * 100;

      const particle =
        new THREE.Mesh(
          particleGeometry,
          particleMaterial.clone()
        );

      particle.position.set(x, y, z);

      particle.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        speed: 0.15 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        drift: 0.3 + Math.random() * 0.8
      };

      particleGroup.add(particle);
      particleObjects.push(particle);

      positions.push(x, y, z);
    }

    createConnectionLines(positions);
  }


  function createConnectionLines(positions) {
    if (!scene || !positions.length) return;

    const geometry =
      new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        positions,
        3
      )
    );

    const material =
      new THREE.PointsMaterial({
        color: 0xfb923c,
        size: isMobile ? 1.1 : 1.5,
        transparent: true,
        opacity: 0.5
      });

    const points =
      new THREE.Points(
        geometry,
        material
      );

    particleGroup.add(points);
  }


  function createAmbientGeometry() {
    if (!scene) return;

    const ringGeometry =
      new THREE.TorusGeometry(
        35,
        0.025,
        8,
        120
      );

    const ringMaterial =
      new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.09
      });

    const ring =
      new THREE.Mesh(
        ringGeometry,
        ringMaterial
      );

    ring.rotation.x = Math.PI * 0.35;
    ring.rotation.y = Math.PI * 0.18;

    scene.add(ring);

    const ring2 =
      new THREE.Mesh(
        ringGeometry.clone(),
        ringMaterial.clone()
      );

    ring2.rotation.x = -Math.PI * 0.25;
    ring2.rotation.z = Math.PI * 0.4;
    ring2.scale.setScalar(1.35);

    ring2.material.opacity = 0.045;

    scene.add(ring2);
  }


  function handleThreePointer(event) {
    threeMouse.targetX =
      (event.clientX / window.innerWidth) * 2 - 1;

    threeMouse.targetY =
      -(event.clientY / window.innerHeight) * 2 + 1;
  }


  function animateThree(time = 0) {
    if (!renderer || !scene || !camera) return;

    requestAnimationFrame(animateThree);

    const elapsed = time * 0.001;

    threeMouse.x =
      lerp(
        threeMouse.x,
        threeMouse.targetX,
        0.035
      );

    threeMouse.y =
      lerp(
        threeMouse.y,
        threeMouse.targetY,
        0.035
      );

    camera.position.x =
      lerp(
        camera.position.x,
        threeMouse.x * 5,
        0.02
      );

    camera.position.y =
      lerp(
        camera.position.y,
        threeMouse.y * 3,
        0.02
      );

    camera.lookAt(0, 0, 0);

    particleObjects.forEach((particle) => {

      const data = particle.userData;

      particle.position.x =
        data.baseX +
        Math.sin(elapsed * data.speed + data.phase) *
        data.drift;

      particle.position.y =
        data.baseY +
        Math.cos(elapsed * data.speed * 0.7 + data.phase) *
        data.drift;

      particle.position.z =
        data.baseZ +
        Math.sin(elapsed * 0.2 + data.phase) *
        0.8;
    });

    if (particleGroup) {
      particleGroup.rotation.y =
        elapsed * 0.012;

      particleGroup.rotation.x =
        Math.sin(elapsed * 0.15) * 0.025;
    }

    renderer.render(
      scene,
      camera
    );
  }


  function resizeThree() {
    if (!renderer || !camera) return;

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }


  /* =========================================================
     CURSOR GLOW
  ========================================================= */

  function initCursorGlow() {
    if (
      !CONFIG.cursorEnabled ||
      prefersReducedMotion ||
      isMobile
    ) {
      return;
    }

    const glow =
      document.createElement("div");

    glow.id = "cursorGlow";

    glow.style.cssText = `
      position:fixed;
      width:260px;
      height:260px;
      border-radius:50%;
      pointer-events:none;
      z-index:2;
      left:0;
      top:0;
      transform:translate3d(-50%,-50%,0);
      background:radial-gradient(
        circle,
        rgba(249,115,22,.12) 0%,
        rgba(249,115,22,.045) 28%,
        transparent 70%
      );
      filter:blur(10px);
      opacity:0;
      transition:opacity .25s ease;
      will-change:transform;
    `;

    document.body.appendChild(glow);

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener(
      "pointermove",
      (event) => {
        targetX = event.clientX;
        targetY = event.clientY;

        glow.style.opacity = "1";
      },
      { passive: true }
    );

    function animateCursor() {

      currentX =
        lerp(currentX, targetX, 0.16);

      currentY =
        lerp(currentY, targetY, 0.16);

      glow.style.transform =
        `translate3d(${currentX}px,${currentY}px,0) translate(-50%,-50%)`;

      requestAnimationFrame(animateCursor);
    }

    animateCursor();
  }


  /* =========================================================
     3D CARD TILT
  ========================================================= */

  function initCardTilt() {

    if (prefersReducedMotion) return;

    $$(".glass-card").forEach((card) => {

      card.addEventListener(
        "pointermove",
        (event) => {

          const rect =
            card.getBoundingClientRect();

          const x =
            event.clientX - rect.left;

          const y =
            event.clientY - rect.top;

          const rotateY =
            ((x / rect.width) - 0.5) *
            CONFIG.cardTilt;

          const rotateX =
            ((y / rect.height) - 0.5) *
            -CONFIG.cardTilt;

          card.style.setProperty(
            "--mouse-x",
            `${x}px`
          );

          card.style.setProperty(
            "--mouse-y",
            `${y}px`
          );

          card.style.transform =
            `perspective(1000px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-4px)`;
        },
        { passive: true }
      );

      card.addEventListener(
        "pointerleave",
        () => {

          card.style.transform =
            "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";

        },
        { passive: true }
      );
    });
  }


  /* =========================================================
     MAGNETIC BUTTONS
  ========================================================= */

  function initMagneticButtons() {

    if (
      prefersReducedMotion ||
      isMobile
    ) {
      return;
    }

    $$(".magnetic").forEach((button) => {

      button.addEventListener(
        "pointermove",
        (event) => {

          const rect =
            button.getBoundingClientRect();

          const x =
            event.clientX -
            (rect.left + rect.width / 2);

          const y =
            event.clientY -
            (rect.top + rect.height / 2);

          button.style.transform =
            `translate(${x * CONFIG.magneticStrength}px,
                        ${y * CONFIG.magneticStrength}px)
             translateY(-3px)`;
        },
        { passive: true }
      );

      button.addEventListener(
        "pointerleave",
        () => {
          button.style.transform = "";
        },
        { passive: true }
      );
    });
  }


  /* =========================================================
     TYPEWRITER ENGINE
  ========================================================= */

  function initTypewriter() {

    const element =
      $("#typewriter");

    if (!element) return;

    const roles = [
      "Software Engineer",
      "Data Analyst",
      "Full-Stack Developer",
      "Python Developer",
      "Machine Learning Engineer",
      "Problem Solver"
    ];

    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    function type() {

      const currentRole =
        roles[roleIndex];

      if (!deleting) {

        characterIndex++;

        element.textContent =
          currentRole.substring(
            0,
            characterIndex
          );

        if (
          characterIndex >=
          currentRole.length
        ) {

          deleting = true;

          setTimeout(
            type,
            CONFIG.pauseAfterTyping
          );

          return;
        }

        setTimeout(
          type,
          CONFIG.typingSpeed
        );

      } else {

        characterIndex--;

        element.textContent =
          currentRole.substring(
            0,
            characterIndex
          );

        if (characterIndex <= 0) {

          deleting = false;

          roleIndex =
            (roleIndex + 1) %
            roles.length;

          setTimeout(
            type,
            CONFIG.pauseAfterDeleting
          );

          return;
        }

        setTimeout(
          type,
          CONFIG.deletingSpeed
        );
      }
    }

    if (!prefersReducedMotion) {
      setTimeout(type, 700);
    }
  }


  /* =========================================================
     SCROLL REVEAL
  ========================================================= */

  function initScrollReveal() {

    if (prefersReducedMotion) return;

    const revealTargets = [
      "section",
      ".glass-card",
      "article",
      ".tech-chip",
      footer
    ];

    const elements = $$(
      revealTargets.join(",")
    );

    elements.forEach((element, index) => {

      if (
        element.id === "about" ||
        element.closest("#aiChat") ||
        element.closest("#projectModal") ||
        element.closest("#spotlight")
      ) {
        return;
      }

      element.classList.add("reveal-ready");

      element.style.transitionDelay =
        `${Math.min((index % 5) * 55, 220)}ms`;
    });

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "reveal-visible"
              );

              observer.unobserve(
                entry.target
              );
            }
          });

        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -50px 0px"
        }
      );

    elements.forEach((element) => {

      if (
        !element.classList.contains(
          "reveal-ready"
        )
      ) {
        return;
      }

      observer.observe(element);
    });
  }


  /* =========================================================
     ANIMATED COUNTERS
  ========================================================= */

  function initCounters() {

    const counters =
      $$("[data-counter]");

    if (!counters.length) return;

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            const element =
              entry.target;

            const target =
              parseFloat(
                element.dataset.counter
              );

            const suffix =
              element.dataset.suffix || "";

            const decimals =
              element.dataset.decimals
                ? parseInt(
                    element.dataset.decimals,
                    10
                  )
                : 0;

            let start = 0;

            const duration = 1400;
            const startTime =
              performance.now();

            function update(currentTime) {

              const progress =
                clamp(
                  (currentTime - startTime) /
                  duration,
                  0,
                  1
                );

              const eased =
                1 -
                Math.pow(
                  1 - progress,
                  3
                );

              const value =
                start +
                (target - start) *
                eased;

              element.textContent =
                value.toFixed(decimals) +
                suffix;

              if (progress < 1) {
                requestAnimationFrame(update);
              }
            }

            requestAnimationFrame(update);

            observer.unobserve(element);
          });

        },
        {
          threshold: 0.5
        }
      );

    counters.forEach((counter) =>
      observer.observe(counter)
    );
  }


  /* =========================================================
     SCROLL PROGRESS BAR
  ========================================================= */

  function initScrollProgress() {

    const bar =
      document.createElement("div");

    bar.id = "scrollProgress";

    bar.style.cssText = `
      position:fixed;
      top:0;
      left:0;
      width:0%;
      height:2px;
      z-index:9999;
      background:linear-gradient(
        90deg,
        #f97316,
        #facc15,
        #fb923c
      );
      box-shadow:0 0 12px rgba(249,115,22,.7);
      pointer-events:none;
    `;

    document.body.appendChild(bar);

    let ticking = false;

    function update() {

      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {

        const scrollTop =
          window.scrollY;

        const maxScroll =
          document.documentElement.scrollHeight -
          window.innerHeight;

        const progress =
          maxScroll > 0
            ? (scrollTop / maxScroll) * 100
            : 0;

        bar.style.width =
          `${progress}%`;

        ticking = false;
      });
    }

    window.addEventListener(
      "scroll",
      update,
      { passive: true }
    );

    update();
  }


  /* =========================================================
     ACTIVE NAVIGATION
  ========================================================= */

  function initActiveNavigation() {

    const sections =
      $$("main section[id]");

    const links =
      $$('header nav a[href^="#"]');

    if (!sections.length || !links.length) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            const id =
              entry.target.id;

            links.forEach((link) => {

              const active =
                link.getAttribute("href") ===
                `#${id}`;

              link.classList.toggle(
                "text-orange-400",
                active
              );

              link.classList.toggle(
                "bg-white/5",
                active
              );
            });

          });

        },
        {
          threshold: 0.25,
          rootMargin: "-20% 0px -60% 0px"
        }
      );

    sections.forEach((section) =>
      observer.observe(section)
    );
  }


  /* =========================================================
     EDGE SERVER STATUS
  ========================================================= */

  async function pingEdgeServer() {

    const status =
      document.querySelector(
        ".text-emerald-400.font-bold"
      );

    if (!status) return;

    try {

      const start =
        performance.now();

      const response =
        await fetch(
          `./index.html?ping=${Date.now()}`,
          {
            method: "HEAD",
            cache: "no-store"
          }
        );

      const latency =
        Math.round(
          performance.now() - start
        );

      if (response.ok) {
        status.textContent =
          `${latency}ms`;
      }

    } catch (error) {
      status.textContent =
        "Online";
    }
  }


  /* =========================================================
     AI CHAT ENGINE
  ========================================================= */

  const assistantKnowledge = {

    name: "Priyanshu Kumar",

    roles: [
      "Software Engineer",
      "Data Analyst",
      "Full-Stack Developer",
      "Python Developer",
      "Machine Learning Engineer"
    ],

    education:
      "B.Tech in Computer Science and Engineering from Shershah Engineering College, Sasaram, Bihar Engineering University, Patna (2022–2026).",

    skills: [
      "Python",
      "Java",
      "C",
      "C++",
      "JavaScript",
      "SQL",
      "React",
      "Node.js",
      "Express.js",
      "REST APIs",
      "MongoDB",
      "Git",
      "GitHub",
      "Power BI",
      "Tableau",
      "Excel",
      "TensorFlow",
      "Keras",
      "CNN",
      "OpenCV"
    ],

    projects: [
      "EcoSentinel",
      "Brain Tumor Detection",
      "Enterprise Sales Analytics",
      "Kisan Mitra",
      "AgroSmart AI",
      "Cricket Score Predictor"
    ],

    github:
      "github.com/priyanshu18611",

    linkedin:
      "linkedin.com/in/priyanshuroy18",

    email:
      "priyanshu6202018611@gmail.com"
  };


  function getAIResponse(message) {

    const text =
      message
        .toLowerCase()
        .trim();

    if (!text) {
      return "Please type a question and I'll help you.";
    }

    if (
      text.includes("who are you") ||
      text.includes("about priyanshu") ||
      text.includes("priyanshu")
    ) {
      return `
        Priyanshu Kumar is a B.Tech Computer Science graduate
        focused on Software Engineering, Full-Stack Development,
        Data Analytics and Machine Learning.
      `;
    }

    if (
      text.includes("skill") ||
      text.includes("technology") ||
      text.includes("tech stack")
    ) {
      return `
        Priyanshu's core stack includes Python, Java, C/C++,
        JavaScript, SQL, React, Node.js, Express.js, MongoDB,
        REST APIs, Git, Power BI, Tableau, Excel, TensorFlow,
        Keras and OpenCV.
      `;
    }

    if (
      text.includes("project") ||
      text.includes("projects")
    ) {
      return `
        Featured projects include EcoSentinel, Brain Tumor
        Detection, Enterprise Sales Analytics, Kisan Mitra,
        AgroSmart AI and Cricket Score Predictor.
      `;
    }

    if (
      text.includes("education") ||
      text.includes("college") ||
      text.includes("degree")
    ) {
      return `
        Priyanshu is pursuing/completing B.Tech in Computer
        Science & Engineering at Shershah Engineering College,
        Sasaram, affiliated with Bihar Engineering University,
        Patna. The program is 2022–2026.
      `;
    }

    if (
      text.includes("github") ||
      text.includes("code")
    ) {
      return `
        You can explore Priyanshu's repositories through the
        GitHub button on this portfolio.
      `;
    }

    if (
      text.includes("linkedin") ||
      text.includes("contact") ||
      text.includes("email")
    ) {
      return `
        You can connect with Priyanshu through LinkedIn or
        email using the Contact section of this portfolio.
      `;
    }

    if (
      text.includes("hire") ||
      text.includes("job") ||
      text.includes("opportunity")
    ) {
      return `
        Priyanshu is focused on entry-level opportunities in
        Software Engineering, Full-Stack Development, Data
        Analytics, Python Development and Machine Learning.
      `;
    }

    if (
      text.includes("python")
    ) {
      return `
        Python is one of Priyanshu's primary technologies and
        is used across machine learning, data analytics and
        development projects.
      `;
    }

    if (
      text.includes("data analyst") ||
      text.includes("analytics") ||
      text.includes("power bi") ||
      text.includes("tableau")
    ) {
      return `
        Priyanshu's Data Analytics stack includes SQL, Excel,
        Power BI, Tableau, data exploration, dashboards and
        business-focused insights.
      `;
    }

    if (
      text.includes("full stack") ||
      text.includes("react") ||
      text.includes("node")
    ) {
      return `
        His full-stack toolkit includes React, Node.js,
        Express.js, REST APIs, MongoDB, JWT, Git and GitHub.
      `;
    }

    if (
      text.includes("machine learning") ||
      text.includes("ml") ||
      text.includes("ai")
    ) {
      return `
        His AI/ML experience includes Python, TensorFlow,
        Keras, CNN, OpenCV and machine-learning workflows.
      `;
    }

    if (
      text.includes("hello") ||
      text.includes("hi") ||
      text.includes("hey")
    ) {
      return `
        Hi! 👋 I'm Priyanshu's portfolio assistant.
        Ask me about his skills, projects, education,
        technologies or career focus.
      `;
    }

    if (
      text.includes("thank")
    ) {
      return `
        You're welcome! 🚀
      `;
    }

    return `
      I can help you explore Priyanshu's portfolio.
      Try asking about his skills, projects, education,
      Software Engineering, Data Analytics, Full-Stack
      Development, Python, Machine Learning or contact details.
    `;
  }


  function openChat() {

    const chat =
      $("#aiChat");

    if (!chat) return;

    chat.classList.remove("hidden");

    document.body.classList.add(
      "chat-open"
    );

    setTimeout(() => {

      $("#chatInput")?.focus();

      const messages =
        $("#chatMessages");

      if (messages) {
        messages.scrollTop =
          messages.scrollHeight;
      }

    }, 120);

    audio.beep(650, 0.045, 0.018);
  }


  function closeChat() {

    const chat =
      $("#aiChat");

    if (!chat) return;

    chat.classList.add("hidden");

    document.body.classList.remove(
      "chat-open"
    );
  }


  function addChatMessage(
    message,
    type = "bot"
  ) {

    const container =
      $("#chatMessages");

    if (!container) return;

    const wrapper =
      document.createElement("div");

    wrapper.className =
      type === "user"
        ? "flex justify-end"
        : "flex justify-start";

    const bubble =
      document.createElement("div");

    bubble.className =
      type === "user"
        ? "max-w-[88%] p-3 rounded-2xl bg-orange-500 text-black text-xs leading-6"
        : "max-w-[88%] p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-6";

    bubble.textContent =
      message;

    wrapper.appendChild(bubble);
    container.appendChild(wrapper);

    container.scrollTop =
      container.scrollHeight;
  }


  function showTypingIndicator() {

    const container =
      $("#chatMessages");

    if (!container) return null;

    const wrapper =
      document.createElement("div");

    wrapper.id =
      "typingIndicator";

    wrapper.className =
      "flex justify-start";

    wrapper.innerHTML = `
      <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-500">
        <span class="inline-flex gap-1">
          <span class="animate-pulse">●</span>
          <span class="animate-pulse" style="animation-delay:.15s">●</span>
          <span class="animate-pulse" style="animation-delay:.3s">●</span>
        </span>
      </div>
    `;

    container.appendChild(wrapper);

    container.scrollTop =
      container.scrollHeight;

    return wrapper;
  }


  function handleChatSubmit(event) {

    event.preventDefault();

    const input =
      $("#chatInput");

    if (!input) return;

    const message =
      input.value.trim();

    if (!message) return;

    addChatMessage(
      message,
      "user"
    );

    input.value = "";

    const typing =
      showTypingIndicator();

    setTimeout(() => {

      typing?.remove();

      const response =
        getAIResponse(message);

      addChatMessage(
        response,
        "bot"
      );

      audio.beep(
        520,
        0.035,
        0.012
      );

    }, 450);
  }


  /* =========================================================
     GLOBAL FUNCTIONS
     Required by inline HTML onclick handlers
  ========================================================= */

  window.openChat =
    openChat;

  window.closeChat =
    closeChat;

  window.handleChatSubmit =
    handleChatSubmit;


  /* =========================================================
     KEYBOARD SHORTCUTS
  ========================================================= */

  function initKeyboardControls() {

    document.addEventListener(
      "keydown",
      (event) => {

        if (
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === "k"
        ) {

          event.preventDefault();

          if (
            typeof window.toggleSpotlight ===
            "function"
          ) {
            window.toggleSpotlight();
          }
        }

        if (
          event.key === "Escape"
        ) {

          const chat =
            $("#aiChat");

          if (
            chat &&
            !chat.classList.contains("hidden")
          ) {
            closeChat();
          }

        }
      }
    );
  }


  /* =========================================================
     BUTTON SOUND
  ========================================================= */

  function initButtonSounds() {

    $$(
      "button, .magnetic, header a"
    ).forEach((element) => {

      element.addEventListener(
        "click",
        () => {

          audio.init();

          audio.beep(
            560,
            0.025,
            0.009
          );

        },
        { passive: true }
      );
    });
  }


  /* =========================================================
     IMAGE PARALLAX
  ========================================================= */

  function initImageParallax() {

    if (
      prefersReducedMotion ||
      isMobile
    ) {
      return;
    }

    const images =
      $$("img");

    images.forEach((image) => {

      const parent =
        image.closest(
          ".relative"
        );

      if (!parent) return;

      parent.addEventListener(
        "pointermove",
        (event) => {

          const rect =
            parent.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
            rect.width -
            0.5;

          const y =
            (event.clientY - rect.top) /
            rect.height -
            0.5;

          image.style.transform =
            `scale(1.025)
             translate(${x * 5}px,${y * 5}px)`;

        },
        { passive: true }
      );

      parent.addEventListener(
        "pointerleave",
        () => {

          image.style.transform =
            "";

        },
        { passive: true }
      );

      image.style.transition =
        "transform .45s cubic-bezier(.16,1,.3,1)";
    });
  }


  /* =========================================================
     SMOOTH ANCHOR NAVIGATION
  ========================================================= */

  function initSmoothAnchors() {

    $$('a[href^="#"]').forEach(
      (link) => {

        link.addEventListener(
          "click",
          (event) => {

            const id =
              link.getAttribute(
                "href"
              );

            if (
              !id ||
              id === "#"
            ) {
              return;
            }

            const target =
              $(id);

            if (!target) return;

            event.preventDefault();

            const headerOffset =
              window.innerWidth < 640
                ? 85
                : 100;

            const targetPosition =
              target.getBoundingClientRect().top +
              window.scrollY -
              headerOffset;

            window.scrollTo({
              top: targetPosition,
              behavior:
                prefersReducedMotion
                  ? "auto"
                  : "smooth"
            });

          }
        );
      }
    );
  }


  /* =========================================================
     HOVER GLOW FOR TECH CHIPS
  ========================================================= */

  function initChipEffects() {

    if (prefersReducedMotion) return;

    $$(".tech-chip").forEach(
      (chip) => {

        chip.addEventListener(
          "pointerenter",
          () => {

            chip.style.transform =
              "translateY(-2px)";

            chip.style.boxShadow =
              "0 0 18px rgba(249,115,22,.08)";

          },
          { passive: true }
        );

        chip.addEventListener(
          "pointerleave",
          () => {

            chip.style.transform =
              "";

            chip.style.boxShadow =
              "";

          },
          { passive: true }
        );
      }
    );
  }


  /* =========================================================
     DYNAMIC YEAR
  ========================================================= */

  function initYear() {

    const currentYear =
      new Date().getFullYear();

    $$("footer").forEach(
      (footer) => {

        const yearElements =
          footer.querySelectorAll(
            "*"
          );

        yearElements.forEach(
          (element) => {

            if (
              element.childNodes.length === 1 &&
              element.textContent.includes(
                "© 2026"
              )
            ) {
              element.textContent =
                element.textContent.replace(
                  "2026",
                  currentYear
                );
            }
          }
        );
      }
    );
  }


  /* =========================================================
     PERFORMANCE — PAUSE HEAVY EFFECTS WHEN TAB HIDDEN
  ========================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.hidden &&
        renderer
      ) {
        renderer.setAnimationLoop?.(
          null
        );
      }

    }
  );


  /* =========================================================
     ADD REQUIRED CSS DYNAMICALLY
  ========================================================= */

  function injectEngineStyles() {

    if ($("#portfolioEngineStyles")) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "portfolioEngineStyles";

    style.textContent = `

      .reveal-ready {
        opacity:0;
        transform:
          translateY(28px)
          scale(.985);
        transition:
          opacity .75s cubic-bezier(.16,1,.3,1),
          transform .75s cubic-bezier(.16,1,.3,1);
        will-change:opacity,transform;
      }

      .reveal-visible {
        opacity:1 !important;
        transform:
          translateY(0)
          scale(1) !important;
      }

      .glass-card {
        transition:
          transform .35s cubic-bezier(.16,1,.3,1),
          border-color .3s ease,
          box-shadow .3s ease;
      }

      .glass-card:hover {
        border-color:
          rgba(249,115,22,.18);
        box-shadow:
          0 25px 80px rgba(0,0,0,.22);
      }

      .tech-chip {
        will-change:transform;
      }

      #aiChat {
        animation:
          portfolioChatIn .35s
          cubic-bezier(.16,1,.3,1);
      }

      @keyframes portfolioChatIn {
        from {
          opacity:0;
          transform:
            translateY(20px)
            scale(.96);
        }

        to {
          opacity:1;
          transform:
            translateY(0)
            scale(1);
        }
      }

      #spotlight:not(.hidden),
      #projectModal:not(.hidden) {
        animation:
          portfolioOverlayIn .3s
          ease-out;
      }

      @keyframes portfolioOverlayIn {
        from {
          opacity:0;
        }

        to {
          opacity:1;
        }
      }

      #suiteMenu:not(.hidden) {
        animation:
          portfolioMenuIn .25s
          cubic-bezier(.16,1,.3,1);
          transform-origin:top right;
      }

      @keyframes portfolioMenuIn {
        from {
          opacity:0;
          transform:
            translateY(-8px)
            scale(.96);
        }

        to {
          opacity:1;
          transform:
            translateY(0)
            scale(1);
        }
      }

      @media(max-width:768px) {

        .reveal-ready {
          transform:
            translateY(18px);
        }

        #cursorGlow {
          display:none !important;
        }

      }

      @media(prefers-reduced-motion:reduce) {

        .reveal-ready {
          opacity:1 !important;
          transform:none !important;
          transition:none !important;
        }

      }

    `;

    document.head.appendChild(style);
  }


  /* =========================================================
     INITIALIZATION
  ========================================================= */

  function initPortfolioEngine() {

    injectEngineStyles();

    initThreeBackground();

    initCursorGlow();

    initCardTilt();

    initMagneticButtons();

    initTypewriter();

    initScrollReveal();

    initCounters();

    initScrollProgress();

    initActiveNavigation();

    initKeyboardControls();

    initButtonSounds();

    initImageParallax();

    initSmoothAnchors();

    initChipEffects();

    initYear();

    setTimeout(
      pingEdgeServer,
      1200
    );

    if (window.lucide) {
      try {
        lucide.createIcons();
      } catch (error) {}
    }

    console.log(
      "%c PRIYANSHU KUMAR ",
      "background:#f97316;color:#000;font-weight:900;padding:6px 10px;border-radius:6px;"
    );

    console.log(
      "%c Portfolio Engine V3 initialized 🚀 ",
      "color:#fb923c;font-weight:bold;"
    );
  }


  /* =========================================================
     DOM READY
  ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initPortfolioEngine,
      { once: true }
    );

  } else {

    initPortfolioEngine();

  }

})();
