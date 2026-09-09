/* =========================================================
   PRIYANSHU KUMAR — PORTFOLIO V3 INTERACTION ENGINE
   Advanced UI • Three.js • Magnetic UI • Tilt • Reveal
   Typewriter • Counters • AI Assistant • Performance
========================================================= */

(() => {
  "use strict";

  /* =========================================================
     GLOBAL STATE
  ========================================================= */

  const state = {
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0,
    scrollY: 0,
    reducedMotion: window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  };

  /* =========================================================
     HELPERS
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
     WEB AUDIO MICRO-HAPTIC ENGINE
  ========================================================= */

  class MicroHaptics {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (this.ctx) return;

      try {
        this.ctx = new (
          window.AudioContext ||
          window.webkitAudioContext
        )();
      } catch {
        this.ctx = null;
      }
    }

    click(frequency = 620, duration = 0.035) {
      if (!this.ctx) return;

      try {
        const oscillator = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.025,
          this.ctx.currentTime + 0.008
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          this.ctx.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(this.ctx.destination);

        oscillator.start();
        oscillator.stop(this.ctx.currentTime + duration);
      } catch {}
    }
  }

  const audio = new MicroHaptics();

  document.addEventListener(
    "pointerdown",
    () => audio.init(),
    { once: true, passive: true }
  );

  /* =========================================================
     CURSOR GLOW
  ========================================================= */

  function createCursorGlow() {
    if (state.reducedMotion) return;

    if (window.matchMedia("(pointer: coarse)").matches) return;

    let glow = $(".cursor-glow");

    if (!glow) {
      glow = document.createElement("div");
      glow.className = "cursor-glow";

      Object.assign(glow.style, {
        position: "fixed",
        width: "320px",
        height: "320px",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: "1",
        left: "0",
        top: "0",
        opacity: "0",
        transform: "translate3d(-50%, -50%, 0)",
        background:
          "radial-gradient(circle, rgba(255,150,40,.10) 0%, rgba(255,150,40,.04) 30%, transparent 70%)",
        filter: "blur(4px)",
        transition: "opacity .25s ease"
      });

      document.body.appendChild(glow);
    }

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    let targetX = x;
    let targetY = y;

    window.addEventListener(
      "pointermove",
      event => {
        targetX = event.clientX;
        targetY = event.clientY;
        glow.style.opacity = "1";
      },
      { passive: true }
    );

    window.addEventListener(
      "pointerleave",
      () => {
        glow.style.opacity = "0";
      }
    );

    function animate() {
      x = lerp(x, targetX, 0.12);
      y = lerp(y, targetY, 0.12);

      glow.style.transform =
        `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* =========================================================
     THREE.JS PARTICLE NETWORK
  ========================================================= */

  function initThreeBackground() {
    const container = $("#three-bg");

    if (!container) return;

    if (
      typeof THREE === "undefined" ||
      state.reducedMotion
    ) {
      return;
    }

    try {
      container.innerHTML = "";

      const scene = new THREE.Scene();

      scene.fog = new THREE.FogExp2(
        0x050505,
        0.0015
      );

      const camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );

      camera.position.z = 520;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 1.6)
      );

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );

      renderer.setClearColor(0x000000, 0);

      container.appendChild(renderer.domElement);

      /* ---------- PARTICLES ---------- */

      const isMobile =
        window.innerWidth < 768;

      const particleCount = isMobile ? 75 : 145;

      const positions = new Float32Array(
        particleCount * 3
      );

      const velocities = [];

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        positions[i3] =
          (Math.random() - 0.5) * 1000;

        positions[i3 + 1] =
          (Math.random() - 0.5) * 700;

        positions[i3 + 2] =
          (Math.random() - 0.5) * 800;

        velocities.push({
          x: (Math.random() - 0.5) * 0.18,
          y: (Math.random() - 0.5) * 0.18,
          z: (Math.random() - 0.5) * 0.08
        });
      }

      const particleGeometry =
        new THREE.BufferGeometry();

      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
          positions,
          3
        )
      );

      const particleMaterial =
        new THREE.PointsMaterial({
          color: 0xffa340,
          size: isMobile ? 2.0 : 2.6,
          transparent: true,
          opacity: 0.75,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });

      const particles =
        new THREE.Points(
          particleGeometry,
          particleMaterial
        );

      scene.add(particles);

      /* ---------- CONNECTION LINES ---------- */

      const maxDistance = isMobile ? 135 : 155;
      const linePositions = [];

      for (let i = 0; i < particleCount; i++) {
        for (
          let j = i + 1;
          j < particleCount;
          j++
        ) {
          const ix = i * 3;
          const jx = j * 3;

          const dx =
            positions[ix] -
            positions[jx];

          const dy =
            positions[ix + 1] -
            positions[jx + 1];

          const dz =
            positions[ix + 2] -
            positions[jx + 2];

          const distance = Math.sqrt(
            dx * dx +
            dy * dy +
            dz * dz
          );

          if (distance < maxDistance) {
            linePositions.push(
              positions[ix],
              positions[ix + 1],
              positions[ix + 2],
              positions[jx],
              positions[jx + 1],
              positions[jx + 2]
            );
          }
        }
      }

      const lineGeometry =
        new THREE.BufferGeometry();

      lineGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
          linePositions,
          3
        )
      );

      const lineMaterial =
        new THREE.LineBasicMaterial({
          color: 0xff8c32,
          transparent: true,
          opacity: isMobile ? 0.08 : 0.12,
          blending: THREE.AdditiveBlending
        });

      const lines =
        new THREE.LineSegments(
          lineGeometry,
          lineMaterial
        );

      scene.add(lines);

      /* ---------- MOUSE ENVIRONMENT ---------- */

      let mouseX = 0;
      let mouseY = 0;

      window.addEventListener(
        "pointermove",
        event => {
          mouseX =
            (event.clientX /
              window.innerWidth -
              0.5) * 2;

          mouseY =
            (event.clientY /
              window.innerHeight -
              0.5) * 2;
        },
        { passive: true }
      );

      let smoothX = 0;
      let smoothY = 0;

      /* ---------- ANIMATION ---------- */

      let animationFrame;

      function animate() {
        animationFrame =
          requestAnimationFrame(animate);

        smoothX = lerp(
          smoothX,
          mouseX,
          0.035
        );

        smoothY = lerp(
          smoothY,
          mouseY,
          0.035
        );

        camera.position.x =
          smoothX * 22;

        camera.position.y =
          -smoothY * 15;

        camera.lookAt(
          scene.position
        );

        particles.rotation.y += 0.00055;
        particles.rotation.x += 0.00018;

        lines.rotation.y =
          particles.rotation.y;

        lines.rotation.x =
          particles.rotation.x;

        const positionAttribute =
          particleGeometry.attributes.position;

        for (
          let i = 0;
          i < particleCount;
          i++
        ) {
          const i3 = i * 3;
          const velocity =
            velocities[i];

          positionAttribute.array[i3] +=
            velocity.x;

          positionAttribute.array[i3 + 1] +=
            velocity.y;

          positionAttribute.array[i3 + 2] +=
            velocity.z;

          if (
            Math.abs(
              positionAttribute.array[i3]
            ) > 550
          ) {
            velocity.x *= -1;
          }

          if (
            Math.abs(
              positionAttribute.array[i3 + 1]
            ) > 390
          ) {
            velocity.y *= -1;
          }

          if (
            Math.abs(
              positionAttribute.array[i3 + 2]
            ) > 430
          ) {
            velocity.z *= -1;
          }
        }

        positionAttribute.needsUpdate = true;

        renderer.render(
          scene,
          camera
        );
      }

      animate();

      window.addEventListener(
        "resize",
        () => {
          camera.aspect =
            window.innerWidth /
            window.innerHeight;

          camera.updateProjectionMatrix();

          renderer.setSize(
            window.innerWidth,
            window.innerHeight
          );

          renderer.setPixelRatio(
            Math.min(
              window.devicePixelRatio || 1,
              1.6
            )
          );
        },
        { passive: true }
      );

      window.addEventListener(
        "beforeunload",
        () => {
          cancelAnimationFrame(
            animationFrame
          );

          particleGeometry.dispose();
          particleMaterial.dispose();
          lineGeometry.dispose();
          lineMaterial.dispose();
          renderer.dispose();
        }
      );
    } catch (error) {
      console.warn(
        "Three.js initialization failed:",
        error
      );
    }
  }

  /* =========================================================
     3D CARD TILT
  ========================================================= */

  function initCardTilt() {
    if (state.reducedMotion) return;

    if (
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    $$(".glass-card").forEach(card => {
      let frame;

      card.addEventListener(
        "pointermove",
        event => {
          const rect =
            card.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
            rect.width;

          const y =
            (event.clientY - rect.top) /
            rect.height;

          const rotateY =
            (x - 0.5) * 8;

          const rotateX =
            (0.5 - y) * 8;

          cancelAnimationFrame(frame);

          frame = requestAnimationFrame(() => {
            card.style.transform =
              `perspective(1000px)
               rotateX(${rotateX}deg)
               rotateY(${rotateY}deg)
               translateY(-4px)`;
          });
        },
        { passive: true }
      );

      card.addEventListener(
        "pointerleave",
        () => {
          cancelAnimationFrame(frame);

          card.style.transform =
            "";
        }
      );
    });
  }

  /* =========================================================
     MAGNETIC BUTTONS
  ========================================================= */

  function initMagneticButtons() {
    if (state.reducedMotion) return;

    if (
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const selectors = [
      ".magnetic",
      ".btn-primary",
      ".btn-secondary",
      "nav a",
      "button"
    ];

    $$(selectors.join(",")).forEach(element => {
      if (
        element.dataset.magneticInitialized
      ) {
        return;
      }

      element.dataset.magneticInitialized =
        "true";

      element.addEventListener(
        "pointermove",
        event => {
          const rect =
            element.getBoundingClientRect();

          const x =
            event.clientX -
            (rect.left + rect.width / 2);

          const y =
            event.clientY -
            (rect.top + rect.height / 2);

          const strength = 0.16;

          element.style.transform =
            `translate(${x * strength}px,
                       ${y * strength}px)`;
        },
        { passive: true }
      );

      element.addEventListener(
        "pointerleave",
        () => {
          element.style.transform = "";
        }
      );

      element.addEventListener(
        "click",
        () => {
          audio.click();
        }
      );
    });
  }

  /* =========================================================
     TYPEWRITER ENGINE
  ========================================================= */

  function initTypewriter() {
    const element = $("#typewriter");

    if (!element) return;

    const roles = [
      "Software Engineer",
      "Data Analyst & BI Specialist",
      "Full-Stack Developer",
      "Machine Learning Engineer"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
      const currentRole =
        roles[roleIndex];

      if (!deleting) {
        charIndex++;

        element.textContent =
          currentRole.substring(
            0,
            charIndex
          );

        if (
          charIndex ===
          currentRole.length
        ) {
          deleting = true;

          setTimeout(
            type,
            1500
          );

          return;
        }
      } else {
        charIndex--;

        element.textContent =
          currentRole.substring(
            0,
            charIndex
          );

        if (charIndex === 0) {
          deleting = false;

          roleIndex =
            (roleIndex + 1) %
            roles.length;
        }
      }

      setTimeout(
        type,
        deleting ? 42 : 78
      );
    }

    type();
  }

  /* =========================================================
     SCROLL REVEAL
  ========================================================= */

  function initScrollReveal() {
    const elements = $$(
      ".reveal, .glass-card, section > div"
    );

    if (!elements.length) return;

    if (state.reducedMotion) {
      elements.forEach(
        element =>
          element.classList.add(
            "is-visible"
          )
      );

      return;
    }

    const observer =
      new IntersectionObserver(
        entries => {
          entries.forEach(
            entry => {
              if (
                entry.isIntersecting
              ) {
                entry.target.classList.add(
                  "is-visible"
                );

                observer.unobserve(
                  entry.target
                );
              }
            }
          );
        },
        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -50px 0px"
        }
      );

    elements.forEach(
      element => {
        element.classList.add(
          "reveal"
        );

        observer.observe(
          element
        );
      }
    );
  }

  /* =========================================================
     ANIMATED COUNTERS
  ========================================================= */

  function initCounters() {
    const counters = $$(
      "[data-count]"
    );

    if (!counters.length) return;

    const observer =
      new IntersectionObserver(
        entries => {
          entries.forEach(
            entry => {
              if (
                !entry.isIntersecting
              ) {
                return;
              }

              const element =
                entry.target;

              const target =
                parseFloat(
                  element.dataset.count
                );

              if (
                Number.isNaN(target)
              ) {
                return;
              }

              const duration = 1400;
              const start =
                performance.now();

              function update(
                timestamp
              ) {
                const progress =
                  Math.min(
                    (timestamp -
                      start) /
                      duration,
                    1
                  );

                const eased =
                  1 -
                  Math.pow(
                    1 - progress,
                    3
                  );

                const value =
                  target * eased;

                if (
                  Number.isInteger(
                    target
                  )
                ) {
                  element.textContent =
                    Math.floor(
                      value
                    );
                } else {
                  element.textContent =
                    value.toFixed(1);
                }

                if (
                  progress < 1
                ) {
                  requestAnimationFrame(
                    update
                  );
                } else {
                  element.textContent =
                    Number.isInteger(
                      target
                    )
                      ? target
                      : target.toFixed(
                          1
                        );
                }
              }

              requestAnimationFrame(
                update
              );

              observer.unobserve(
                element
              );
            }
          );
        },
        {
          threshold: 0.6
        }
      );

    counters.forEach(
      counter =>
        observer.observe(counter)
    );
  }

  /* =========================================================
     SCROLL PROGRESS BAR
  ========================================================= */

  function initScrollProgress() {
    let bar =
      $(".scroll-progress");

    if (!bar) {
      bar = document.createElement(
        "div"
      );

      bar.className =
        "scroll-progress";

      Object.assign(
        bar.style,
        {
          position: "fixed",
          top: "0",
          left: "0",
          height: "2px",
          width: "0%",
          zIndex: "99999",
          background:
            "linear-gradient(90deg,#ff8a00,#ffd166)",
          boxShadow:
            "0 0 15px rgba(255,145,40,.8)",
          pointerEvents: "none"
        }
      );

      document.body.appendChild(
        bar
      );
    }

    let ticking = false;

    function update() {
      const scrollTop =
        window.scrollY;

      const documentHeight =
        document.documentElement
          .scrollHeight -
        window.innerHeight;

      const progress =
        documentHeight > 0
          ? (scrollTop /
              documentHeight) *
            100
          : 0;

      bar.style.width =
        `${progress}%`;

      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(
            update
          );

          ticking = true;
        }
      },
      { passive: true }
    );

    update();
  }

  /* =========================================================
     NAVBAR SCROLL EFFECT
  ========================================================= */

  function initNavbar() {
    const nav =
      $("nav");

    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener(
      "scroll",
      () => {
        const current =
          window.scrollY;

        if (
          current > 40
        ) {
          nav.classList.add(
            "nav-scrolled"
          );

          nav.style.backdropFilter =
            "blur(22px)";
        } else {
          nav.classList.remove(
            "nav-scrolled"
          );

          nav.style.backdropFilter =
            "";
        }

        if (
          current > lastScroll &&
          current > 180
        ) {
          nav.classList.add(
            "nav-hidden"
          );
        } else {
          nav.classList.remove(
            "nav-hidden"
          );
        }

        lastScroll = current;
      },
      { passive: true }
    );
  }

  /* =========================================================
     ACTIVE SECTION NAVIGATION
  ========================================================= */

  function initActiveNavigation() {
    const sections =
      $$("section[id]");

    const links =
      $$('nav a[href^="#"]');

    if (
      !sections.length ||
      !links.length
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(
        entries => {
          entries.forEach(
            entry => {
              if (
                !entry.isIntersecting
              ) {
                return;
              }

              const id =
                entry.target.id;

              links.forEach(
                link => {
                  link.classList.toggle(
                    "active",
                    link.getAttribute(
                      "href"
                    ) ===
                      `#${id}`
                  );
                }
              );
            }
          );
        },
        {
          rootMargin:
            "-35% 0px -55% 0px"
        }
      );

    sections.forEach(
      section =>
        observer.observe(
          section
        )
    );
  }

  /* =========================================================
     SMOOTH ANCHOR SCROLL
  ========================================================= */

  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(
      link => {
        link.addEventListener(
          "click",
          event => {
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
              document.querySelector(
                id
              );

            if (!target) {
              return;
            }

            event.preventDefault();

            const offset = 80;

            const top =
              target.getBoundingClientRect()
                .top +
              window.scrollY -
              offset;

            window.scrollTo({
              top,
              behavior:
                "smooth"
            });
          }
        );
      }
    );
  }

  /* =========================================================
     EDGE LATENCY / API STATUS
  ========================================================= */

  async function pingEdgeServer() {
    const statusElements =
      $$(".text-emerald-400.font-bold");

    if (!statusElements.length) {
      return;
    }

    try {
      const start =
        performance.now();

      await fetch(
        window.location.pathname,
        {
          method: "HEAD",
          cache: "no-store"
        }
      );

      const latency =
        Math.round(
          performance.now() -
            start
        );

      statusElements.forEach(
        element => {
          if (
            element.textContent
              .trim()
              .toLowerCase()
              .includes("online")
          ) {
            element.textContent =
              `${latency}ms`;
          }
        }
      );
    } catch {
      /* Keep existing UI state */
    }
  }

  /* =========================================================
     AI CHAT
  ========================================================= */

  window.openChat = function () {
    const chat =
      $("#aiChat");

    if (!chat) return;

    chat.classList.add(
      "active",
      "open"
    );

    chat.style.display =
      "flex";

    const input =
      $("#chatInput");

    if (input) {
      setTimeout(
        () => input.focus(),
        150
      );
    }
  };

  window.closeChat = function () {
    const chat =
      $("#aiChat");

    if (!chat) return;

    chat.classList.remove(
      "active",
      "open"
    );

    setTimeout(() => {
      if (
        !chat.classList.contains(
          "active"
        )
      ) {
        chat.style.display =
          "";
      }
    }, 300);
  };

  function addChatMessage(
    message,
    type = "bot"
  ) {
    const messages =
      $("#chatMessages");

    if (!messages) return;

    const bubble =
      document.createElement(
        "div"
      );

    bubble.className =
      type === "user"
        ? "chat-message user-message"
        : "chat-message bot-message";

    bubble.textContent =
      message;

    messages.appendChild(
      bubble
    );

    messages.scrollTop =
      messages.scrollHeight;
  }

  function generateAIResponse(
    question
  ) {
    const q =
      question
        .toLowerCase()
        .trim();

    if (
      q.includes("skill") ||
      q.includes("skills") ||
      q.includes("technology")
    ) {
      return (
        "Priyanshu works with Python, Java, C++, JavaScript, SQL, React, Node.js, Express.js, REST APIs, Data Analytics, Power BI, Tableau, Excel and Machine Learning."
      );
    }

    if (
      q.includes("project") ||
      q.includes("projects")
    ) {
      return (
        "Key projects include EcoSentinel, Brain Tumor Detection, Kisan Mitra, AgroSmart AI, Fake Payment Detector and Cricket Score Predictor."
      );
    }

    if (
      q.includes("education") ||
      q.includes("college") ||
      q.includes("degree")
    ) {
      return (
        "Priyanshu is pursuing B.Tech in Computer Science & Engineering from Shershah Engineering College, Sasaram, with graduation in 2026."
      );
    }

    if (
      q.includes("github")
    ) {
      return (
        "You can explore Priyanshu's development work through the GitHub button available on this portfolio."
      );
    }

    if (
      q.includes("hire") ||
      q.includes("job") ||
      q.includes("available")
    ) {
      return (
        "Priyanshu is a fresher actively looking for Software Engineering, Data Analytics, Python, Java and Machine Learning opportunities."
      );
    }

    if (
      q.includes("contact") ||
      q.includes("email")
    ) {
      return (
        "Use the Contact section on this portfolio to connect with Priyanshu."
      );
    }

    if (
      q.includes("hello") ||
      q.includes("hi") ||
      q.includes("hey")
    ) {
      return (
        "Hello! 👋 I'm Priyanshu's portfolio assistant. Ask me about his skills, projects, education or career."
      );
    }

    return (
      "I can help you explore Priyanshu's skills, projects, education, experience and career profile. Try asking: 'What are his skills?'"
    );
  }

  window.handleChatSubmit =
    function (event) {
      if (event) {
        event.preventDefault();
      }

      const input =
        $("#chatInput");

      if (!input) return;

      const question =
        input.value.trim();

      if (!question) return;

      addChatMessage(
        question,
        "user"
      );

      input.value = "";

      setTimeout(() => {
        const response =
          generateAIResponse(
            question
          );

        addChatMessage(
          response,
          "bot"
        );
      }, 450);
    };

  /* =========================================================
     KEYBOARD SHORTCUTS
  ========================================================= */

  function initKeyboardShortcuts() {
    document.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Escape"
        ) {
          window.closeChat();
        }

        if (
          event.key === "/" &&
          !["INPUT", "TEXTAREA"].includes(
            document.activeElement.tagName
          )
        ) {
          const input =
            $("#chatInput");

          if (input) {
            event.preventDefault();

            window.openChat();

            input.focus();
          }
        }
      }
    );
  }

  /* =========================================================
     IMAGE LAZY LOADING
  ========================================================= */

  function initLazyImages() {
    $$("img").forEach(
      image => {
        if (
          !image.hasAttribute(
            "loading"
          )
        ) {
          image.setAttribute(
            "loading",
            "lazy"
          );
        }

        image.addEventListener(
          "error",
          () => {
            image.style.opacity =
              "0.5";
          }
        );
      }
    );
  }

  /* =========================================================
     PAGE ENTRANCE
  ========================================================= */

  function initPageEntrance() {
    document.body.classList.add(
      "portfolio-loaded"
    );

    const hero =
      $("main") ||
      $("header") ||
      document.body;

    if (hero) {
      hero.classList.add(
        "hero-ready"
      );
    }
  }

  /* =========================================================
     SPOTLIGHT
  ========================================================= */

  window.toggleSpotlight =
    function () {
      const spotlight =
        $("#spotlight");

      if (!spotlight) return;

      spotlight.classList.toggle(
        "active"
      );

      if (
        spotlight.classList.contains(
          "active"
        )
      ) {
        const input =
          spotlight.querySelector(
            "input"
          );

        if (input) {
          setTimeout(
            () => input.focus(),
            100
          );
        }
      }
    };

  /* =========================================================
     SUITE MENU
  ========================================================= */

  window.toggleSuiteMenu =
    function () {
      const menu =
        $("#suiteMenu");

      if (!menu) return;

      menu.classList.toggle(
        "active"
      );

      menu.classList.toggle(
        "open"
      );
    };

  /* =========================================================
     PROJECT MODAL
  ========================================================= */

  window.openProjectModal =
    function (
      title,
      description
    ) {
      const modal =
        $("#projectModal");

      if (!modal) return;

      const titleElement =
        modal.querySelector(
          "[data-project-title]"
        );

      const descriptionElement =
        modal.querySelector(
          "[data-project-description]"
        );

      if (titleElement) {
        titleElement.textContent =
          title || "Project";
      }

      if (
        descriptionElement
      ) {
        descriptionElement.textContent =
          description ||
          "Project details.";
      }

      modal.classList.add(
        "active",
        "open"
      );

      modal.style.display =
        "flex";
    };

  window.closeProjectModal =
    function () {
      const modal =
        $("#projectModal");

      if (!modal) return;

      modal.classList.remove(
        "active",
        "open"
      );

      setTimeout(() => {
        if (
          !modal.classList.contains(
            "active"
          )
        ) {
          modal.style.display =
            "";
        }
      }, 250);
    };

  /* =========================================================
     GLOBAL CLICK FEEDBACK
  ========================================================= */

  function initClickFeedback() {
    document.addEventListener(
      "click",
      event => {
        const target =
          event.target.closest(
            "button, a"
          );

        if (!target) return;

        audio.click(
          target.tagName ===
            "BUTTON"
            ? 680
            : 560
        );
      },
      { passive: true }
    );
  }

  /* =========================================================
     PERFORMANCE GUARD
  ========================================================= */

  function initPerformanceGuard() {
    let lastFrame =
      performance.now();

    let frameCount = 0;

    function monitor(
      timestamp
    ) {
      frameCount++;

      if (
        timestamp - lastFrame >
        1000
      ) {
        const fps =
          frameCount /
          ((timestamp -
            lastFrame) /
            1000);

        if (
          fps < 30 &&
          !document.body.classList.contains(
            "low-performance"
          )
        ) {
          document.body.classList.add(
            "low-performance"
          );
        }

        frameCount = 0;
        lastFrame =
          timestamp;
      }

      requestAnimationFrame(
        monitor
      );
    }

    requestAnimationFrame(
      monitor
    );
  }

  /* =========================================================
     INITIALIZATION
  ========================================================= */

  function initializePortfolio() {
    createCursorGlow();

    initThreeBackground();

    initCardTilt();

    initMagneticButtons();

    initTypewriter();

    initScrollReveal();

    initCounters();

    initScrollProgress();

    initNavbar();

    initActiveNavigation();

    initSmoothScroll();

    initLazyImages();

    initKeyboardShortcuts();

    initClickFeedback();

    initPerformanceGuard();

    initPageEntrance();

    pingEdgeServer();

    /* Re-check dynamic elements */
    setTimeout(() => {
      initCardTilt();
      initMagneticButtons();
    }, 1000);
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
      initializePortfolio,
      { once: true }
    );
  } else {
    initializePortfolio();
  }

})();
