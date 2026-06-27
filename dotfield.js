/* ============================================================
   DotField — vanilla JS + Canvas port of the React DotField.
   Same logic: animation loop, mouse tracking, dot bulge physics,
   glow SVG follow, gradient fill. No React/JSX.

   Usage:
     new DotField('#hero', { ...options });

   Markup it expects inside the container (added as first children):
     <canvas id="dot-field-canvas"></canvas>
     <svg class="dot-field-glow">…radialGradient + circle…</svg>
   (If the canvas is missing it will be created.)
   ============================================================ */
(function () {
  'use strict';

  /* ---------- color helpers ---------- */
  function parseColor(str) {
    if (!str) return { r: 255, g: 255, b: 255, a: 1 };
    str = String(str).trim();
    if (str.charAt(0) === '#') {
      var hex = str.slice(1);
      if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      var n = parseInt(hex, 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
    }
    var m = str.match(/rgba?\(([^)]+)\)/i);
    if (m) {
      var p = m[1].split(',').map(function (s) { return parseFloat(s); });
      return { r: p[0] || 0, g: p[1] || 0, b: p[2] || 0, a: p[3] === undefined ? 1 : p[3] };
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  }
  function rgbaStr(c, aMul) {
    var a = c.a * (aMul === undefined ? 1 : aMul);
    return 'rgba(' + Math.round(c.r) + ',' + Math.round(c.g) + ',' + Math.round(c.b) + ',' + a + ')';
  }

  /* ---------- constructor ---------- */
  function DotField(target, options) {
    this.container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!this.container) { console.warn('DotField: container not found:', target); return; }

    var defaults = {
      dotRadius: 1.5,
      dotSpacing: 14,
      bulgeStrength: 40,
      glowRadius: 160,
      sparkle: false,
      waveAmplitude: 0,
      cursorRadius: 300,
      cursorForce: 0.1,
      bulgeOnly: false,
      gradientFrom: 'rgba(255,255,255,0.06)',
      gradientTo: 'rgba(255,255,255,0.02)',
      glowColor: '#080808',
      mobileBreakpoint: 700
    };
    this.opts = Object.assign({}, defaults, options || {});

    this.fromColor = parseColor(this.opts.gradientFrom);
    this.toColor = parseColor(this.opts.gradientTo);

    /* canvas */
    this.canvas = this.container.querySelector('#dot-field-canvas') ||
      this.container.querySelector('canvas');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'dot-field-canvas';
      this.container.insertBefore(this.canvas, this.container.firstChild);
    }
    this.ctx = this.canvas.getContext('2d');

    /* glow svg (optional) */
    this.glow = this.container.querySelector('.dot-field-glow');
    this.glowCircle = this.glow ? this.glow.querySelector('circle') : null;
    if (this.glow) {
      var stops = this.glow.querySelectorAll('stop');
      for (var s = 0; s < stops.length; s++) stops[s].setAttribute('stop-color', this.opts.glowColor);
      if (this.glowCircle) this.glowCircle.setAttribute('r', this.opts.glowRadius);
    }

    /* state */
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.dots = [];
    this.mouseX = -9999;
    this.mouseY = -9999;
    this.pointerActive = false;
    this.time = 0;
    this.last = 0;
    this.raf = null;

    this.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.mq = window.matchMedia('(max-width:' + this.opts.mobileBreakpoint + 'px)');

    /* bind */
    this._onResize = this._onResize.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onLeave = this._onLeave.bind(this);
    this._tick = this._tick.bind(this);
    this._onBreakpoint = this._onBreakpoint.bind(this);

    this._init();
  }

  DotField.prototype._init = function () {
    window.addEventListener('resize', this._onResize, { passive: true });
    window.addEventListener('load', this._onResize, { passive: true });
    /* track on window so movement over hero content (z-index:1) still registers */
    window.addEventListener('pointermove', this._onMove, { passive: true });
    this.container.addEventListener('pointerleave', this._onLeave, { passive: true });

    if (this.mq.addEventListener) this.mq.addEventListener('change', this._onBreakpoint);
    else if (this.mq.addListener) this.mq.addListener(this._onBreakpoint);

    this._resize();
    this._applyMode();
  };

  /* mobile vs desktop vs reduced-motion */
  DotField.prototype._applyMode = function () {
    if (this.mq.matches) {
      /* mobile: cancel loop + hide canvas (battery, no mouse on touch) */
      this._stop();
      this.canvas.style.display = 'none';
      if (this.glow) this.glow.style.display = 'none';
      return;
    }
    this.canvas.style.display = '';
    if (this.glow) this.glow.style.display = '';
    this._resize();
    if (this.prefersReduced) {
      this._stop();
      this._drawStatic();
    } else {
      this._start();
    }
  };

  DotField.prototype._onBreakpoint = function () { this._applyMode(); };

  /* size canvas to container @ DPR + rebuild grid */
  DotField.prototype._resize = function () {
    var rect = this.container.getBoundingClientRect();
    this.width = Math.max(1, Math.floor(rect.width));
    this.height = Math.max(1, Math.floor(rect.height));
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this._buildDots();
  };

  DotField.prototype._onResize = function () {
    if (this.mq.matches) return;
    this._resize();
    if (this.prefersReduced) this._drawStatic();
  };

  DotField.prototype._buildDots = function () {
    var s = this.opts.dotSpacing;
    var cols = Math.floor(this.width / s);
    var rows = Math.floor(this.height / s);
    var offX = (this.width - cols * s) / 2 + s / 2;
    var offY = (this.height - rows * s) / 2 + s / 2;
    var dots = [];
    for (var j = 0; j <= rows; j++) {
      for (var i = 0; i <= cols; i++) {
        var x = offX + i * s;
        var y = offY + j * s;
        dots.push({ ox: x, oy: y, x: x, y: y, dx: 0, dy: 0, phase: i * 0.7 + j * 1.3 });
      }
    }
    this.dots = dots;

    /* vertical gradient fill: top = gradientFrom, bottom = gradientTo */
    var g = this.ctx.createLinearGradient(0, 0, 0, this.height);
    g.addColorStop(0, this.opts.gradientFrom);
    g.addColorStop(1, this.opts.gradientTo);
    this._fillGradient = g;
  };

  /* ---------- pointer ---------- */
  DotField.prototype._onMove = function (e) {
    var rect = this.container.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      this.pointerActive = false;
      if (this.glow) this.glow.classList.remove('is-active');
      return;
    }
    this.mouseX = x;
    this.mouseY = y;
    this.pointerActive = true;
    if (this.glowCircle) {
      this.glowCircle.setAttribute('cx', x);
      this.glowCircle.setAttribute('cy', y);
    }
    if (this.glow) this.glow.classList.add('is-active');
  };

  DotField.prototype._onLeave = function () {
    this.pointerActive = false;
    this.mouseX = -9999;
    this.mouseY = -9999;
    if (this.glow) this.glow.classList.remove('is-active');
  };

  /* ---------- loop ---------- */
  DotField.prototype._start = function () {
    if (this.raf) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this._tick);
  };
  DotField.prototype._stop = function () {
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
  };
  DotField.prototype._tick = function (now) {
    this.raf = requestAnimationFrame(this._tick);
    var dt = Math.min(40, now - this.last);
    this.last = now;
    this.time += dt * 0.001;
    this._update();
    this._render();
  };

  /* bulge physics: dots near the cursor are pushed outward, spring back */
  DotField.prototype._update = function () {
    var o = this.opts;
    var cr = o.cursorRadius;
    var cr2 = cr * cr;
    var force = o.cursorForce;
    var bulge = o.bulgeStrength;
    var wave = o.waveAmplitude;
    var active = this.pointerActive;
    var mx = this.mouseX, my = this.mouseY;
    var t = this.time;
    var dots = this.dots;

    for (var k = 0; k < dots.length; k++) {
      var d = dots[k];
      var tx = 0, ty = 0;

      /* idle wave (disabled when waveAmplitude === 0) */
      if (wave > 0 && !o.bulgeOnly) {
        ty += Math.sin(t * 1.5 + d.phase) * wave;
        tx += Math.cos(t * 1.2 + d.phase * 0.6) * wave * 0.5;
      }

      /* cursor bulge — push the dot away from the pointer */
      if (active) {
        var vx = d.ox - mx, vy = d.oy - my;
        var dist2 = vx * vx + vy * vy;
        if (dist2 < cr2 && dist2 > 0.0001) {
          var dist = Math.sqrt(dist2);
          var infl = 1 - dist / cr;     // 0..1, strongest at center
          infl = infl * infl;           // ease
          var push = infl * bulge;      // px outward
          tx += (vx / dist) * push;
          ty += (vy / dist) * push;
        }
      }

      /* spring toward target */
      d.dx += (tx - d.dx) * force;
      d.dy += (ty - d.dy) * force;
      d.x = d.ox + d.dx;
      d.y = d.oy + d.dy;
    }
  };

  DotField.prototype._render = function () {
    var ctx = this.ctx;
    var o = this.opts;
    ctx.clearRect(0, 0, this.width, this.height);

    var baseR = o.dotRadius;
    var active = this.pointerActive;
    var cr = o.cursorRadius;
    var mx = this.mouseX, my = this.mouseY;
    var dots = this.dots;

    /* gradient-filled dots in one batched path */
    ctx.fillStyle = this._fillGradient;
    ctx.beginPath();
    for (var k = 0; k < dots.length; k++) {
      var d = dots[k];
      var rad = baseR;
      if (active) {
        var vx = d.ox - mx, vy = d.oy - my;
        var dist = Math.sqrt(vx * vx + vy * vy);
        if (dist < cr) rad = baseR * (1 + (1 - dist / cr) * 0.9);
      }
      ctx.moveTo(d.x + rad, d.y);
      ctx.arc(d.x, d.y, rad, 0, Math.PI * 2);
    }
    ctx.fill();

    /* optional sparkle (disabled by default) */
    if (o.sparkle) {
      var t = this.time;
      ctx.fillStyle = rgbaStr(this.fromColor, 3.0);
      ctx.beginPath();
      for (var m = 0; m < dots.length; m += 7) {
        var dd = dots[m];
        var tw = Math.sin(t * 3 + dd.phase * 2.1);
        if (tw > 0.92) {
          ctx.moveTo(dd.x + baseR * 1.6, dd.y);
          ctx.arc(dd.x, dd.y, baseR * 1.6, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    }
  };

  DotField.prototype._drawStatic = function () {
    /* one frame at rest (no cursor) for reduced-motion users */
    this.pointerActive = false;
    this._update();
    this._render();
  };

  DotField.prototype.destroy = function () {
    this._stop();
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('load', this._onResize);
    window.removeEventListener('pointermove', this._onMove);
    this.container.removeEventListener('pointerleave', this._onLeave);
    if (this.mq.removeEventListener) this.mq.removeEventListener('change', this._onBreakpoint);
    else if (this.mq.removeListener) this.mq.removeListener(this._onBreakpoint);
  };

  window.DotField = DotField;
})();
