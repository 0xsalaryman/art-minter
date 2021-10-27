let seed = generateSeedFromTokenData(tokenData);
const rng = rnd,
  cube_scene = { cubedimX: 5, cubedimY: 5, cubedimZ: 5, mag: 8, tx: 0, ty: 0 },
  edge_scene = {
    cubedimX: 12,
    cubedimY: 12,
    cubedimZ: 12,
    mag: 12,
    tx: 0,
    ty: 0,
  },
  landscape_scene = {
    cubedimX: 30,
    cubedimY: 0,
    cubedimZ: 30,
    mag: 12,
    tx: 0,
    ty: 900,
  },
  pattern_layout = {
    outerSize: 1,
    minGridSize: 5,
    innerSize: 0.78,
    nonempty: !0,
    name: "pattern",
  },
  balance_layout = {
    outerSize: 0.96,
    minGridSize: 4,
    innerSize: 0.8,
    nonempty: !1,
    name: "balance",
  },
  chaos_layout = {
    outerSize: 0.92,
    minGridSize: 6,
    innerSize: 0.7,
    nonempty: !1,
    name: "chaos",
  },
  layout = w_pick([chaos_layout, balance_layout, pattern_layout], [1, 4, 2]),
  shades = [
    [1, 1],
    [1, 0],
    [0, 1],
    [0, 0],
    [0.15, 0],
    [0, 0.15],
  ],
  shadeOpacity = w_pick(shades, [5, 1, 1, 0.5, 1, 1]),
  shadeOpacityFront = shadeOpacity[0],
  shadeOpacityLeft = shadeOpacity[1],
  shadeOpacityTop = 0,
  is_bright = shadeOpacity[0] + shadeOpacity[1] < 1,
  opts =
    is_bright && rng() < 0.25
      ? rng() < 0.25
        ? cube_scene
        : edge_scene
      : landscape_scene,
  colorModes = ["group", "main", "single", "random"],
  colorMode = w_pick(colorModes, [4, 2, 1, 2]),
  palette = get_palette(),
  framed = rng() < 0.95,
  paletteShift = rangeFloor(0, palette.c.length),
  strokeCol = palette.s ? palette.s : "#000",
  bgCol = palette.b ? palette.b : "#eee",
  minGridSize = layout.minGridSize,
  sectionAppOpts = {
    simple: !0,
    extension_chance: layout.outerSize,
    horizontal_symmetry: !1,
    vertical_chance: 0.5,
    rng: rng,
  },
  atomAppOpts = {
    simple: !0,
    extension_chance: layout.innerSize,
    horizontal_symmetry: !1,
    vertical_chance: 0.5,
    color_mode: colorMode,
    group_size: 0.4,
    colors: [...Array(1e3).keys()],
    nonempty: layout.nonempty,
    rng: rng,
  },
  dim = Math.min(window.innerWidth, window.innerHeight),
  scale = dim / 1e3,
  cubedimX = opts.cubedimX,
  cubedimY = opts.cubedimY,
  cubedimZ = opts.cubedimZ,
  tx = opts.tx * scale,
  ty = opts.ty * scale,
  xr = (-1 * Math.PI) / 6,
  yr = (3 * Math.PI) / 6,
  zr = (1 * Math.PI) / 6,
  mag = opts.mag * scale,
  xu = [Math.cos(xr) * mag, Math.sin(xr) * mag],
  yu = [Math.cos(yr) * mag, Math.sin(yr) * mag],
  zu = [Math.cos(zr) * mag, Math.sin(zr) * mag],
  nxu = xu.map((e) => -e),
  nyu = yu.map((e) => -e),
  nzu = zu.map((e) => -e),
  maxDepth = 1.5,
  depthSteps = 8,
  outerStrokeWeight = 3 * scale,
  innerStrokeWeight = 1.5 * scale,
  borderWidth = 50 * scale;
let frontLayout, leftLayout, topLayout;
function setup() {
  createCanvas(1e3 * scale, 1e3 * scale),
    smooth(),
    strokeJoin(ROUND),
    reset(),
    displayLayout(),
    framed && displayBorder(borderWidth);
}
function reset() {
  const e = new Apparatus(cubedimX, cubedimY, sectionAppOpts),
    t = new Apparatus(cubedimY, cubedimZ, sectionAppOpts),
    n = new Apparatus(cubedimZ, cubedimX, sectionAppOpts),
    a = e.generate(null, null, !0),
    r = t.generate(
      a[1].map((e) => ({ ...e[1], v: e[1].h })),
      null,
      !0
    ),
    o = n.generate(
      r[1].map((e) => ({ ...e[1], v: e[1].h })),
      a[1][1].map((e) => ({ ...e, h: e.v })),
      !0
    ),
    c = a[0].map((e) => createGrid(e, null, null)),
    i = r[0].map((e) => createGrid(e, c, null)),
    s = o[0].map((e) => createGrid(e, i, c));
  (frontLayout = get_overlap_graph(c.flatMap((e) => e.content))),
    (leftLayout = get_overlap_graph(i.flatMap((e) => e.content))),
    (topLayout = get_overlap_graph(s.flatMap((e) => e.content)));
}
function displayBorder(e) {
  fill(bgCol),
    strokeWeight(outerStrokeWeight),
    stroke(strokeCol),
    strokeJoin(MITER),
    beginShape(),
    vertex(-e, -e),
    vertex(width + e, -e),
    vertex(width + e, height + e),
    vertex(-e, height + e),
    beginContour(),
    vertex(e, e),
    vertex(e, height - e),
    vertex(width - e, height - e),
    vertex(width - e, e),
    endContour(),
    endShape(CLOSE);
}
function displayLayout() {
  push(), translate(tx + width / 2, ty + height / 2), background(bgCol);
  const e = shadeOpacityFront,
    t = shadeOpacityLeft,
    n = shadeOpacityTop;
  frontLayout.forEach((a) => displayBox(a, xu, yu, zu, [e, t, n], !0, !0)),
    leftLayout.forEach((a) => displayBox(a, yu, nzu, nxu, [t, n, e], !1, !0)),
    topLayout.forEach((a) => displayBox(a, nzu, xu, nyu, [n, e, t], !1, !1)),
    pop();
}
function displayBox(e, t, n, a, r, o, c) {
  display(e, t, n, a, maxDepth, r, palette.c, paletteShift, strokeCol, o, c);
}
function createGrid(e, t, n) {
  const { x1: a, y1: r, w: o, h: c } = e,
    i = t && 1 == r ? t.filter((e) => 1 == e.x1 && e.y1 == a)[0] : null,
    s = n && 1 == a ? n.filter((e) => 1 == e.y1 && e.x1 == r)[0] : null,
    d = i ? i.rows : Math.ceil((rng() * o) / minGridSize),
    f = s ? s.cols : Math.ceil((rng() * c) / minGridSize),
    l = o / d,
    h = c / f,
    u = i ? i.apparatus.map((e) => ({ ...e[1], v: e[1].h })) : null,
    p = s ? s.apparatus[1].map((e) => ({ ...e, h: e.v })) : null,
    b = createApparatus(l, h, u, p);
  let g = [];
  for (let e = 0; e < f; e++)
    for (let t = 0; t < d; t++) {
      const n = b[0].map((n) => {
        const o = a + n.x1 + t * l - 1,
          c = r + n.y1 + e * h - 1;
        let d =
            i && 0 == e && c <= 0
              ? i.content.filter((e) => e.x1 <= 0 && Math.max(e.y1, 0) == o)[0]
                  .z1
              : 0,
          f =
            s && 0 == t && o <= 0
              ? s.content.filter((e) => e.y1 <= 0 && Math.max(e.x1, 0) == c)[0]
                  .z1
              : 0;
        return {
          ...n,
          x1: o,
          y1: c,
          w: n.w,
          h: n.h,
          x_off: f,
          y_off: d,
          level: 2,
          filled: !0,
        };
      });
      g = g.concat(n);
    }
  return { x1: a, y1: r, cols: d, rows: f, apparatus: b[1], content: g };
}
function createApparatus(e, t, n, a) {
  const r = Math.round(e, 0),
    o = Math.round(t, 0),
    c = e / r,
    i = t / o,
    s = new Apparatus((r - 11) / 2, (o - 11) / 2, atomAppOpts).generate(
      n,
      a,
      !0,
      atomAppOpts.nonempty
    );
  return (
    (s[0] = s[0].map((e) => ({
      x1: (e.x1 - 1) * c,
      y1: (e.y1 - 1) * i,
      z1: 0.1 + Math.floor(rng() * depthSteps) / depthSteps,
      w: e.w * c,
      h: e.h * i,
      col: e.col,
    }))),
    s
  );
}
function overlaps(e, t) {
  const n = [e.x1 + e.w, e.y1],
    a = [e.x1, e.y1 + e.h],
    r = [e.x1, e.y1],
    o = [t.x1 + t.w, t.y1],
    c = [t.x1, t.y1 + t.h],
    i = [t.x1, t.y1];
  return (
    !(e.y1 + 0.005 >= t.y1 + t.h || e.x1 + 0.005 >= t.x1 + t.w) &&
    (r[1] - r[0] < i[1] - i[0]
      ? !(a[1] - a[0] <= o[1] - o[0]) && a[1] + a[0] < o[1] + o[0]
      : r[1] - r[0] > i[1] - i[0]
      ? !(n[1] - n[0] >= c[1] - c[0]) && n[1] + n[0] < c[1] + c[0]
      : r[1] + r[0] < i[1] + i[0])
  );
}
function get_overlap_graph(e) {
  const t = [];
  e.forEach((e, n) => t.push(n));
  const n = [];
  return (
    e.forEach((t, a) => {
      e.forEach((e, r) => {
        overlaps(t, e) && n.push([a, r, t, e]);
      });
    }),
    toposort1(n)
      .reverse()
      .map((t) => e[t])
  );
}
class Apparatus {
  constructor(
    e,
    t,
    {
      initiate_chance: n = 0.8,
      extension_chance: a = 0.8,
      vertical_chance: r = 0.8,
      horizontal_symmetry: o = !0,
      vertical_symmetry: c = !1,
      roundness: i = 0.1,
      solidness: s = 0.5,
      colors: d = [],
      color_mode: f = "group",
      group_size: l = 0.8,
      simple: h = !1,
      simplex: u = null,
      rate_of_change: p = 0.01,
      rng: b = null,
    } = {}
  ) {
    (this.xdim = Math.round(2 * e + 11, 0)),
      (this.ydim = Math.round(2 * t + 11, 0)),
      (this.radius_x = e),
      (this.radius_y = t),
      (this.chance_new = n),
      (this.chance_extend = a),
      (this.chance_vertical = r),
      (this.colors = d),
      (this.color_mode = f),
      (this.group_size = l),
      (this.h_symmetric = o),
      (this.v_symmetric = c),
      (this.roundness = i),
      (this.solidness = s),
      (this.simple = h),
      (this.simplex = u),
      (this.rate_of_change = p),
      (this.rng = b);
  }
  generate(e = null, t = null, n = !1, a = !1, r = 0, o = 0) {
    (this.idx = r),
      (this.idy = o),
      (this.main_color = this.get_random(this.colors)),
      (this.id_counter = 0),
      (this.nonempty = a),
      (this.guaranteed_top = Math.floor(this.rng() * (this.xdim - 2)) + 2),
      (this.guaranteed_left = Math.floor(this.rng() * (this.ydim - 2)) + 2);
    let c = new Array(this.ydim + 1);
    for (var i = 0; i < c.length; i++) {
      c[i] = new Array(this.xdim + 1);
      for (var s = 0; s < c[i].length; s++)
        c[i][s] =
          0 == i || 0 == s
            ? { h: !1, v: !1, in: !1, col: null }
            : 1 == i && null != e
            ? { ...e[s], h: !0 }
            : 1 == s && null != t
            ? { ...t[i], v: !0 }
            : this.next_block(s, i, c[i][s - 1], c[i - 1][s]);
    }
    let d = linegrid_to_rects(c);
    return n ? [d, c] : d;
  }
  next_block(e, t, n, a) {
    const r = this;
    if (!n.in && !a.in) return i();
    if (n.in && !a.in)
      return n.h
        ? (function (e, t) {
            return s(e, t)
              ? { v: !1, h: !0, in: !0, col: n.col, id: n.id }
              : o(e, t);
          })(e, t)
        : o(e, t);
    if (!n.in && a.in)
      return a.v
        ? (function (e, t) {
            return s(e, t)
              ? { v: !0, h: !1, in: !0, col: a.col, id: a.id }
              : c(e, t);
          })(e, t)
        : c(e, t);
    if (n.in && a.in)
      return n.h || a.v
        ? n.h && !a.v
          ? (function (e, t) {
              return s(e, t)
                ? { v: !1, h: !0, in: !0, col: n.col, id: n.id }
                : i();
            })(e, t)
          : !n.h && a.v
          ? (function (e, t) {
              return s(e, t)
                ? { v: !0, h: !1, in: !0, col: a.col, id: a.id }
                : i();
            })(e, t)
          : r.rng() <= r.chance_vertical
          ? { v: !0, h: !1, in: !0, col: a.col, id: a.id }
          : { v: !1, h: !0, in: !0, col: n.col, id: n.id }
        : { v: !1, h: !1, in: !0, col: n.col, id: n.id };
    function o(e, t) {
      return i();
    }
    function c(e, t) {
      return i();
    }
    function i() {
      let e;
      if ("random" === r.color_mode) e = r.get_random(r.colors);
      else if ("main" === r.color_mode)
        e = r.rng() > 0.75 ? r.get_random(r.colors) : r.main_color;
      else if ("group" === r.color_mode) {
        let t = r.rng() > 0.5 ? n.col : a.col;
        (r.main_color =
          r.rng() > r.group_size ? r.get_random(r.colors) : t || r.main_color),
          (e = r.main_color);
      } else e = r.main_color;
      return { v: !0, h: !0, in: !0, col: e, id: r.id_counter++ };
    }
    function s(e, t) {
      return (
        (!r.nonempty || 1 != t || e != r.guaranteed_top) &&
        (!r.nonempty || 1 != e || t != r.guaranteed_left) &&
        !(
          !(function (e, t, n) {
            let a = 1 + r.rng() * n,
              o = Math.pow(e - r.xdim / 2, 2) / Math.pow(r.radius_x * a, 2),
              c = Math.pow(t - r.ydim / 2, 2) / Math.pow(r.radius_y * a, 2);
            return o + c < 1;
          })(e, t, 1 - r.roundness) && !r.simple
        ) &&
        r.rng() <= r.chance_extend
      );
    }
  }
  get_random(e) {
    return e[Math.floor(this.rng() * e.length)];
  }
}
function linegrid_to_rects(e) {
  let t = get_nw_corners(e);
  return corners_to_rects(t, e), t;
}
function get_nw_corners(e) {
  let t = [];
  for (let n = 0; n < e.length; n++)
    for (let a = 0; a < e[n].length; a++) {
      let r = e[n][a];
      r.h && r.v && r.in && t.push({ x1: a, y1: n, col: r.col, id: r.id });
    }
  return t;
}
function corners_to_rects(e, t) {
  e.map((e) => {
    let n = 1;
    for (; e.x1 + n < t[e.y1].length && !t[e.y1][e.x1 + n].v; ) n++;
    let a = 1;
    for (; e.y1 + a < t.length && !t[e.y1 + a][e.x1].h; ) a++;
    return (e.w = n), (e.h = a), e;
  });
}
function display(e, t, n, a, r, o, c, i, s, d, f) {
  const l = e.x1 - e.x_off * r,
    h = e.y1 - e.y_off * r,
    u = e.w + e.x_off * r,
    p = e.h + e.y_off * r,
    b = e.z1 * r;
  let g = c.slice(i).concat(c.slice(0, i));
  fill(g[e.col % g.length]), noStroke(), y(), _(), x();
  let m = color(s);
  function y() {
    beginShape(),
      vertex(...w(l, h, b)),
      vertex(...w(l + u, h, b)),
      vertex(...w(l + u, h + p, b)),
      vertex(...w(l, h + p, b)),
      endShape();
  }
  function _() {
    beginShape(),
      vertex(...w(l, h, b)),
      vertex(...w(l, h + p, b)),
      vertex(...w(l, h + p, 0)),
      vertex(...w(l, h, 0)),
      endShape();
  }
  function x() {
    beginShape(),
      vertex(...w(l + u, h, b)),
      vertex(...w(l + u, h, 0)),
      vertex(...w(l, h, 0)),
      vertex(...w(l, h, b)),
      endShape();
  }
  function w(e, r, o) {
    const c = [e * t[0] + r * n[0], e * t[1] + r * n[1]],
      i = [e * t[0] + o * a[0], e * t[1] + o * a[1]],
      s = [r * n[0] + o * a[0], r * n[1] + o * a[1]];
    return [c[0] + i[0] + s[0], c[1] + i[1] + s[1]];
  }
  m.setAlpha(255 * o[0]),
    fill(m),
    y(),
    m.setAlpha(255 * o[1]),
    fill(m),
    _(),
    m.setAlpha(255 * o[2]),
    fill(m),
    x(),
    noFill(),
    stroke(s),
    strokeWeight(innerStrokeWeight),
    (0 === e.x1 && f) ||
      (0 === e.y1 && d) ||
      line(...w(l, h, b), ...w(l, h, 0)),
    (0 === e.x1 && f) || line(...w(l, h, b), ...w(l, h + p, b)),
    (0 === e.y1 && d) || line(...w(l, h, b), ...w(l + u, h, b)),
    strokeWeight(outerStrokeWeight),
    beginShape(),
    vertex(...w(l + u, h, 0)),
    vertex(...w(l + u, h, b)),
    vertex(...w(l + u, h + p, b)),
    vertex(...w(l, h + p, b)),
    vertex(...w(l, h + p, 0)),
    endShape();
}
function toposort1(e) {
  return toposort(uniqueNodes(e), e);
}
function toposort(e, t) {
  for (
    var n = e.length,
      a = new Array(n),
      r = {},
      o = n,
      c = makeOutgoingEdges(t),
      i = makeNodesHash(e);
    o--;

  )
    r[o] || s(e[o], o, new Set());
  return a;
  function s(e, t, o) {
    if (o.has(e))
      try {
        ", node was:" + JSON.stringify(e);
      } catch (e) {
        ("");
      }
    if (!r[t]) {
      r[t] = !0;
      var d = c.get(e) || new Set();
      if ((t = (d = Array.from(d)).length)) {
        o.add(e);
        do {
          var f = d[--t];
          s(f, i.get(f), o);
        } while (t);
        o.delete(e);
      }
      a[--n] = e;
    }
  }
}
function uniqueNodes(e) {
  for (var t = new Set(), n = 0, a = e.length; n < a; n++) {
    var r = e[n];
    t.add(r[0]), t.add(r[1]);
  }
  return Array.from(t);
}
function makeOutgoingEdges(e) {
  for (var t = new Map(), n = 0, a = e.length; n < a; n++) {
    var r = e[n];
    t.has(r[0]) || t.set(r[0], new Set()),
      t.has(r[1]) || t.set(r[1], new Set()),
      t.get(r[0]).add(r[1]);
  }
  return t;
}
function makeNodesHash(e) {
  for (var t = new Map(), n = 0, a = e.length; n < a; n++) t.set(e[n], n);
  return t;
}
function rnd() {
  (seed ^= seed << 13), (seed ^= seed >> 17);
  const e = (((seed ^= seed << 5) < 0 ? 1 + ~seed : seed) % 1e5) / 1e5;
  return 0 === e || 1 === e ? 0.5 : e;
}
function range(e, t) {
  return void 0 === t && ((t = e), (e = 0)), rng() * (t - e) + e;
}
function rangeFloor(e, t) {
  return Math.floor(range(e, t));
}
function pick(e) {
  if (0 !== e.length) return e[rangeFloor(0, e.length)];
}
function w_pick(e, t) {
  const n = t.reduce((e, t) => [...e, e[e.length - 1] + t], [0]),
    a = range(n[n.length - 1]);
  return e[n.findIndex((e) => e > a) - 1];
}
function generateSeedFromTokenData(e) {
  return parseInt(e.hash.slice(0, 16), 16);
}
function get_palette() {
  var e = [
    { c: ["#ff3931", "#007861", "#bab9a4"], s: "#311f27", b: "#ddd", w: 0.5 },
    {
      c: ["#f1594a", "#f5b50e", "#14a160", "#2969de", "#885fa4"],
      s: "#1a1a1a",
      b: "#e2e6e8",
      w: 2,
    },
    { c: ["#f2d002", "#f7f5e1", "#ec643b"], s: "#19080e", b: "#f7f5e1", w: 1 },
    {
      c: ["#ec2f28", "#f8cd28", "#1e95bb", "#fbaab3", "#fcefdf"],
      s: "#221e1f",
      b: "#fcefdf",
      w: 1,
    },
    {
      c: ["#ed555d", "#fffcc9", "#41b797", "#eda126", "#7b5770"],
      s: "#2d1922",
      b: "#2d1922",
      w: 2,
    },
    {
      c: ["#ff6936", "#fddc3f", "#0075ca", "#00bb70"],
      s: "#020202",
      b: "#020202",
      w: 0.2,
    },
    {
      c: ["#e16503", "#dc9a0f", "#dfe2b4", "#66a7a6"],
      s: "#3c1c03",
      b: "#3c1c03",
      w: 0.5,
    },
    { c: ["#ffce49", "#ede8dc", "#ff5736", "#ff99b4"], b: "#f7f4ed", w: 1 },
    { c: ["#553c60", "#ffb0a0", "#ff6749", "#fbe090"], b: "#f5e9de", w: 1 },
    { c: ["#ec6c26", "#613a53", "#e8ac52", "#639aa0"], b: "#d5cda1", w: 2 },
    { c: ["#f5736a", "#925951", "#feba4c", "#9d9b9d"], b: "#eedfa2", w: 1 },
    { c: ["#4bae8c", "#d0c1a0"], s: "#2d3538", b: "#d06440", w: 0.2 },
    {
      c: ["#ca3122", "#e5af16", "#4a93a2", "#0e7e39", "#e2b9bd"],
      s: "#1c1616",
      b: "#e3ded8",
      w: 1,
    },
    {
      c: ["#d24c23", "#7ba6bc", "#f0c667", "#ede2b3", "#672b35"],
      s: "#132a37",
      b: "#108266",
      w: 1,
    },
    {
      c: ["#e3937b", "#d93f1d", "#e6cca7"],
      s: "#090d15",
      b: "#558947",
      w: 0.2,
    },
    {
      c: ["#d03718", "#33762f", "#ead7c9", "#ce7028", "#689d8d"],
      s: "#292b36",
      b: "#deb330",
      w: 1,
    },
    {
      c: ["#de3f1a", "#de9232", "#007158", "#e6cdaf", "#869679"],
      s: "#010006",
      b: "#7aa5a6",
      w: 1,
    },
    {
      c: ["#4aad8b", "#e15147", "#f3b551", "#cec8b8", "#d1af84", "#544e47"],
      s: "#251c12",
      b: "#cfc7b9",
      w: 1,
    },
    { c: ["#50978e", "#f7f0df"], s: "#000", b: "#f7f0df", w: 1 },
    { c: ["#ee5d65", "#f0e5cb"], s: "#080708", b: "#f0e5cb", w: 1 },
    { c: ["#e5dfcf", "#e9b500"], s: "#151513", b: "#e9b500", w: 0.2 },
    {
      c: ["#ec5526", "#f4ac12", "#9ebbc1", "#f7f4e2"],
      s: "#1e1b1e",
      b: "#e7e8d4",
      w: 3,
    },
    {
      c: ["#eb5627", "#eebb20", "#4e9eb8", "#f7f5d0"],
      s: "#201d13",
      b: "#77c1c0",
      w: 3,
    },
    {
      c: ["#e95145", "#f8b917", "#b8bdc1", "#ffb2a2"],
      s: "#010101",
      b: "#6b7752",
      w: 1,
    },
    {
      c: ["#ff6555", "#ffb58f", "#d8eecf", "#8c4b47", "#bf7f93"],
      s: "#2b0404",
      b: "#ffda82",
      w: 1,
    },
    {
      c: ["#c92a28", "#e69301", "#1f8793", "#13652b", "#e7d8b0", "#e3b3ac"],
      s: "#1a1a1a",
      b: "#f0f0f2",
      w: 1,
    },
    {
      c: ["#475b62", "#7a999c", "#fbaf3c", "#df4a33", "#f0e0c6", "#af592c"],
      s: "#2a1f1d",
      b: "#f0e0c6",
      w: 1,
    },
    {
      c: ["#e85b30", "#ef9e28", "#c6ac71", "#e0c191", "#3f6279", "#ee854e"],
      s: "#180305",
      b: "#ede4cb",
      w: 1,
    },
    {
      c: ["#99cb9f", "#cfb610", "#d00701", "#dba78d", "#bfbea2", "#d2cfaf"],
      s: "#332e22",
      b: "#e3e2c5",
      w: 1,
    },
    {
      c: [
        "#f14d42",
        "#f4fdec",
        "#4fbe5d",
        "#265487",
        "#f6e916",
        "#f9a087",
        "#2e99d6",
      ],
      s: "#141414",
      b: "#f4fdec",
      w: 0.5,
    },
    {
      c: ["#f4b232", "#f2dbbd", "#01799c", "#e93e48", "#006748", "#ed817d"],
      s: "#050505",
      b: "#f0dbbc",
      w: 0.1,
    },
    {
      c: ["#5399b1", "#f4e9d5", "#de4037", "#ed942f", "#4e9e48"],
      s: "#3d352b",
      b: "#f0c328",
      w: 3,
    },
    {
      c: [
        "#FBF5E9",
        "#FF514E",
        "#FDBC2E",
        "#4561CC",
        "#2A303E",
        "#6CC283",
        "#238DA5",
        "#9BD7CB",
      ],
      s: "#000",
      b: "#FBF5E9",
      w: 2,
    },
    {
      c: [
        "#ff7a5a",
        "#765aa6",
        "#fee7bc",
        "#515e8c",
        "#ffc64a",
        "#b460a6",
        "#fff",
        "#4781c1",
      ],
      s: "#000",
      b: "#abe9e8",
      w: 1,
    },
    {
      c: ["#ae5d9d", "#f1e8bc", "#ef8fa3", "#f7c047", "#58c9ed", "#f77150"],
      s: "#000",
      b: "#00ae83",
      w: 1,
    },
    {
      c: ["#ea663f", "#f9cc27", "#84afd7", "#7ca994", "#f1bbc9"],
      s: "#2a2a2a",
      b: "#f5f6f1",
      w: 1,
    },
    { c: ["#ea5b19", "#f8c9b9", "#137661"], s: "#2a2a2a", b: "#f5f4f0", w: 1 },
    { c: ["#f4b232", "#f2dbbd"], s: "#050505", b: "#f0dbbc", w: 2 },
    { c: ["#f2dbbd", "#01799c"], s: "#050505", b: "#f0dbbc", w: 2 },
    { c: ["#f2dbbd", "#e93e48"], s: "#050505", b: "#f0dbbc", w: 2 },
    { c: ["#f2dbbd", "#006748"], s: "#050505", b: "#f0dbbc", w: 2 },
    { c: ["#f2dbbd", "#ed817d"], s: "#050505", b: "#f0dbbc", w: 2 },
  ];
  return w_pick(
    e,
    e.map((e) => e.w)
  );
}
