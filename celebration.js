(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let canvas, frame, started, previous;
  let particles = [];

  function stop() {
    cancelAnimationFrame(frame);
    canvas?.remove();
    canvas = null;
    particles = [];
  }

  window.stopWeddingConfetti = stop;
  window.launchWeddingConfetti = () => {
    stop();
    if (motion.matches || document.hidden) return;
    canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1000';
    const width = window.innerWidth, height = window.innerHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) { stop(); return; }
    ctx.scale(scale, scale);
    document.body.appendChild(canvas);
    const colors = ['#8B1A1A', '#C9A84C', '#E8A09A', '#D44B3E', '#F5D989'];
    particles = Array.from({ length: width < 600 ? 100 : 160 }, () => ({
      x: Math.random() * width, y: -20 - Math.random() * height * .6,
      speed: 110 + Math.random() * 150, drift: (Math.random() - .5) * 90,
      angle: Math.random() * Math.PI * 2, spin: (Math.random() - .5) * 7,
      size: 5 + Math.random() * 6, color: colors[Math.floor(Math.random() * colors.length)]
    }));
    started = previous = performance.now();
    function draw(now) {
      const elapsed = now - started;
      const dt = Math.min((now - previous) / 1000, .05);
      previous = now;
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = Math.max(0, Math.min(1, (4500 - elapsed) / 800));
      for (const p of particles) {
        p.y += p.speed * dt; p.x += p.drift * dt; p.angle += p.spin * dt;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .5);
        ctx.restore();
      }
      if (elapsed < 4500) frame = requestAnimationFrame(draw);
      else stop();
    }
    frame = requestAnimationFrame(draw);
  };
  motion.addEventListener('change', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
  window.addEventListener('resize', stop);
})();
