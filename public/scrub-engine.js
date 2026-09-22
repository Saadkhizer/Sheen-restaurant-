/**
 * scroll-world scrub engine — portable, self-contained, framework-agnostic.
 *
 * Builds its own DOM and injects its own CSS into whatever container you hand it,
 * so it drops into plain HTML, Next.js, Vue, or a server-rendered page unchanged.
 *
 *   mountScrollWorld(document.getElementById('world'), { ...config })
 *
 * Config
 *   brand        { name }
 *   diveScroll   viewport-heights of scroll per section clip   (default 1.3)
 *   connScroll   viewport-heights per connector clip           (default 0.9)
 *   crossfade    fraction of a band spent blending to the next (default 0.08)
 *   sections[]   { id, label, still, stillMobile, clip, clipMobile,
 *                  scroll, linger, accent, eyebrow, title, body, tags[], cta }
 *   connectors[]       length = sections.length - 1, entries may be null
 *   connectorsMobile[] same length, optional
 *
 * CSS variables (set on :root or .sw-root to theme it)
 *   --sw-bg  --sw-ink  --sw-accent  --sw-font-display  --sw-font-body
 *
 * Why blobs: many static hosts don't serve HTTP byte-range requests, which pins
 * video.seekable to [0,0] and clamps every seek to frame 0 — the clip looks frozen.
 * Fetching each clip as a Blob and playing it from an object URL sidesteps that
 * entirely, and is why these files don't need to be all-intra.
 */
(function (global) {
  'use strict';

  var CSS = `
@layer sw {
  .sw-root {
    --sw-bg: #0b0b0c;
    --sw-ink: #f5eee6;
    --sw-accent: #f05728;
    --sw-font-display: "Playfair Display", Georgia, serif;
    --sw-font-body: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    position: relative;
    background: var(--sw-bg);
    color: var(--sw-ink);
  }
  .sw-stage {
    position: sticky; top: 0;
    height: 100svh; height: 100dvh;
    overflow: hidden;
    background: var(--sw-bg);
  }
  .sw-layer, .sw-poster {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 90ms linear;
    will-change: opacity;
  }
  .sw-layer.is-on, .sw-poster.is-on { opacity: 1; }
  .sw-poster { z-index: 2; transition: opacity 260ms ease; }
  .sw-scrim {
    position: absolute; inset: 0; z-index: 3; pointer-events: none;
    background:
      linear-gradient(to top, color-mix(in srgb, var(--sw-bg) 92%, transparent) 0%,
                      color-mix(in srgb, var(--sw-bg) 55%, transparent) 32%,
                      transparent 62%),
      radial-gradient(120% 80% at 50% 0%, transparent 40%,
                      color-mix(in srgb, var(--sw-bg) 70%, transparent) 100%);
  }
  .sw-copy {
    position: absolute; z-index: 4;
    left: max(24px, env(safe-area-inset-left));
    right: max(24px, env(safe-area-inset-right));
    bottom: calc(clamp(40px, 9vh, 96px) + env(safe-area-inset-bottom));
    max-width: 44rem;
    opacity: 0; transform: translateY(20px);
    transition: opacity 420ms ease, transform 420ms ease;
    pointer-events: none;
  }
  .sw-copy.is-on { opacity: 1; transform: none; pointer-events: auto; }
  .sw-eyebrow {
    font: 600 0.72rem/1 var(--sw-font-body);
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--sw-accent); margin: 0 0 0.9rem;
  }
  .sw-title {
    font: 400 clamp(2rem, 6.2vw, 4.1rem)/1.04 var(--sw-font-display);
    margin: 0 0 1rem; letter-spacing: -0.02em;
    text-shadow: 0 2px 40px color-mix(in srgb, var(--sw-bg) 80%, transparent);
  }
  .sw-body {
    font: 400 clamp(0.95rem, 1.6vw, 1.08rem)/1.65 var(--sw-font-body);
    margin: 0; max-width: 34rem;
    color: color-mix(in srgb, var(--sw-ink) 76%, transparent);
  }
  .sw-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1.3rem 0 0; padding: 0; list-style: none; }
  .sw-tags li {
    font: 500 0.72rem/1 var(--sw-font-body);
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: 0.5rem 0.85rem; border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--sw-ink) 22%, transparent);
    color: color-mix(in srgb, var(--sw-ink) 70%, transparent);
  }
  .sw-ctas { display: flex; flex-wrap: wrap; align-items: center; gap: 0.9rem; margin-top: 1.6rem; }
  .sw-cta {
    display: inline-block;
    font: 600 0.85rem/1 var(--sw-font-body); letter-spacing: 0.08em; text-transform: uppercase;
    padding: 1.05rem 2rem; border-radius: 999px;
    background: var(--sw-accent); color: #fff; text-decoration: none;
    transition: transform 240ms cubic-bezier(.16,1,.3,1), filter 240ms ease;
  }
  .sw-cta:hover { transform: translateY(-2px); filter: brightness(1.08); }
  .sw-cta--ghost {
    background: transparent;
    color: var(--sw-ink);
    border: 1px solid color-mix(in srgb, var(--sw-ink) 34%, transparent);
  }
  .sw-cta--ghost:hover {
    background: color-mix(in srgb, var(--sw-ink) 10%, transparent);
    filter: none;
  }
  .sw-rail {
    position: absolute; z-index: 4;
    right: max(20px, env(safe-area-inset-right));
    top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 0.85rem;
  }
  .sw-rail button {
    -webkit-appearance: none; appearance: none; border: 0; padding: 0;
    width: 8px; height: 8px; border-radius: 999px; cursor: pointer;
    background: color-mix(in srgb, var(--sw-ink) 26%, transparent);
    transition: background 300ms ease, height 300ms cubic-bezier(.16,1,.3,1);
  }
  .sw-rail button.is-on { background: var(--sw-accent); height: 26px; }
  .sw-brand {
    position: absolute; z-index: 4;
    top: max(22px, env(safe-area-inset-top));
    left: max(24px, env(safe-area-inset-left));
    font: 600 0.82rem/1 var(--sw-font-body);
    letter-spacing: 0.22em; text-transform: uppercase;
  }
  .sw-hint {
    position: absolute; z-index: 4; bottom: calc(18px + env(safe-area-inset-bottom));
    left: 50%; transform: translateX(-50%);
    font: 500 0.66rem/1 var(--sw-font-body); letter-spacing: 0.2em; text-transform: uppercase;
    color: color-mix(in srgb, var(--sw-ink) 45%, transparent);
    transition: opacity 400ms ease;
  }
  .sw-spacer { position: relative; }
  @media (max-width: 860px) {
    .sw-rail { display: none; }
    .sw-copy { max-width: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .sw-layer { display: none; }
    .sw-poster { opacity: 1; }
    .sw-copy { transition: none; }
  }
}`;

  function el(tag, cls, parent) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (parent) parent.appendChild(n);
    return n;
  }

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  /**
   * Remaps time inside a band so the camera settles mid-scene — exactly while the
   * copy peaks — then picks up again toward the seam. Seam frames are untouched:
   * f(0) = 0 and f(1) = 1 always, so continuity survives.
   */
  function linger(p, amount) {
    if (!amount) return p;
    var a = Math.min(Math.max(amount, 0), 0.6);
    return p + a * Math.sin(2 * Math.PI * p) / (2 * Math.PI);
  }

  function mountScrollWorld(host, cfg) {
    if (!host) throw new Error('mountScrollWorld: no container');

    if (!document.getElementById('sw-style')) {
      var st = document.createElement('style');
      st.id = 'sw-style';
      st.textContent = CSS;
      document.head.appendChild(st);
    }

    var sections = cfg.sections || [];
    if (!sections.length) throw new Error('mountScrollWorld: no sections');

    var connectors = cfg.connectors || [];
    var connectorsMobile = cfg.connectorsMobile || [];
    var diveScroll = cfg.diveScroll || 1.3;
    var connScroll = cfg.connScroll || 0.9;
    var fadeFrac = cfg.crossfade == null ? 0.08 : cfg.crossfade;

    var isTouch = matchMedia('(pointer: coarse)').matches || innerWidth <= 860;
    var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- build the ordered chain: clip, connector, clip, connector, …
    var chain = [];
    sections.forEach(function (s, i) {
      chain.push({
        kind: 'section',
        section: i,
        src: (isTouch && s.clipMobile) || s.clip,
        still: (isTouch && s.stillMobile) || s.still,
        bands: s.scroll || diveScroll,
        linger: s.linger || 0
      });
      var c = connectors[i];
      if (i < sections.length - 1 && c) {
        chain.push({
          kind: 'connector',
          section: i,
          src: (isTouch && connectorsMobile[i]) || c,
          still: null,
          bands: connScroll,
          linger: 0
        });
      }
    });

    var totalBands = chain.reduce(function (a, c) { return a + c.bands; }, 0);

    // ---- DOM
    host.classList.add('sw-root');
    host.innerHTML = '';
    var spacer = el('div', 'sw-spacer', host);
    var stage = el('div', 'sw-stage', spacer);

    chain.forEach(function (item) {
      var v = el('video', 'sw-layer', stage);
      v.muted = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');
      v.preload = 'none';
      v.loop = false;
      item.video = v;
      item.loaded = false;
      item.primed = false;
      item.painted = false;
      item.seeking = false;
      item.pending = null;
    });

    // Poster stills sit above the video until it actually paints a frame. iOS
    // Safari will not render a seeked frame on a video that has never played,
    // so without this the first scene is simply black.
    sections.forEach(function (s, i) {
      var img = el('img', 'sw-poster', stage);
      img.src = (isTouch && s.stillMobile) || s.still;
      img.alt = '';
      img.decoding = 'async';
      s._poster = img;
    });

    el('div', 'sw-scrim', stage);

    if (cfg.brand && cfg.brand.name) {
      el('div', 'sw-brand', stage).textContent = cfg.brand.name;
    }

    var copyNodes = sections.map(function (s) {
      var box = el('div', 'sw-copy', stage);
      if (s.eyebrow) el('p', 'sw-eyebrow', box).textContent = s.eyebrow;
      // titleTag lets the first scene carry the page's real <h1> when the
      // flight IS the hero. Everything else stays an <h2> — a page with six
      // <h1>s is worse for search than no cinematic at all.
      if (s.title) el(s.titleTag || 'h2', 'sw-title', box).innerHTML = s.title;
      if (s.body) el('p', 'sw-body', box).textContent = s.body;
      if (s.tags && s.tags.length) {
        var ul = el('ul', 'sw-tags', box);
        s.tags.forEach(function (t) { el('li', null, ul).textContent = t; });
      }
      // `cta` for one, `ctas` for several — a hero usually needs a primary
      // action and a quieter secondary one beside it.
      var actions = s.ctas || (s.cta ? [s.cta] : []);
      if (actions.length) {
        var row = el('div', 'sw-ctas', box);
        actions.forEach(function (c, i) {
          var a = el('a', 'sw-cta' + (i ? ' sw-cta--ghost' : ''), row);
          a.textContent = c.label;
          a.href = c.href || '#';
        });
      }
      return box;
    });

    // A rail of two dots tells the viewer nothing, so it is hidden on the short
    // blocks you get when one flight is split across a page. `rail: false`
    // forces it off regardless.
    var rail = el('div', 'sw-rail', stage);
    if (cfg.rail === false || sections.length < 3) rail.style.display = 'none';

    var dots = sections.map(function (s, i) {
      var b = el('button', null, rail);
      b.type = 'button';
      b.setAttribute('aria-label', s.label || 'Scene ' + (i + 1));
      b.addEventListener('click', function () {
        var before = 0;
        for (var k = 0; k < chain.length; k++) {
          if (chain[k].kind === 'section' && chain[k].section === i) break;
          before += chain[k].bands;
        }
        scrollTo({ top: (before / totalBands) * scrollRange() + spacerTop(), behavior: 'smooth' });
      });
      return b;
    });

    // Only the first block on a page should invite a scroll; repeating "Scroll"
    // at every mid-page block reads as a glitch. `hint: false` turns it off,
    // a string replaces the word.
    var hint = el('div', 'sw-hint', stage);
    hint.textContent = typeof cfg.hint === 'string' ? cfg.hint : 'Scroll';
    if (cfg.hint === false) hint.style.display = 'none';

    function vh() { return stage.clientHeight || innerHeight; }
    function spacerTop() { return spacer.offsetTop; }
    function scrollRange() { return spacer.offsetHeight - vh(); }

    function layout() {
      spacer.style.height = (totalBands * vh() + vh()) + 'px';
    }
    layout();

    // ---- clip loading: blobs, because byte-range support can't be assumed
    function load(item) {
      if (item.loaded || reduced) return;
      item.loaded = true;
      fetch(item.src)
        .then(function (r) {
          if (!r.ok) throw new Error(r.status + ' ' + item.src);
          return r.blob();
        })
        .then(function (b) {
          item.blobUrl = URL.createObjectURL(b);
          // The element starts at preload="none" so nothing is fetched before its
          // band is near. Once the blob is in hand it must flip to "auto": with
          // preload="none" the element never decodes, loadeddata never fires, and
          // the clip stays invisible behind its poster forever.
          item.video.preload = 'auto';
          item.video.src = item.blobUrl;
          item.video.load();
        })
        .catch(function (e) {
          item.loaded = false;
          console.warn('[scroll-world] clip failed, still remains:', e.message);
        });
    }

    chain.forEach(function (item) {
      // loadeddata is the primary signal; canplay covers browsers that reach a
      // decodable frame without firing loadeddata for a blob source.
      ['loadeddata', 'canplay'].forEach(function (ev) {
        item.video.addEventListener(ev, function () {
          item.painted = true;
          var s = sections[item.section];
          if (s && s._poster) s._poster.classList.remove('is-on');
          if (!raf) raf = requestAnimationFrame(render);
        });
      });
      item.video.addEventListener('seeked', function () {
        item.seeking = false;
        item.painted = true;
        if (item.pending != null) {
          var t = item.pending;
          item.pending = null;
          seek(item, t);
        }
      });
    });

    // Coalesced seeking. Queueing a new currentTime while the decoder is still
    // seeking is what makes a fast flick freeze the clip on a phone: the seeks
    // pile up and the decoder never catches the scroll. One in flight, one queued.
    function seek(item, t) {
      if (!item.video.duration || isNaN(item.video.duration)) return;
      var target = Math.min(Math.max(t, 0), item.video.duration - 0.03);
      if (item.seeking) { item.pending = target; return; }
      if (Math.abs(item.video.currentTime - target) < 0.012) return;
      item.seeking = true;
      try { item.video.currentTime = target; }
      catch (e) { item.seeking = false; }
    }

    // iOS: a muted video that has never played won't paint a seeked frame.
    function prime(item) {
      if (item.primed || reduced) return;
      item.primed = true;
      var p = item.video.play();
      if (p && p.then) p.then(function () { item.video.pause(); }).catch(function () {});
      else { try { item.video.pause(); } catch (e) {} }
    }

    var primeAll = function () {
      chain.forEach(prime);
      removeEventListener('touchstart', primeAll);
      removeEventListener('pointerdown', primeAll);
    };
    addEventListener('touchstart', primeAll, { passive: true, once: true });
    addEventListener('pointerdown', primeAll, { passive: true, once: true });

    // ---- scroll → time
    var smoothed = 0;
    var targetP = 0;
    var raf = null;
    var activeSection = -1;

    function readScroll() {
      var range = scrollRange();
      if (range <= 0) return 0;
      return clamp01((scrollY - spacerTop()) / range);
    }

    function render() {
      raf = null;
      var d = targetP - smoothed;
      smoothed += d * (isTouch ? 0.28 : 0.16);
      if (Math.abs(d) < 0.00004) smoothed = targetP;

      var pos = smoothed * totalBands;
      var acc = 0;
      var idx = 0;
      var local = 0;

      for (var i = 0; i < chain.length; i++) {
        if (pos <= acc + chain[i].bands || i === chain.length - 1) {
          idx = i;
          local = clamp01((pos - acc) / chain[i].bands);
          break;
        }
        acc += chain[i].bands;
      }

      var cur = chain[idx];
      var nxt = chain[idx + 1];

      // keep the neighbourhood warm, drop the rest
      [idx - 1, idx, idx + 1, idx + 2].forEach(function (k) {
        if (chain[k]) load(chain[k]);
      });

      chain.forEach(function (item, k) {
        var on = k === idx || (nxt && k === idx + 1 && local > 1 - fadeFrac);
        item.video.classList.toggle('is-on', !!on && item.painted);
      });

      if (cur.video.duration) {
        seek(cur, linger(local, cur.linger) * cur.video.duration);
      }
      // Pre-position the next clip on its first frame so the crossfade lands on
      // a matching image rather than on whatever frame it was left at.
      if (nxt && local > 1 - fadeFrac * 2 && nxt.video.duration) {
        seek(nxt, 0);
      }

      var sec = cur.section;
      if (sec !== activeSection) {
        activeSection = sec;
        copyNodes.forEach(function (n, i) { n.classList.toggle('is-on', i === sec); });
        dots.forEach(function (b, i) { b.classList.toggle('is-on', i === sec); });
        // A per-section accent must be reverted when the next section doesn't
        // set one, or the override leaks forward and every later section — the
        // CTA included — silently inherits a colour it never asked for.
        var accent = sections[sec] && sections[sec].accent;
        if (accent) host.style.setProperty('--sw-accent', accent);
        else host.style.removeProperty('--sw-accent');
      }

      // the poster hands over the moment its clip can paint
      sections.forEach(function (s, i) {
        if (!s._poster) return;
        var owner = chain[idx].section === i && chain[idx].kind === 'section';
        s._poster.classList.toggle('is-on', owner && !chain[idx].painted);
      });

      hint.style.opacity = smoothed > 0.02 ? 0 : 1;

      if (smoothed !== targetP) raf = requestAnimationFrame(render);
    }

    function onScroll() {
      targetP = readScroll();
      if (!raf) raf = requestAnimationFrame(render);
    }

    addEventListener('scroll', onScroll, { passive: true });

    // Mobile URL bars fire resize on every show/hide. Re-laying out there makes
    // the page jump under the user's thumb, so only a width change counts.
    var lastW = innerWidth;
    addEventListener('resize', function () {
      if (isTouch && innerWidth === lastW) return;
      lastW = innerWidth;
      layout();
      onScroll();
    });
    addEventListener('orientationchange', function () {
      setTimeout(function () { layout(); onScroll(); }, 120);
    });

    if (reduced) {
      sections.forEach(function (s) { if (s._poster) s._poster.classList.add('is-on'); });
      copyNodes[0].classList.add('is-on');
      dots[0].classList.add('is-on');
    } else {
      load(chain[0]);
      if (chain[1]) load(chain[1]);
    }

    onScroll();
    copyNodes[0].classList.add('is-on');
    dots[0].classList.add('is-on');
    if (sections[0] && sections[0]._poster) sections[0]._poster.classList.add('is-on');

    return {
      destroy: function () {
        removeEventListener('scroll', onScroll);
        chain.forEach(function (i) { if (i.blobUrl) URL.revokeObjectURL(i.blobUrl); });
        host.innerHTML = '';
      }
    };
  }

  global.mountScrollWorld = mountScrollWorld;
})(window);
