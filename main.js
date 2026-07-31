/* ==========================================================================
   HALL MARK CLUBHOUSE - INTERACTIVE MOTION ENGINE (GSAP + LENIS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // 1. Lenis Smooth Scroll Engine
  const lenis = new Lenis({
    duration: 1.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
    wheelMultiplier: 0.95
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync GSAP ScrollTrigger with Lenis
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // Remove loading class
  document.body.classList.remove('loading');

  // 2. Custom Magnetic Cursor
  initCustomCursor();

  // 3. Ambient Particle Canvas
  initParticleCanvas();

  // 4. Split Text Reveal Animation
  initSplitTextReveals();

  // 5. Number Counters
  initNumberCounters();

  // 6. Hero 182-Frame Image Canvas Sequence
  initHeroCanvasSequence();

  // 7. Dedicated 3D Video Cinema Section
  initCinemaVideo();

  // 7. Interactive 3D Exploded Floor Stack
  initFloorStack();

  // 8. Ground Floor Amenity Tabs
  initAmenityTabs();

  // 9. Glassmorphism Header & Active Nav
  initHeaderNav();

  // 10. VIP Booking Modal
  initBookingModal();

  // 11. Sound Audio Player
  initAudioPlayer();
});

/* ==========================================================================
   MAGNETIC CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursorRing = document.getElementById('cursor-ring');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorText = document.getElementById('cursor-text');
  
  if (!cursorRing || !cursorDot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let dotX = mouseX;
  let dotY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    // Lerp motion
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    dotX += (mouseX - dotX) * 0.4;
    dotY += (mouseY - dotY) * 0.4;

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    if (cursorText) {
      cursorText.style.left = `${ringX}px`;
      cursorText.style.top = `${ringY}px`;
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover triggers
  const hoverElements = document.querySelectorAll('a, button, .arch-card, .facility-card, .stack-layer, [data-magnet]');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
      document.body.classList.remove('cursor-text-active');
    });
  });

  // Magnetic element effect
  const magneticEls = document.querySelectorAll('[data-magnet]');
  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: relX * 0.25, y: relY * 0.25, duration: 0.3, ease: "power2.out" });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
    });
  });
}

/* ==========================================================================
   AMBIENT PARTICLE CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const numParticles = 45;

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.5 - 0.1
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(197, 168, 128, ${p.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#c5a880';
      ctx.fill();
    });

    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* ==========================================================================
   SPLIT TEXT REVEALS (WORD BY WORD)
   ========================================================================== */
function initSplitTextReveals() {
  const splitTitles = document.querySelectorAll('.split-words');

  splitTitles.forEach(title => {
    const text = title.innerText.trim();
    const words = text.split(' ');
    title.innerHTML = '';

    words.forEach(word => {
      const wrapper = document.createElement('span');
      wrapper.classList.add('word-wrapper');
      
      const inner = document.createElement('span');
      inner.classList.add('word-inner');
      inner.innerText = word;
      
      wrapper.appendChild(inner);
      title.appendChild(wrapper);
    });

    if (window.gsap && window.ScrollTrigger) {
      gsap.to(title.querySelectorAll('.word-inner'), {
        y: '0%',
        opacity: 1,
        duration: 1.1,
        stagger: 0.08,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }
  });

  // Fade Up Elements
  const fadeUpEls = document.querySelectorAll('[data-fade-up]');
  fadeUpEls.forEach(el => {
    if (window.gsap && window.ScrollTrigger) {
      gsap.fromTo(el, 
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  });
}

/* ==========================================================================
   NUMBER COUNTERS
   ========================================================================== */
function initNumberCounters() {
  const counters = document.querySelectorAll('.metric-num[data-count]');

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'), 10);

    if (window.gsap && window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(counter, {
            innerText: target,
            duration: 2.2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            onUpdate: function() {
              counter.innerText = Math.floor(counter.innerText).toLocaleString();
            }
          });
        }
      });
    }
  });
}

/* ==========================================================================
   HERO 182-FRAME IMAGE CANVAS SEQUENCE SCRUBBER
   ========================================================================== */
function initHeroCanvasSequence() {
  const canvas = document.getElementById('sequence-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const loader = document.getElementById('canvas-loading-indicator');

  const totalFrames = 182;
  const images = [];
  const sequence = { frame: 0 };
  let loadedCount = 0;

  // Preload all 182 extracted image frames
  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    const frameNum = i.toString().padStart(3, '0');
    img.src = `hero_sequence/ezgif-frame-${frameNum}.jpg`;

    img.onload = () => {
      loadedCount++;
      if (loader && loadedCount >= totalFrames) {
        loader.classList.add('done');
      }
      if (i === 1) renderFrame(0);
    };

    images.push(img);
  }

  // Draw current frame to canvas with responsive object-fit: cover math
  function renderFrame(index) {
    const img = images[index];
    if (!img || !img.complete) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const imgWidth = img.width || 1920;
    const imgHeight = img.height || 1080;
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = imgWidth / imgHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasAspect > imgAspect) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgAspect;
      drawHeight = canvas.height;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  window.addEventListener('resize', () => renderFrame(sequence.frame));

  // GSAP ScrollTrigger Sequence Scrubbing (Pinned Hero for Ultra-Smooth Slow Rotation)
  if (window.gsap && window.ScrollTrigger) {
    const heroContent = document.querySelector('.hero-content');
    const heroTint = document.getElementById('hero-text-tint');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    gsap.to(sequence, {
      frame: totalFrames - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '+=2500',
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          renderFrame(sequence.frame);

          // 1. Smoothly fade out "SCROLL TO BUILD" as soon as user starts scrolling
          if (scrollIndicator) {
            if (self.progress > 0.015) {
              scrollIndicator.classList.add('fade-out');
            } else {
              scrollIndicator.classList.remove('fade-out');
            }
          }

          // 2. Only reveal text AND soft frosted glass tint after 3D building animation is nearly complete (frame >= 140)
          if (sequence.frame >= 140) {
            if (heroContent) heroContent.classList.add('visible');
            if (heroTint) heroTint.classList.add('visible');
          } else {
            if (heroContent) heroContent.classList.remove('visible');
            if (heroTint) heroTint.classList.remove('visible');
          }
        }
      }
    });

    // Parallax movement for section cards
    const parallaxCards = document.querySelectorAll('.arch-card, .facility-card, .sky-hero-box, .split-feature-row, .stack-info-panel');
    parallaxCards.forEach((card, index) => {
      const depth = (index % 2 === 0) ? 60 : -40;
      gsap.fromTo(card,
        { y: depth, scale: 0.98 },
        {
          y: -depth,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        }
      );
    });
  }
}

/* ==========================================================================
   DEDICATED 3D VIDEO CINEMA CONTROLLER
   ========================================================================== */
function initCinemaVideo() {
  const video = document.getElementById('cinema-video');
  const bigPlay = document.getElementById('cinema-big-play');
  const playBtn = document.getElementById('cinema-play-btn');
  const playIcon = document.getElementById('cinema-play-icon');
  const pauseIcon = document.getElementById('cinema-pause-icon');
  const scrubber = document.getElementById('cinema-scrubber');
  const timeDisplay = document.getElementById('cinema-time-display');
  const fullscreenBtn = document.getElementById('cinema-fullscreen-btn');
  const sceneChips = document.querySelectorAll('.scene-chip');

  if (!video) return;

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function togglePlay() {
    if (video.paused) {
      video.play();
      if (bigPlay) bigPlay.style.display = 'none';
      if (playIcon) playIcon.classList.add('hidden');
      if (pauseIcon) pauseIcon.classList.remove('hidden');
    } else {
      video.pause();
      if (bigPlay) bigPlay.style.display = 'flex';
      if (playIcon) playIcon.classList.remove('hidden');
      if (pauseIcon) pauseIcon.classList.add('hidden');
    }
    if (window.lucide) lucide.createIcons();
  }

  if (bigPlay) bigPlay.addEventListener('click', togglePlay);
  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (video) video.addEventListener('click', togglePlay);

  video.addEventListener('timeupdate', () => {
    if (!isNaN(video.duration)) {
      const pct = (video.currentTime / video.duration) * 100;
      if (scrubber) scrubber.value = pct;
      if (timeDisplay) {
        timeDisplay.innerText = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
      }
    }
  });

  if (scrubber) {
    scrubber.addEventListener('input', () => {
      if (!isNaN(video.duration)) {
        video.currentTime = (scrubber.value / 100) * video.duration;
      }
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      }
    });
  }

  // Scene Selection Jump Chips
  sceneChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const jumpTime = parseFloat(chip.getAttribute('data-jump'));
      video.currentTime = jumpTime;
      video.play();
      if (bigPlay) bigPlay.style.display = 'none';
      if (playIcon) playIcon.classList.add('hidden');
      if (pauseIcon) pauseIcon.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();

      // Scroll cinema into view smoothly
      const cinemaSec = document.getElementById('video-cinema');
      if (cinemaSec) cinemaSec.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ==========================================================================
   VIDEO CONTROLS & TIMESTAMPS
   ========================================================================== */
function initVideoControls() {
  const heroVideo = document.getElementById('parallax-video') || document.getElementById('hero-video');
  const playBtn = document.getElementById('video-play-btn');

  if (heroVideo && playBtn) {
    playBtn.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play();
        playBtn.innerHTML = '<i data-lucide="pause"></i>';
      } else {
        heroVideo.pause();
        playBtn.innerHTML = '<i data-lucide="play"></i>';
      }
      if (window.lucide) lucide.createIcons();
    });
  }

  // Video Timestamp Seek Buttons
  const seekBtns = document.querySelectorAll('.seek-video-btn, [data-time]');
  seekBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const timeStr = btn.getAttribute('data-time');
      if (timeStr === null) return;

      const seconds = parseFloat(timeStr);
      if (heroVideo) {
        const duration = heroVideo.duration || 30;
        const scrollFraction = seconds / duration;
        
        // Scroll lenis to proportional height
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetY = totalHeight * scrollFraction;
        
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   3D ISOMETRIC EXPLODED FLOOR STACK
   ========================================================================== */
const floorData = {
  rooftop: {
    badge: "ROOFTOP TERRACE & SKY LOUNGE",
    title: "Open-Air Pavilion & Fire Pits",
    desc: "Pergola seating, gas ember fire pits, sky cocktail bar, stargazing loungers, and 360-degree city views.",
    height: "Open Sky / 4.2m",
    capacity: "150 Guests",
    feature: "Gas Fire Pit Tables",
    time: "20"
  },
  "3rd": {
    badge: "LEVEL 03 - PRIVATE SUITES",
    title: "Luxury Guest Suites & Skylounge",
    badgeColor: "gold",
    desc: "Private overnight suite accommodation for club members, marble washroom hall, and skylounge reception.",
    height: "3.6 Meters",
    capacity: "40 Guests",
    feature: "Italian Marble Bathrooms",
    time: "18"
  },
  "2nd": {
    badge: "LEVEL 02 - RECREATION & FITNESS",
    title: "Gymnasium & Indoor Games Arcade",
    desc: "State-of-the-art TechnoGym fitness zone, 8-ball billiards lounge, table tennis, and kids play carpet.",
    height: "3.8 Meters",
    capacity: "120 Guests",
    feature: "TechnoGym Racks",
    time: "15"
  },
  "1st": {
    badge: "LEVEL 01 - CORPORATE SUITES",
    title: "Executive Boardroom & Conference Suite",
    desc: "Acoustically insulated 20-seat executive conference room, presentation screens, and private meeting hall.",
    height: "3.6 Meters",
    capacity: "80 Guests",
    feature: "Solid Teak Board Table",
    time: "13"
  },
  ground: {
    badge: "LEVEL 00 - ARRIVAL & POOL DECK",
    title: "Reception Lobby & Swimming Pool",
    desc: "Double-height grand entrance lobby, marble elevator bank, resort lap pool deck, cafe, and fine dining.",
    height: "5.5 Meters",
    capacity: "300 Guests",
    feature: "25m Infinity Lap Pool",
    time: "4"
  },
  basement: {
    badge: "LEVEL B1 - SUBTERRANEAN GARAGE",
    title: "Underground EV Parking Garage",
    desc: "Polished epoxy floor garage with dedicated EV charging bays, valet drop-off, and elevator access core.",
    height: "3.2 Meters",
    capacity: "60 Vehicles",
    feature: "EV Fast Chargers",
    time: "7"
  }
};

function initFloorStack() {
  const layers = document.querySelectorAll('.stack-layer');
  const badge = document.getElementById('info-floor-badge');
  const title = document.getElementById('info-floor-title');
  const desc = document.getElementById('info-floor-desc');
  const statHeight = document.getElementById('info-stat-height');
  const statCap = document.getElementById('info-stat-cap');
  const statFeat = document.getElementById('info-stat-feat');
  const videoBtn = document.getElementById('info-video-btn');

  function activateFloor(floorKey, layerEl) {
    layers.forEach(l => l.classList.remove('active'));
    if (layerEl) layerEl.classList.add('active');

    const data = floorData[floorKey];
    if (!data) return;

    if (badge) badge.innerText = data.badge;
    if (title) title.innerText = data.title;
    if (desc) desc.innerText = data.desc;
    if (statHeight) statHeight.innerText = data.height;
    if (statCap) statCap.innerText = data.capacity;
    if (statFeat) statFeat.innerText = data.feature;

    if (videoBtn) {
      videoBtn.setAttribute('data-time', data.time);
    }
  }

  layers.forEach(layer => {
    const floorKey = layer.getAttribute('data-floor');

    layer.addEventListener('click', () => {
      activateFloor(floorKey, layer);
    });

    layer.addEventListener('mouseenter', () => {
      activateFloor(floorKey, layer);
    });
  });

  // Default active floor (Rooftop)
  const defaultLayer = document.querySelector('.stack-layer[data-floor="rooftop"]');
  if (defaultLayer) activateFloor('rooftop', defaultLayer);
}

/* ==========================================================================
   AMENITY TAB SWITCHER
   ========================================================================== */
function initAmenityTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(`tab-${targetId}`);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

/* ==========================================================================
   HEADER NAVIGATION & SCROLL HIGHLIGHT
   ========================================================================== */
function initHeaderNav() {
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const heroSection = document.getElementById('hero');

  // Mobile Nav Drawer Toggle
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('mobile-open');
      if (iconOpen && iconClose) {
        if (isOpen) {
          iconOpen.classList.add('hidden');
          iconClose.classList.remove('hidden');
        } else {
          iconOpen.classList.remove('hidden');
          iconClose.classList.add('hidden');
        }
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        if (iconOpen && iconClose) {
          iconOpen.classList.remove('hidden');
          iconClose.classList.add('hidden');
        }
      });
    });
  }

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

    // 1. Full Immersive Header Auto-Hide / Tint logic
    if (currentScrollY > heroHeight - 80) {
      // Past Hero Section:
      if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
        // Scrolling DOWN -> Hide Header completely for immersive view
        header.classList.add('nav-hidden');
        header.classList.remove('header-tint');
      } else if (lastScrollY - currentScrollY > 6) {
        // Scrolling UP -> Reveal Header with Luxurious Frosted Tint
        header.classList.remove('nav-hidden');
        header.classList.add('header-tint');
      }
    } else {
      // Inside Hero Section -> Transparent Header
      header.classList.remove('nav-hidden');
      header.classList.remove('header-tint');
    }

    lastScrollY = currentScrollY;

    // 2. Active Section Highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   VIP BOOKING MODAL
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('booking-modal');
  const openBtns = document.querySelectorAll('.open-booking-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const resetBtn = document.getElementById('reset-booking-btn');
  const form = document.getElementById('booking-form');
  const successBox = document.getElementById('booking-success');

  function openModal() {
    if (modal) modal.classList.add('active');
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
    setTimeout(() => {
      if (form) form.reset();
      if (form) form.classList.remove('hidden');
      if (successBox) successBox.classList.add('hidden');
    }, 400);
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (resetBtn) resetBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.classList.add('hidden');
      if (successBox) successBox.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    });
  }
}

/* ==========================================================================
   SOUND PLAYER
   ========================================================================== */
function initAudioPlayer() {
  const audio = document.getElementById('ambient-audio');
  const audioBtn = document.getElementById('audio-toggle');
  const iconOff = document.getElementById('sound-icon-off');
  const iconOn = document.getElementById('sound-icon-on');
  const wave = document.querySelector('.sound-wave');

  if (!audio || !audioBtn) return;

  let isPlaying = false;

  audioBtn.addEventListener('click', () => {
    if (!isPlaying) {
      audio.play().then(() => {
        isPlaying = true;
        if (iconOff) iconOff.classList.add('hidden');
        if (iconOn) iconOn.classList.remove('hidden');
        if (wave) wave.style.display = 'flex';
      }).catch(err => console.log('Audio autoplay prevented:', err));
    } else {
      audio.pause();
      isPlaying = false;
      if (iconOff) iconOff.classList.remove('hidden');
      if (iconOn) iconOn.classList.add('hidden');
      if (wave) wave.style.display = 'none';
    }
  });
}
