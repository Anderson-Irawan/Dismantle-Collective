// Hover debris, shared by every page.
//
// Matched to seq.halfof8.com (city style), studied frame by frame in a real
// browser and rebuilt in our own code. When a tile there is hit:
//   - Square blocks on the tile's grid (1x1 to 2x2 cells, some bars) pop in at
//     full size, a few at a time, each touching the tile or a block already
//     placed, so they build one clumpy cluster in the tile's colour.
//   - A few small dots pop in at nearby cell centres.
//   - Nothing moves. Everything holds for about a second, then fades out
//     evenly. The whole thing lasts about 1.6 s.
// Here the grid cell is half the hovered object's height, aligned to its
// edges, and everything is drawn behind the page content. The cluster always
// starts at the object: every block touches the object itself, nothing lands
// more than MAX_DEPTH cells out, and pieces gather where the pointer came in.
// Tried and removed on request: the cube roll, the press (shrink and regrow)
// and every other bounce, a blinking dissolve, rings of small pieces, a darker
// shade, and slabs that slid or flew (they did not feel like the reference).
//
// Tuned values, with the reason for each. Change only on request.
//   CELL = object height / 2, clamped CELL_MIN 8 to CELL_MAX 22 px: the
//     reference's grid cell is half a tile. The cap keeps big cards from
//     getting blocks bigger than a button.
//   STEP_MS 35: delay between pieces popping in, so the cluster builds outward
//     over ~0.15 s as in the reference.
//   HOLD_MS 900 to 1150, FADE_MS 450 to 600, linear: measured off the
//     reference (pieces solid at 0.4 s, half gone at 1.2 s, gone by 1.6 s).
//   BLEED 3 px: blocks that touch the object reach this far in under it, so
//     the join has no hairline gap (the cards sit on fractional pixels). 3
//     matches the cards' 3px outline, which hides the strip.
//   MAX_DEPTH 2 cells: the furthest any block or dot sits from the object.
//     Blocks used to chain off other blocks and dots sat up to 3 cells past
//     the chain, so debris often appeared far from the button (rejected).
//   Seeds: blocks start from the 6 to 24 object-touching cells nearest the
//     pointer, dots from the 9 to 21 nearest free cells, so on big cards the
//     cluster is where the hover happened, not spread round the whole card.
//   Colour: exactly the object's own colour (a darker shade was rejected).
//   REPLAY_MS 520: an object will not replay sooner than this (keyboard focus
//     and safety). Hover also has to leave the object before it can replay,
//     so moving around inside one card does not keep re-firing it.

(() => {
  const CELL_MIN = 8;
  const CELL_MAX = 22;
  const STEP_MS = 35;
  const BLEED = 3;
  const REPLAY_MS = 520;

  // Block shapes in cells [w, h], weighted toward the reference's squares.
  // (3x3 was dropped: it cannot fit within MAX_DEPTH.)
  const SHAPES = [[1, 1], [1, 1], [2, 2], [2, 2], [1, 2], [2, 1], [3, 1], [1, 3]];
  const MAX_DEPTH = 2;

  // What a hover can land on, and what then reacts as one object.
  const HOVER = 'a[href], button, [role="button"], summary';
  // No cubes on these, or on anything inside them. Logos tilt and social
  // icons change colour instead (css/styles.css); tickets have none (removed
  // on request).
  const NO_CUBES = '.nav__home, .footer__logo, .hero__social a, .ticket';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const rand = (lo, hi) => lo + Math.random() * (hi - lo);
  const randInt = (lo, hi) => Math.floor(rand(lo, hi + 1));
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  /* ----------------------------------------------------------------------
     Canvas: one fixed layer behind the page, drawn only while pieces live
     ---------------------------------------------------------------------- */
  const canvas = document.createElement('canvas');
  canvas.className = 'cube-fx';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let pieces = [];
  let frame = 0;
  let dpr = 1;

  // The canvas covers the visible page, which excludes the scrollbar. Sizing
  // it from window.innerWidth (scrollbar included) stretched every drawing
  // by the scrollbar's share, so debris drifted off objects further and
  // further toward the right of the page.
  const view = () => [document.documentElement.clientWidth, document.documentElement.clientHeight];

  function fitCanvas() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const [vw, vh] = view();
    const w = Math.round(vw * dpr);
    const h = Math.round(vh * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  // Cell index to on-screen position, for an object box and its grid. Cells
  // across the object are stretched slightly so the grid meets both of its
  // edges exactly.
  function gridOf(rect, g) {
    const { left: L, top: T, width: W, height: H } = rect;
    return {
      X: (i) => Math.round(i < 0 ? L + i * g.cell : i <= g.cols ? L + (i * W) / g.cols : L + W + (i - g.cols) * g.cell),
      Y: (j) => Math.round(j < 0 ? T + j * g.cell : j <= g.rows ? T + (j * H) / g.rows : T + H + (j - g.rows) * g.cell),
    };
  }

  function draw(now) {
    fitCanvas();
    const [vw, vh] = view();
    ctx.setTransform(canvas.width / vw, 0, 0, canvas.height / vh, 0, 0);
    ctx.clearRect(0, 0, vw, vh);
    pieces = pieces.filter((p) => now < p.dead && p.g.obj.isConnected);

    // Pieces are stored as grid cells of their object and placed from the
    // object's live box every frame, so they stay stuck to it even if the
    // page scrolls, resizes or reflows while they are up.
    const grids = new Map();
    for (const p of pieces) {
      if (now < p.born) continue;
      let grid = grids.get(p.g);
      if (!grid) {
        grid = gridOf(p.g.obj.getBoundingClientRect(), p.g);
        grids.set(p.g, grid);
      }
      const { X, Y } = grid;
      // Pops in at full size, holds, then fades out evenly. No motion.
      ctx.globalAlpha = now <= p.fade ? 1 : 1 - (now - p.fade) / (p.dead - p.fade);
      ctx.fillStyle = p.color;
      if (p.dot) {
        const cx = (X(p.i) + X(p.i + 1)) / 2;
        const cy = (Y(p.j) + Y(p.j + 1)) / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Reach in under the object wherever the block touches it.
        const x0 = X(p.i) - (p.bleed.l ? BLEED : 0);
        const y0 = Y(p.j) - (p.bleed.t ? BLEED : 0);
        const x1 = X(p.i + p.w) + (p.bleed.r ? BLEED : 0);
        const y1 = Y(p.j + p.h) + (p.bleed.b ? BLEED : 0);
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      }
    }
    ctx.globalAlpha = 1;
    frame = pieces.length ? requestAnimationFrame(draw) : 0;
  }

  /* ----------------------------------------------------------------------
     The cluster, built on a grid aligned to the object's edges
     ---------------------------------------------------------------------- */
  function burst(obj, color, origin) {
    const rect = obj.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    const cell = clamp(Math.round(Math.min(W, H) / 2), CELL_MIN, CELL_MAX);
    const cols = Math.max(1, Math.round(W / cell));
    const rows = Math.max(1, Math.round(H / cell));
    const g = { obj, cell, cols, rows };
    const { X, Y } = gridOf(rect, g);
    const ox = origin ? origin.x : rect.left + W / 2;
    const oy = origin ? origin.y : rect.top + H / 2;

    const taken = new Set();
    const key = (i, j) => `${i},${j}`;
    const isFree = (i, j) => !taken.has(key(i, j));
    // How many cells a cell sits outside the object (0 = inside).
    const depth = (i, j) => Math.max(i < 0 ? -i : i >= cols ? i - cols + 1 : 0, j < 0 ? -j : j >= rows ? j - rows + 1 : 0);
    // Distance from the hover point, so the cluster gathers where the
    // pointer came in (the middle, for keyboard focus).
    const away = ([i, j]) => Math.hypot((X(i) + X(i + 1)) / 2 - ox, (Y(j) + Y(j + 1)) / 2 - oy);
    const nearest = (cells, n) => cells.sort((a, b) => away(a) - away(b)).slice(0, n);

    // Every cell sharing an edge with the object (corners only touch at a
    // point, so they are left out).
    const touching = [];
    for (let i = 0; i < cols; i++) touching.push([i, -1], [i, rows]);
    for (let j = 0; j < rows; j++) touching.push([-1, j], [cols, j]);

    const start = performance.now();
    let order = 0;
    const add = (shape, dot) => {
      const born = start + order++ * STEP_MS + (dot ? 60 : 0);
      const fade = start + rand(900, 1150);
      pieces.push({ g, ...shape, dot, color, born, fade, dead: fade + rand(450, 600) });
    };

    // Blocks: each covers a cell touching the object, near the hover point,
    // stays within MAX_DEPTH cells of the object and overlaps nothing.
    const perimeterCells = 2 * (cols + rows);
    const blocks = clamp(Math.round(perimeterCells / 4), 3, 8);
    const seeds = nearest(touching, clamp(blocks * 3, 6, 24));
    for (let n = 0, tries = 0; n < blocks && tries < 60; tries++) {
      const [fi, fj] = pick(seeds);
      const [bw, bh] = pick(SHAPES);
      const i0 = fi - randInt(0, bw - 1);
      const j0 = fj - randInt(0, bh - 1);
      const cells = [];
      for (let i = i0; i < i0 + bw; i++) for (let j = j0; j < j0 + bh; j++) cells.push([i, j]);
      if (cells.some(([i, j]) => !isFree(i, j) || depth(i, j) < 1 || depth(i, j) > MAX_DEPTH)) continue;
      cells.forEach(([i, j]) => taken.add(key(i, j)));

      // Which sides touch the object (those reach in under it when drawn).
      const spansCols = i0 < cols && i0 + bw > 0;
      const spansRows = j0 < rows && j0 + bh > 0;
      const bleed = {
        b: spansCols && j0 + bh === 0,
        t: spansCols && j0 === rows,
        r: spansRows && i0 + bw === 0,
        l: spansRows && i0 === cols,
      };
      add({ i: i0, j: j0, w: bw, h: bh, bleed }, false);
      n++;
    }

    // Dots: centred in free cells within MAX_DEPTH cells of the object,
    // near the hover point.
    const size = Math.max(4, Math.round(cell * 0.35));
    const dots = clamp(Math.round(perimeterCells / 5), 3, 7);
    const around = [];
    for (let i = -MAX_DEPTH; i < cols + MAX_DEPTH; i++) {
      for (let j = -MAX_DEPTH; j < rows + MAX_DEPTH; j++) {
        if (depth(i, j) >= 1 && isFree(i, j)) around.push([i, j]);
      }
    }
    const near = nearest(around, clamp(dots * 3, 9, 21));
    for (let n = 0; n < dots && near.length; n++) {
      const [i, j] = near.splice(Math.floor(Math.random() * near.length), 1)[0];
      add({ i, j, size }, true);
    }

    if (!frame) frame = requestAnimationFrame(draw);
  }

  // Debris colour: an explicit --burst, else the element's own fill,
  // else its border, else its text colour.
  function burstColor(el) {
    const cs = getComputedStyle(el);
    const set = cs.getPropertyValue('--burst').trim();
    if (set) return set;
    // Only a solid fill counts: a see-through hover tint (the hero cards'
    // color-mix) is not the object's colour.
    const bg = solid(cs.backgroundColor);
    if (bg) return bg;
    if (parseFloat(cs.borderTopWidth) > 0) return solid(cs.borderTopColor) || cs.borderTopColor;
    return cs.color;
  }

  // The canvas normalises any CSS colour: fully opaque ones come back as
  // #rrggbb, see-through ones as rgba(), unparseable ones are ignored.
  function solid(color) {
    const probe = '#010203';
    ctx.fillStyle = probe;
    ctx.fillStyle = color;
    const out = ctx.fillStyle;
    return out.startsWith('#') && out !== probe ? out : null;
  }

  // While its cubes are up the object carries .cube-live, until they start
  // to fade (the earliest fade is at 900 ms). Outlined cards stay filled
  // through it (css/styles.css), so the cubes never hang off a bare outline.
  const liveTimers = new WeakMap();
  function play(obj, origin) {
    burst(obj, burstColor(obj), origin);
    clearTimeout(liveTimers.get(obj));
    obj.classList.add('cube-live');
    liveTimers.set(obj, setTimeout(() => obj.classList.remove('cube-live'), 900));
  }

  /* ----------------------------------------------------------------------
     Wiring. Plays when a mouse or pen moves onto an object, and when the
     keyboard focuses one. Touch has no hover, so taps stay plain.
     ---------------------------------------------------------------------- */
  const lastPlayed = new WeakMap();
  const armed = new Map(); // object -> its box in page coordinates while hovered

  const objectOf = (node) => {
    const hit = node instanceof Element ? node.closest(HOVER) : null;
    return hit && !hit.closest(NO_CUBES) ? hit : null;
  };

  function trigger(obj, origin) {
    if (reduceMotion.matches) return false;
    const now = performance.now();
    if (now - (lastPlayed.get(obj) || -Infinity) < REPLAY_MS) return false;
    lastPlayed.set(obj, now);
    play(obj, origin);
    return true;
  }

  document.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'touch') return;
    const obj = objectOf(e.target);
    if (!obj || armed.has(obj)) return;
    const r = obj.getBoundingClientRect();
    if (trigger(obj, { x: e.clientX, y: e.clientY })) {
      armed.set(obj, {
        l: r.left + window.scrollX,
        t: r.top + window.scrollY,
        r: r.right + window.scrollX,
        b: r.bottom + window.scrollY,
      });
    }
  }, { passive: true });

  // An object can only replay once the pointer has really left its box.
  document.addEventListener('pointermove', (e) => {
    if (!armed.size) return;
    for (const [obj, box] of armed) {
      if (e.pageX < box.l - 2 || e.pageX > box.r + 2 || e.pageY < box.t - 2 || e.pageY > box.b + 2) {
        armed.delete(obj);
      }
    }
  }, { passive: true });

  document.addEventListener('pointerout', (e) => {
    if (!e.relatedTarget) armed.clear(); // pointer left the window
  }, { passive: true });

  document.addEventListener('focusin', (e) => {
    const obj = objectOf(e.target);
    if (obj && e.target.matches(':focus-visible')) trigger(obj);
  });

  // Coming back with the Back button can restore a frozen mid-animation page.
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    pieces = [];
    armed.clear();
  });
})();
