document.addEventListener('DOMContentLoaded', () => {

    /* PRELOADER */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hide');
            const active = document.querySelector('.page-section.active');
            if (active) runReveals(active);
        }, 1600);
    });
    setTimeout(() => {
        if (!preloader.classList.contains('hide')) {
            preloader.classList.add('hide');
            const active = document.querySelector('.page-section.active');
            if (active) runReveals(active);
        }
    }, 2500);

    /* CURSOR GLOW */
    const glow = document.getElementById('cursor-glow');
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    /* HEADER SCROLL */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
    });

    /* MOBILE MENU */
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        mobileNav.classList.toggle('open');
    });

    /* PAGE TRANSITION */
    const pageTransition = document.getElementById('page-transition');
    const sections = document.querySelectorAll('.page-section');
    const bottomInfo = document.getElementById('bottom-info');
    let isTransitioning = false;
    let currentSection = 'home';

    function updateNav(sectionId) {
        document.querySelectorAll('.nav-link').forEach(a => {
            a.classList.toggle('active', a.dataset.section === sectionId);
        });
    }

    function runReveals(container) {
        const items = container.querySelectorAll('.reveal');
        items.forEach(el => el.classList.remove('visible'));
        void container.offsetWidth;
        items.forEach((el, i) => {
            const delay = el.dataset.delay ? parseInt(el.dataset.delay) * 100 + 80 : i * 80 + 50;
            setTimeout(() => el.classList.add('visible'), delay);
        });
        container.querySelectorAll('.stat-num').forEach(el => animateCounter(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.count) || 0;
        const duration = 1200;
        const start = performance.now();
        el.textContent = '0';
        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString('id-ID');
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function showSection(sectionId) {
        if (isTransitioning || sectionId === currentSection) return;
        isTransitioning = true;
        const next = document.getElementById(sectionId);
        if (!next) { isTransitioning = false; return; }

        menuToggle.classList.remove('open');
        mobileNav.classList.remove('open');

        pageTransition.classList.remove('reverse');
        pageTransition.classList.add('active');

        setTimeout(() => {
            sections.forEach(s => s.classList.remove('active'));
            next.classList.add('active');
            currentSection = sectionId;
            updateNav(sectionId);
            if (bottomInfo) bottomInfo.style.display = sectionId === 'home' ? 'grid' : 'none';
            window.scrollTo({ top: 0, behavior: 'instant' });

            pageTransition.classList.add('reverse');
            setTimeout(() => {
                pageTransition.classList.remove('active', 'reverse');
                runReveals(next);
                isTransitioning = false;
            }, 500);
        }, 550);
    }

    /* NAV CLICKS */
    document.querySelectorAll('.nav-link, .logo').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = el.dataset.section;
            if (sectionId) {
                showSection(sectionId);
                history.pushState(null, '', '#' + sectionId);
            }
        });
    });

    /* HASH */
    function handleHash() {
        const hash = window.location.hash.replace('#', '') || 'home';
        if (document.getElementById(hash)) {
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(hash).classList.add('active');
            currentSection = hash;
            updateNav(hash);
            if (bottomInfo) bottomInfo.style.display = hash === 'home' ? 'grid' : 'none';
        }
    }
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '') || 'home';
        showSection(hash);
    });
    handleHash();

    /* ORDER BUTTONS */
    document.querySelectorAll('.order-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.menu-card');
            const namaMenu = card ? card.querySelector('h3').textContent : 'Es Jeruk';
            showSection('contact');
            history.pushState(null, '', '#contact');
            setTimeout(() => {
                const pesan = document.getElementById('pesan');
                if (pesan) { pesan.value = `Halo, saya mau pesan: ${namaMenu}`; pesan.focus(); }
            }, 700);
        });
    });

    /* FORM */
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nama = document.getElementById('nama').value.trim();
            const telepon = document.getElementById('telepon').value.trim();
            const pesan = document.getElementById('pesan').value.trim();
            if (!nama || !telepon || !pesan) {
                showFormMsg('Mohon isi semua kolom ya! 😊', 'error');
                return;
            }
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Mengirim...</span>';
            submitBtn.disabled = true;
            setTimeout(() => {
                showFormMsg('Pesan terkirim! Kami akan segera menghubungi kamu 🍊', 'success');
                form.reset();
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }, 1000);
        });
    }
    function showFormMsg(text, type) {
        formMessage.textContent = text;
        formMessage.className = 'form-message show ' + type;
        setTimeout(() => formMessage.classList.remove('show'), 4500);
    }

    /* PARALLAX */
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.hero-bg-shapes .shape');
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        shapes.forEach((s, i) => {
            const factor = (i + 1) * 0.4;
            s.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });
});