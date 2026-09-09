/* =========================================================
   PRIYANSHU KUMAR — PORTFOLIO INTERACTION ENGINE
   STEP 5
   AI CHAT + SPOTLIGHT + 3D + SCROLL + INTERACTIONS
   ========================================================= */

(() => {
    "use strict";

    /* -----------------------------------------------------
       PREVENT DOUBLE INITIALIZATION
    ----------------------------------------------------- */

    if (window.__PriyanshuPortfolioEngine) return;
    window.__PriyanshuPortfolioEngine = true;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const isMobile = window.matchMedia(
        "(max-width: 768px)"
    ).matches;

    /* -----------------------------------------------------
       HELPERS
    ----------------------------------------------------- */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const wait = (ms) =>
        new Promise(resolve => setTimeout(resolve, ms));

    const escapeHTML = (value) => {
        const div = document.createElement("div");
        div.textContent = String(value ?? "");
        return div.innerHTML;
    };

    /* -----------------------------------------------------
       LUCIDE ICONS
    ----------------------------------------------------- */

    function refreshIcons() {
        try {
            if (window.lucide?.createIcons) {
                window.lucide.createIcons();
            }
        } catch (error) {
            console.warn("Lucide initialization failed:", error);
        }
    }

    /* -----------------------------------------------------
       PAGE READY
    ----------------------------------------------------- */

    function initPage() {
        refreshIcons();

        initScrollProgress();
        initBackToTop();
        initScrollReveal();
        initActiveNavigation();
        initMagneticButtons();
        initCardTilt();
        initCursorGlow();
        initTypewriter();
        initAnimatedCounters();
        initKeyboardShortcuts();
        initChatKeyboard();
        initSpotlightEnhancement();
        initSmoothAnchors();

        if (!isMobile && !reducedMotion) {
            initThreeBackground();
        }

        cinematicEntrance();

        setTimeout(refreshIcons, 500);
    }

    /* =====================================================
       STEP 5 — AI CHAT
       ===================================================== */

    const portfolioKnowledge = {
        skills: `
Priyanshu's technical stack includes Python, Java, C, C++,
JavaScript, HTML, CSS, React, Node.js, Express.js, SQL,
MongoDB, REST APIs, Git, GitHub, OOPs, DBMS, OS and
Computer Networks. He also works with data analytics and
machine learning concepts.
        `,

        projects: `
Major projects include EcoSentinel, Brain Tumor Detection,
Enterprise Sales Analytics, Kisan Mitra, AgroSmart AI and
Cricket Score Predictor.
        `,

        education: `
Priyanshu Kumar is a B.Tech Computer Science and Engineering
student, 2022–2026, from Shershah Engineering College,
Sasaram, affiliated with Bihar Engineering University.
        `,

        career: `
Priyanshu is focused on Software Engineering, Full-Stack
Development, Data Analytics, Python/Java development and
Machine Learning opportunities.
        `,

        github: `
The portfolio includes GitHub-based projects and development
work covering software engineering, analytics and ML.
        `
    };

    function getLocalAIResponse(message) {

        const text = message
            .toLowerCase()
            .trim();

        if (!text) {
            return "Ask me something about Priyanshu's skills, projects, education or career.";
        }

        if (
            text.includes("hello") ||
            text.includes("hi") ||
            text.includes("hey") ||
            text.includes("namaste")
        ) {
            return "Hello! 👋 I'm Priyanshu's portfolio assistant. Ask me about his skills, projects, education or career.";
        }

        if (
            text.includes("skill") ||
            text.includes("technology") ||
            text.includes("tech stack") ||
            text.includes("know")
        ) {
            return portfolioKnowledge.skills.trim();
        }

        if (
            text.includes("project") ||
            text.includes("projects") ||
            text.includes("work")
        ) {
            return portfolioKnowledge.projects.trim();
        }

        if (
            text.includes("education") ||
            text.includes("college") ||
            text.includes("degree") ||
            text.includes("study")
        ) {
            return portfolioKnowledge.education.trim();
        }

        if (
            text.includes("career") ||
            text.includes("job") ||
            text.includes("role") ||
            text.includes("developer")
        ) {
            return portfolioKnowledge.career.trim();
        }

        if (
            text.includes("github") ||
            text.includes("repository") ||
            text.includes("repo")
        ) {
            return portfolioKnowledge.github.trim();
        }

        if (
            text.includes("contact") ||
            text.includes("email") ||
            text.includes("hire")
        ) {
            return "You can use the Contact section of this portfolio to connect with Priyanshu for opportunities and collaboration.";
        }

        if (
            text.includes("python") ||
            text.includes("java") ||
            text.includes("javascript")
        ) {
            return "Priyanshu works with Python, Java and JavaScript, along with web technologies, APIs, databases and development tools.";
        }

        if (
            text.includes("data") ||
            text.includes("analytics") ||
            text.includes("sql") ||
            text.includes("power bi")
        ) {
            return "His profile combines Software Engineering with Data Analytics, including SQL, data handling, visualization and analytics-oriented projects.";
        }

        if (
            text.includes("machine learning") ||
            text.includes("ml") ||
            text.includes("ai")
        ) {
            return "Priyanshu has worked on ML/AI-oriented projects including Brain Tumor Detection and Spam Mail Detection, with Python-based workflows.";
        }

        return "I can help you explore Priyanshu's portfolio. Try asking about his skills, projects, education, career, GitHub or contact details.";
    }

    function addChatMessage(text, sender = "ai") {

        const container = $("#chatMessages");

        if (!container) return;

        const message = document.createElement("div");

        message.className =
            `chat-message ${sender === "user" ? "user-message" : "ai-message"}`;

        const bubble = document.createElement("div");

        bubble.className =
            sender === "user"
                ? "max-w-[85%] ml-auto rounded-2xl rounded-br-sm px-4 py-3 bg-orange-500 text-black"
                : "max-w-[85%] mr-auto rounded-2xl rounded-bl-sm px-4 py-3 bg-white/5 border border-white/10 text-white/80";

        bubble.innerHTML = escapeHTML(text)
            .replace(/\n/g, "<br>");

        message.appendChild(bubble);
        container.appendChild(message);

        while (container.children.length > 50) {
            container.removeChild(container.firstChild);
        }

        container.scrollTo({
            top: container.scrollHeight,
            behavior: reducedMotion ? "auto" : "smooth"
        });

        refreshIcons();
    }

    function showTypingIndicator() {

        const container = $("#chatMessages");

        if (!container) return null;

        const typing = document.createElement("div");

        typing.id = "aiTypingIndicator";

        typing.className =
            "flex items-center gap-1 px-4 py-3 w-fit rounded-2xl bg-white/5 border border-white/10";

        typing.innerHTML = `
            <span class="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style="animation-delay:.15s"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style="animation-delay:.3s"></span>
        `;

        container.appendChild(typing);

        container.scrollTo({
            top: container.scrollHeight,
            behavior: reducedMotion ? "auto" : "smooth"
        });

        return typing;
    }

    async function askBackend(message) {

        /*
         * If you later create /api/chat, this function can
         * connect the portfolio UI to your real AI backend.
         */

        try {

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message
                })
            });

            if (!response.ok) {
                throw new Error("Backend unavailable");
            }

            const data = await response.json();

            return (
                data.reply ||
                data.message ||
                data.response ||
                null
            );

        } catch {
            return null;
        }
    }

    window.openChat = function () {

        const chat = $("#aiChat");

        if (!chat) return;

        chat.classList.remove("hidden");

        const input = $("#chatInput");

        if (input) {
            setTimeout(() => input.focus(), 150);
        }

        refreshIcons();
    };

    window.closeChat = function () {

        const chat = $("#aiChat");

        if (!chat) return;

        chat.classList.add("hidden");
    };

    window.handleChatSubmit = async function (event) {

        event.preventDefault();

        const input = $("#chatInput");

        if (!input) return;

        const message = input.value.trim();

        if (!message) return;

        addChatMessage(message, "user");

        input.value = "";

        const typing = showTypingIndicator();

        await wait(reducedMotion ? 50 : 550);

        let response = await askBackend(message);

        if (!response) {
            response = getLocalAIResponse(message);
        }

        if (typing) {
            typing.remove();
        }

        addChatMessage(response, "ai");
    };

    function initChatKeyboard() {

        const input = $("#chatInput");

        if (!input) return;

        input.addEventListener("keydown", event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {
                event.preventDefault();

                const form = input.closest("form");

                if (form) {
                    form.requestSubmit();
                }
            }

            if (event.key === "Escape") {
                window.closeChat();
            }
        });
    }

    /* =====================================================
       SPOTLIGHT SEARCH
       ===================================================== */

    function buildSpotlightResults(query = "") {

        const results = $("#spotlightResults");

        if (!results) return;

        const normalized = query
            .toLowerCase()
            .trim();

        const searchable = [
            {
                title: "About Me",
                description: "About Priyanshu Kumar",
                target: "#about"
            },
            {
                title: "Skills",
                description: "Technical skills and technologies",
                target: "#skills"
            },
            {
                title: "Projects",
                description: "Featured software and AI projects",
                target: "#projects"
            },
            {
                title: "Experience & Education",
                description: "Education and professional journey",
                target: "#experience"
            },
            {
                title: "Contact",
                description: "Get in touch and collaboration",
                target: "#contact"
            }
        ];

        const filtered = normalized
            ? searchable.filter(item =>
                `${item.title} ${item.description}`
                    .toLowerCase()
                    .includes(normalized)
            )
            : searchable;

        results.innerHTML = "";

        if (!filtered.length) {

            results.innerHTML = `
                <div class="p-5 text-center text-white/40">
                    No results found
                </div>
            `;

            return;
        }

        filtered.forEach((item, index) => {

            const button = document.createElement("button");

            button.type = "button";

            button.className = `
                w-full text-left px-4 py-3 rounded-xl
                border border-white/5
                hover:border-orange-400/30
                hover:bg-white/5
                transition-all
                flex items-center gap-3
            `;

            button.innerHTML = `
                <span class="w-8 h-8 rounded-lg bg-orange-400/10
                    flex items-center justify-center text-orange-300">
                    ${index + 1}
                </span>

                <span>
                    <span class="block text-sm text-white">
                        ${escapeHTML(item.title)}
                    </span>

                    <span class="block text-xs text-white/40 mt-0.5">
                        ${escapeHTML(item.description)}
                    </span>
                </span>
            `;

            button.addEventListener("click", () => {

                const target = $(item.target);

                if (target) {
                    target.scrollIntoView({
                        behavior: reducedMotion ? "auto" : "smooth",
                        block: "start"
                    });
                }

                if (typeof window.closeSpotlight === "function") {
                    window.closeSpotlight();
                }
            });

            results.appendChild(button);
        });
    }

    function initSpotlightEnhancement() {

        const input = $("#spotlightInput");

        if (!input) return;

        input.addEventListener("input", () => {
            buildSpotlightResults(input.value);
        });

        buildSpotlightResults();

        document.addEventListener("keydown", event => {

            const key =
                event.key.toLowerCase();

            if (
                (event.ctrlKey || event.metaKey) &&
                key === "k"
            ) {

                event.preventDefault();

                if (typeof window.toggleSpotlight === "function") {
                    window.toggleSpotlight();
                }

                setTimeout(() => input.focus(), 80);
            }

            if (event.key === "Escape") {

                if (
                    typeof window.closeSpotlight === "function"
                ) {
                    window.closeSpotlight();
                }
            }
        });
    }

    /* =====================================================
       SCROLL PROGRESS
       ===================================================== */

    function initScrollProgress() {

        let progress = $(".scroll-progress");

        if (!progress) {

            progress = document.createElement("div");

            progress.className = "scroll-progress";

            document.body.appendChild(progress);
        }

        let ticking = false;

        function updateProgress() {

            const scrollTop =
                window.scrollY || window.pageYOffset;

            const height =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const percentage =
                height > 0
                    ? (scrollTop / height) * 100
                    : 0;

            progress.style.width =
                `${Math.min(100, Math.max(0, percentage))}%`;

            ticking = false;
        }

        window.addEventListener(
            "scroll",
            () => {

                if (!ticking) {

                    requestAnimationFrame(
                        updateProgress
                    );

                    ticking = true;
                }

            },
            { passive: true }
        );

        updateProgress();
    }

    /* =====================================================
       BACK TO TOP
       ===================================================== */

    function initBackToTop() {

        let button = $(".back-to-top");

        if (!button) {

            button = document.createElement("button");

            button.type = "button";

            button.className = "back-to-top";

            button.setAttribute(
                "aria-label",
                "Back to top"
            );

            button.innerHTML = `
                <i data-lucide="arrow-up" width="18"></i>
            `;

            document.body.appendChild(button);
        }

        button.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: reducedMotion
                    ? "auto"
                    : "smooth"
            });
        });

        function update() {

            if (window.scrollY > 600) {
                button.classList.add("visible");
            } else {
                button.classList.remove("visible");
            }
        }

        window.addEventListener(
            "scroll",
            update,
            { passive: true }
        );

        update();
    }

    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    function initScrollReveal() {

        const targets = [
            "section",
            ".glass-card",
            ".tech-chip"
        ];

        const elements = $$(targets.join(","));

        if (!elements.length) return;

        elements.forEach((element, index) => {

            if (
                element.classList.contains("js-reveal")
            ) {
                return;
            }

            element.classList.add("js-reveal");

            element.style.transitionDelay =
                `${Math.min(index % 6, 5) * 60}ms`;
        });

        if (
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {

            elements.forEach(element =>
                element.classList.add("revealed")
            );

            return;
        }

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "revealed"
                        );

                        observer.unobserve(
                            entry.target
                        );
                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -60px 0px"
                }
            );

        elements.forEach(element =>
            observer.observe(element)
        );
    }

    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    function initActiveNavigation() {

        const sections =
            $$("section[id]");

        const links =
            $$('a[href^="#"]');

        if (!sections.length) return;

        if (
            !("IntersectionObserver" in window)
        ) return;

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        const id =
                            entry.target.id;

                        links.forEach(link => {

                            link.classList.toggle(
                                "active",
                                link.getAttribute("href") ===
                                `#${id}`
                            );
                        });
                    });

                },
                {
                    threshold: 0.35
                }
            );

        sections.forEach(section =>
            observer.observe(section)
        );
    }

    /* =====================================================
       MAGNETIC BUTTONS
       ===================================================== */

    function initMagneticButtons() {

        if (
            isMobile ||
            reducedMotion
        ) {
            return;
        }

        const buttons =
            $$(".magnetic");

        buttons.forEach(button => {

            button.addEventListener(
                "pointermove",
                event => {

                    const rect =
                        button.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;

                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;

                    const strength = 0.16;

                    button.style.transform =
                        `translate(${x * strength}px, ${y * strength}px)`;
                }
            );

            button.addEventListener(
                "pointerleave",
                () => {

                    button.style.transform = "";
                }
            );
        });
    }

    /* =====================================================
       3D CARD TILT
       ===================================================== */

    function initCardTilt() {

        if (
            isMobile ||
            reducedMotion
        ) {
            return;
        }

        const cards =
            $$(".glass-card");

        cards.forEach(card => {

            card.addEventListener(
                "pointermove",
                event => {

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left;

                    const y =
                        event.clientY -
                        rect.top;

                    const rotateY =
                        ((x / rect.width) - 0.5) * 10;

                    const rotateX =
                        ((y / rect.height) - 0.5) * -10;

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
                }
            );

            card.addEventListener(
                "pointerleave",
                () => {

                    card.style.transform = "";
                    card.style.removeProperty(
                        "--mouse-x"
                    );
                    card.style.removeProperty(
                        "--mouse-y"
                    );
                }
            );
        });
    }

    /* =====================================================
       CURSOR GLOW
       ===================================================== */

    function initCursorGlow() {

        if (
            isMobile ||
            reducedMotion
        ) {
            return;
        }

        if (
            !window.matchMedia(
                "(pointer: fine)"
            ).matches
        ) {
            return;
        }

        let glow =
            $(".cursor-glow");

        if (!glow) {

            glow = document.createElement("div");

            glow.className =
                "cursor-glow";

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

            x += (targetX - x) * 0.12;
            y += (targetY - y) * 0.12;

            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;

            requestAnimationFrame(animate);
        }

        animate();
    }

    /* =====================================================
       TYPEWRITER
       ===================================================== */

    function initTypewriter() {

        const element =
            $("#typewriter");

        if (!element) return;

        const roles = [
            "Software Engineer",
            "Full-Stack Developer",
            "Data Analyst & BI Specialist",
            "Machine Learning Engineer",
            "Python Developer"
        ];

        let roleIndex = 0;
        let characterIndex = 0;
        let deleting = false;

        function type() {

            const current =
                roles[roleIndex];

            if (!deleting) {

                characterIndex++;

                element.textContent =
                    current.substring(
                        0,
                        characterIndex
                    );

                if (
                    characterIndex >=
                    current.length
                ) {

                    deleting = true;

                    setTimeout(
                        type,
                        reducedMotion ? 1000 : 1600
                    );

                    return;
                }

            } else {

                characterIndex--;

                element.textContent =
                    current.substring(
                        0,
                        characterIndex
                    );

                if (characterIndex <= 0) {

                    deleting = false;

                    roleIndex =
                        (roleIndex + 1) %
                        roles.length;
                }
            }

            setTimeout(
                type,
                deleting
                    ? 45
                    : 75
            );
        }

        type();
    }

    /* =====================================================
       COUNTERS
       ===================================================== */

    function initAnimatedCounters() {

        const counters =
            $$("[data-counter]");

        if (!counters.length) return;

        const animateCounter =
            element => {

                const target =
                    Number(
                        element.dataset.counter
                    );

                if (
                    !Number.isFinite(target)
                ) {
                    return;
                }

                const duration =
                    reducedMotion ? 0 : 1200;

                const start =
                    performance.now();

                function update(now) {

                    const progress =
                        duration === 0
                            ? 1
                            : Math.min(
                                1,
                                (now - start) /
                                duration
                            );

                    const eased =
                        1 -
                        Math.pow(
                            1 - progress,
                            3
                        );

                    element.textContent =
                        Math.round(
                            target * eased
                        );

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }

                requestAnimationFrame(update);
            };

        if (
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {

            counters.forEach(counter => {
                counter.textContent =
                    counter.dataset.counter;
            });

            return;
        }

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        animateCounter(
                            entry.target
                        );

                        observer.unobserve(
                            entry.target
                        );
                    });

                },
                {
                    threshold: 0.6
                }
            );

        counters.forEach(counter =>
            observer.observe(counter)
        );
    }

    /* =====================================================
       SMOOTH ANCHOR NAVIGATION
       ===================================================== */

    function initSmoothAnchors() {

        $$('a[href^="#"]').forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const href =
                        link.getAttribute("href");

                    if (
                        !href ||
                        href === "#"
                    ) {
                        return;
                    }

                    const target =
                        $(href);

                    if (!target) return;

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior:
                            reducedMotion
                                ? "auto"
                                : "smooth",
                        block: "start"
                    });
                }
            );
        });
    }

    /* =====================================================
       KEYBOARD SHORTCUTS
       ===================================================== */

    function initKeyboardShortcuts() {

        document.addEventListener(
            "keydown",
            event => {

                if (event.key === "Escape") {

                    if (
                        typeof window.closeChat ===
                        "function"
                    ) {
                        window.closeChat();
                    }

                    if (
                        typeof window.closeSpotlight ===
                        "function"
                    ) {
                        window.closeSpotlight();
                    }
                }

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
            }
        );
    }

    /* =====================================================
       CINEMATIC ENTRANCE
       ===================================================== */

    function cinematicEntrance() {

        if (reducedMotion) return;

        const candidates = [
            "header",
            ".hero-grid",
            "#about",
            "#skills",
            "#projects",
            "#experience",
            "#contact"
        ];

        candidates.forEach(
            (selector, index) => {

                const element =
                    $(selector);

                if (!element) return;

                element.classList.add(
                    "js-enter"
                );

                element.style.animationDelay =
                    `${index * 90}ms`;
            }
        );
    }

    /* =====================================================
       THREE.JS BACKGROUND
       ===================================================== */

    function initThreeBackground() {

        const canvas =
            $("#three-bg");

        if (
            !canvas ||
            !window.THREE
        ) {
            return;
        }

        try {

            const THREE =
                window.THREE;

            const scene =
                new THREE.Scene();

            const camera =
                new THREE.PerspectiveCamera(
                    55,
                    window.innerWidth /
                    window.innerHeight,
                    0.1,
                    100
                );

            camera.position.z = 14;

            const renderer =
                new THREE.WebGLRenderer({
                    canvas,
                    alpha: true,
                    antialias: true,
                    powerPreference: "high-performance"
                });

            renderer.setPixelRatio(
                Math.min(
                    window.devicePixelRatio || 1,
                    1.5
                )
            );

            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );

            /* ---------------------------------------------
               PARTICLES
            --------------------------------------------- */

            const particleCount =
                isMobile ? 55 : 110;

            const positions =
                new Float32Array(
                    particleCount * 3
                );

            const velocity =
                [];

            for (
                let i = 0;
                i < particleCount;
                i++
            ) {

                const i3 = i * 3;

                positions[i3] =
                    (Math.random() - 0.5) * 28;

                positions[i3 + 1] =
                    (Math.random() - 0.5) * 18;

                positions[i3 + 2] =
                    (Math.random() - 0.5) * 16;

                velocity.push({
                    x:
                        (Math.random() - 0.5) *
                        0.0015,

                    y:
                        (Math.random() - 0.5) *
                        0.0015,

                    z:
                        (Math.random() - 0.5) *
                        0.001
                });
            }

            const geometry =
                new THREE.BufferGeometry();

            geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(
                    positions,
                    3
                )
            );

            const material =
                new THREE.PointsMaterial({
                    color: 0xffb13b,
                    size: 0.035,
                    transparent: true,
                    opacity: 0.65,
                    sizeAttenuation: true
                });

            const particles =
                new THREE.Points(
                    geometry,
                    material
                );

            scene.add(particles);

            /* ---------------------------------------------
               CONNECTION LINES
            --------------------------------------------- */

            const linePositions = [];

            const maxDistance = isMobile
                ? 3.4
                : 3.8;

            for (
                let i = 0;
                i < particleCount;
                i++
            ) {

                for (
                    let j = i + 1;
                    j < particleCount;
                    j++
                ) {

                    const i3 = i * 3;
                    const j3 = j * 3;

                    const dx =
                        positions[i3] -
                        positions[j3];

                    const dy =
                        positions[i3 + 1] -
                        positions[j3 + 1];

                    const dz =
                        positions[i3 + 2] -
                        positions[j3 + 2];

                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy +
                            dz * dz
                        );

                    if (
                        distance <
                        maxDistance
                    ) {

                        linePositions.push(
                            positions[i3],
                            positions[i3 + 1],
                            positions[i3 + 2],

                            positions[j3],
                            positions[j3 + 1],
                            positions[j3 + 2]
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
                    color: 0xffa726,
                    transparent: true,
                    opacity: 0.07
                });

            const lines =
                new THREE.LineSegments(
                    lineGeometry,
                    lineMaterial
                );

            scene.add(lines);

            /* ---------------------------------------------
               MOUSE PARALLAX
            --------------------------------------------- */

            let mouseX = 0;
            let mouseY = 0;

            let targetMouseX = 0;
            let targetMouseY = 0;

            window.addEventListener(
                "pointermove",
                event => {

                    targetMouseX =
                        (event.clientX /
                            window.innerWidth -
                            0.5);

                    targetMouseY =
                        (event.clientY /
                            window.innerHeight -
                            0.5);
                },
                { passive: true }
            );

            let animationFrame;

            function animate() {

                animationFrame =
                    requestAnimationFrame(
                        animate
                    );

                mouseX +=
                    (targetMouseX - mouseX) *
                    0.025;

                mouseY +=
                    (targetMouseY - mouseY) *
                    0.025;

                camera.position.x =
                    mouseX * 1.2;

                camera.position.y =
                    -mouseY * 0.8;

                camera.lookAt(
                    scene.position
                );

                particles.rotation.y +=
                    0.00035;

                particles.rotation.x +=
                    0.00008;

                lines.rotation.y +=
                    0.00035;

                renderer.render(
                    scene,
                    camera
                );
            }

            animate();

            /* ---------------------------------------------
               RESIZE
            --------------------------------------------- */

            function resize() {

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
                        1.5
                    )
                );
            }

            window.addEventListener(
                "resize",
                resize,
                { passive: true }
            );

            /* ---------------------------------------------
               TAB PERFORMANCE
            --------------------------------------------- */

            document.addEventListener(
                "visibilitychange",
                () => {

                    if (
                        document.hidden &&
                        animationFrame
                    ) {

                        cancelAnimationFrame(
                            animationFrame
                        );

                    } else if (
                        !document.hidden
                    ) {

                        animate();
                    }
                }
            );

        } catch (error) {

            console.warn(
                "Three.js background disabled:",
                error
            );
        }
    }

    /* =====================================================
       INITIALIZE
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initPage,
            { once: true }
        );

    } else {

        initPage();
    }
/* =====================================================
   STEP 6 — PROJECT MODAL ENHANCEMENT
   ===================================================== */

function initProjectModalEnhancement() {

    const modal = document.getElementById("projectModal");
    const box = document.getElementById("projectModalBox");

    if (!modal || !box) return;

    /* ESC CLOSE */

    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        if (
            !modal.classList.contains("hidden") &&
            typeof window.closeProjectModal === "function"
        ) {
            window.closeProjectModal();
        }
    });

    /* CLICK OUTSIDE */

    modal.addEventListener("click", event => {

        if (event.target !== modal) return;

        if (
            typeof window.closeProjectModal === "function"
        ) {
            window.closeProjectModal();
        }
    });

    /* 3D MODAL MOVEMENT */

    if (
        window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        modal.addEventListener(
            "pointermove",
            event => {

                if (
                    modal.classList.contains("hidden")
                ) {
                    return;
                }

                const rect =
                    box.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;

                const rotateY =
                    ((x / rect.width) - 0.5) * 2.5;

                const rotateX =
                    ((y / rect.height) - 0.5) * -2.5;

                box.style.transform =
                    `perspective(1400px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)`;
            },
            { passive: true }
        );

        modal.addEventListener(
            "pointerleave",
            () => {
                box.style.transform = "";
            }
        );
    }
}

initProjectModalEnhancement();
/* =========================================================
   STEP 7 — LOADER + HERO PARALLAX + SKILL EFFECTS
   ========================================================= */

/* =========================
   PREMIUM LOADER
   ========================= */

function createPortfolioLoader() {

    if (
        document.querySelector(".portfolio-loader")
    ) {
        return;
    }

    const loader =
        document.createElement("div");

    loader.className =
        "portfolio-loader";

    loader.innerHTML = `
        <div class="loader-inner">

            <div class="loader-logo">
                PK
            </div>

            <div class="loader-subtitle">
                Priyanshu Kumar • Portfolio
            </div>

            <div class="loader-line"></div>

            <div class="loader-status">
                INITIALIZING EXPERIENCE...
            </div>

        </div>
    `;

    document.body.appendChild(loader);

    const status =
        loader.querySelector(".loader-status");

    const messages = [
        "INITIALIZING EXPERIENCE...",
        "LOADING PROJECTS...",
        "BUILDING INTERFACE...",
        "STARTING 3D ENGINE...",
        "READY."
    ];

    let index = 0;

    const statusTimer =
        setInterval(() => {

            index++;

            if (
                index >= messages.length
            ) {
                clearInterval(statusTimer);
                return;
            }

            if (status) {
                status.textContent =
                    messages[index];
            }

        }, 420);

    const finishLoader = () => {

        setTimeout(() => {

            loader.classList.add(
                "loaded"
            );

            setTimeout(() => {
                loader.remove();
            }, 800);

        }, reducedMotion ? 100 : 1500);
    };

    if (
        document.readyState ===
        "complete"
    ) {
        finishLoader();
    } else {
        window.addEventListener(
            "load",
            finishLoader,
            { once: true }
        );
    }
}


/* =========================
   HERO PARALLAX
   ========================= */

function initHeroParallax() {

    if (
        isMobile ||
        reducedMotion
    ) {
        return;
    }

    const hero =
        $(".hero-grid");

    if (!hero) return;

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    hero.addEventListener(
        "pointermove",
        event => {

            const rect =
                hero.getBoundingClientRect();

            const x =
                (event.clientX -
                    rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY -
                    rect.top) /
                rect.height -
                0.5;

            targetX = x;
            targetY = y;
        },
        { passive: true }
    );

    hero.addEventListener(
        "pointerleave",
        () => {
            targetX = 0;
            targetY = 0;
        }
    );

    function animateHero() {

        currentX +=
            (targetX - currentX) *
            0.06;

        currentY +=
            (targetY - currentY) *
            0.06;

        hero.style.transform =
            `rotateX(${currentY * -1.4}deg)
             rotateY(${currentX * 1.4}deg)`;

        requestAnimationFrame(
            animateHero
        );
    }

    animateHero();
}


/* =========================
   SKILL INTERACTIONS
   ========================= */

function initSkillInteractions() {

    const cards =
        $$(".skill-card");

    if (!cards.length) {
        return;
    }

    cards.forEach(card => {

        card.addEventListener(
            "pointermove",
            event => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;

                card.style.setProperty(
                    "--skill-x",
                    `${x}px`
                );

                card.style.setProperty(
                    "--skill-y",
                    `${y}px`
                );
            },
            { passive: true }
        );
    });
}


/* =========================
   AUTO-DETECT SKILL CARDS
   ========================= */

function detectSkillCards() {

    const section =
        $("#skills");

    if (!section) {
        return;
    }

    const cards =
        $$(".glass-card", section);

    cards.forEach(card => {

        if (
            !card.classList.contains(
                "skill-card"
            )
        ) {
            card.classList.add(
                "skill-card"
            );
        }
    });
}


/* =========================
   FLOATING DOTS
   ========================= */

function createFloatingDots() {

    if (
        isMobile ||
        reducedMotion
    ) {
        return;
    }

    const hero =
        $(".hero-grid");

    if (!hero) return;

    const count = 12;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const dot =
            document.createElement("span");

        dot.className =
            "floating-dot";

        dot.style.left =
            `${Math.random() * 100}%`;

        dot.style.top =
            `${Math.random() * 100}%`;

        dot.style.animationDelay =
            `${Math.random() * 5}s`;

        dot.style.animationDuration =
            `${4 + Math.random() * 4}s`;

        hero.appendChild(dot);
    }
}


/* =========================
   INITIALIZE STEP 7
   ========================= */

createPortfolioLoader();
detectSkillCards();
initSkillInteractions();
initHeroParallax();
createFloatingDots();
})();
