import * as THREE from "three";
import { headTexture, decalTexture } from "./textures";
import { decal, type Mats } from "./models";
import { buildRiggedCourier, hasCourierAsset } from "./courier-rig";

/* ------------------------------------------------------------------ */
/* Delivery courier                                                    */
/*                                                                     */
/* Every body part is a smooth lofted surface (elliptical cross-       */
/* sections along a spine) rather than a primitive: tapered limbs with */
/* muscle, a sculpted head with a nose, brow, lips and chin, hands     */
/* with fingers, a tucked polo, chinos and sneakers. ~1.80 m, faces    */
/* +X, origin between the feet. Joints are real groups so the gait     */
/* and the two-bone-IK carry stay scrub-exact.                         */
/* ------------------------------------------------------------------ */

type Sec = { y: number; rx: number; rz: number; ox?: number; oz?: number; n?: number };

/**
 * Loft elliptical (super-elliptical when n ≠ 2) rings along Y into one smooth,
 * capped mesh. rx is the half-extent along X (front/back), rz along Z (side to side).
 */
function loftGeometry(secs: Sec[], seg = 40) {
  const cols = seg + 1;
  const down = secs[secs.length - 1].y < secs[0].y; // limbs are lofted downward: flip the winding
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  secs.forEach((s, i) => {
    const e = 2 / (s.n ?? 2);
    for (let j = 0; j <= seg; j++) {
      const a = (j / seg) * Math.PI * 2;
      const c = Math.cos(a);
      const sn = Math.sin(a);
      pos.push((s.ox ?? 0) + s.rx * Math.sign(c) * Math.abs(c) ** e, s.y, (s.oz ?? 0) + s.rz * Math.sign(sn) * Math.abs(sn) ** e);
      uv.push(j / seg, i / (secs.length - 1));
    }
  });
  for (let i = 0; i < secs.length - 1; i++) {
    for (let j = 0; j < seg; j++) {
      const a = i * cols + j;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      if (down) idx.push(a, b, c, b, d, c);
      else idx.push(a, c, b, b, c, d);
    }
  }
  // flat caps on duplicated ring vertices so they never skew the side normals
  const cap = (ring: number, up: boolean) => {
    const s = secs[ring];
    const base = pos.length / 3;
    pos.push(s.ox ?? 0, s.y, s.oz ?? 0);
    uv.push(0.5, 0.5);
    for (let j = 0; j <= seg; j++) {
      const k = (ring * cols + j) * 3;
      pos.push(pos[k], pos[k + 1], pos[k + 2]);
      uv.push(j / seg, up ? 1 : 0);
    }
    for (let j = 0; j < seg; j++) {
      if (up !== down) idx.push(base, base + 2 + j, base + 1 + j);
      else idx.push(base, base + 1 + j, base + 2 + j);
    }
  };
  cap(0, false);
  cap(secs.length - 1, true);

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  // the ring seam is two vertices: give them one shared normal
  const nrm = g.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < secs.length; i++) {
    const a = i * cols;
    const b = a + seg;
    const x = nrm.getX(a) + nrm.getX(b);
    const y = nrm.getY(a) + nrm.getY(b);
    const z = nrm.getZ(a) + nrm.getZ(b);
    const l = Math.hypot(x, y, z) || 1;
    nrm.setXYZ(a, x / l, y / l, z / l);
    nrm.setXYZ(b, x / l, y / l, z / l);
  }
  return g;
}

function loft(parent: THREE.Object3D, mat: THREE.Material, secs: Sec[], seg = 40) {
  const m = new THREE.Mesh(loftGeometry(secs, seg), mat);
  parent.add(m);
  return m;
}

function ball(parent: THREE.Object3D, mat: THREE.Material, r: number, pos: [number, number, number], scale: [number, number, number] = [1, 1, 1]) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), mat);
  m.position.set(...pos);
  m.scale.set(...scale);
  parent.add(m);
  return m;
}

/* ------------------------------ textures ----------------------------- */

/** Soft diagonal cloth folds + a fine weave, used as a bump map so clothing isn't plastic. */
function foldBump(seed: number, strength: number) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 256, 256);
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  ctx.filter = "blur(5px)";
  for (let i = 0; i < 26; i++) {
    const x = r() * 256;
    const y = r() * 256;
    const len = 50 + r() * 90;
    const a = -0.9 + r() * 0.5;
    ctx.strokeStyle = r() > 0.5 ? `rgba(255,255,255,${strength})` : `rgba(0,0,0,${strength})`;
    ctx.lineWidth = 4 + r() * 8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    ctx.stroke();
  }
  ctx.filter = "none";
  ctx.globalAlpha = 0.025;
  for (let i = 0; i < 256; i += 2) {
    ctx.fillStyle = i % 4 ? "#fff" : "#000";
    ctx.fillRect(i, 0, 1, 256);
    ctx.fillRect(0, i, 256, 1);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

/* -------------------------------- head -------------------------------- */

const g2 = (v: number, s: number) => Math.exp(-((v / s) * (v / s)));
const sm = THREE.MathUtils.smoothstep;

/**
 * One continuous head: an ellipsoid pulled into a jaw and chin, with the nose,
 * brow ridge, eye sockets, lips and cheeks sculpted in. Face features are also
 * tinted per vertex (brows, lips, stubble) so no texture seams show.
 */
function buildHeadGeometry() {
  const A = 0.094, B = 0.112, C = 0.076;
  const g = new THREE.SphereGeometry(1, 96, 72);
  const p = g.attributes.position as THREE.BufferAttribute;
  const col = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    const ux = p.getX(i), uy = p.getY(i), uz = p.getZ(i);
    const hr = Math.hypot(ux, uz) || 1e-6;
    const fw = sm(ux / hr, 0.25, 0.8) * sm(hr, 0.12, 0.35); // faces forward
    const down = sm(-uy, -0.1, 0.95);
    const wz = (1 - 0.34 * down ** 1.3) * (1 + 0.05 * g2(uy + 0.45, 0.22));
    const wx = 1 - 0.1 * down ** 1.5;
    let x = ux * A * wx + 0.036 * sm(-uy, 0, 0.9) * fw; // lower face pushes forward into a chin
    const y = uy * B;
    const z = uz * C * wz;
    const az = Math.abs(z);
    let dx = 0;
    // nose: bridge, body, tip, nostril wings
    const nz = g2(z, 0.0095);
    dx += nz * (0.008 * g2(y - 0.02, 0.022) + 0.015 * g2(y + 0.01, 0.022) + 0.012 * g2(y + 0.034, 0.011));
    dx += 0.006 * g2(az - 0.0125, 0.006) * g2(y + 0.034, 0.008);
    // brow ridge, eye sockets, cheekbones
    dx += 0.008 * g2(y - 0.034, 0.011) * g2(z, 0.05);
    dx -= 0.007 * g2(az - 0.031, 0.015) * g2(y - 0.014, 0.011);
    dx += 0.004 * g2(az - 0.045, 0.02) * g2(y + 0.02, 0.02);
    // lips (upper, lower), the mouth line between them, and the chin
    dx += 0.007 * g2(y + 0.058, 0.006) * g2(z, 0.019);
    dx += 0.0075 * g2(y + 0.076, 0.007) * g2(z, 0.017);
    dx -= 0.003 * g2(y + 0.066, 0.0018) * g2(z, 0.02);
    dx += 0.008 * g2(y + 0.101, 0.014) * g2(z, 0.02);
    x += fw * dx;
    p.setXYZ(i, x, y, z);

    // vertex tints (multiplied with the skin texture)
    let r = 1, gr = 1, b = 1;
    const mix = (w: number, cr: number, cg: number, cb: number) => {
      r += (cr - r) * w; gr += (cg - gr) * w; b += (cb - b) * w;
    };
    if (fw > 0.05) {
      mix(fw * 0.9 * g2(y - 0.034, 0.0085) * sm(az, 0.004, 0.012) * (1 - sm(az, 0.05, 0.062)), 0.3, 0.24, 0.21); // brows
      mix(fw * 0.8 * (g2(y + 0.058, 0.0055) + g2(y + 0.076, 0.0065)) * g2(z, 0.02), 0.95, 0.66, 0.64); // lips
      mix(fw * 0.5 * g2(az - 0.031, 0.016) * g2(y - 0.014, 0.011), 0.82, 0.72, 0.74); // eye shadow
      mix(fw * 0.3 * g2(az - 0.045, 0.02) * g2(y + 0.025, 0.022), 1.0, 0.82, 0.8); // cheeks
      mix(fw * 0.35 * g2(y + 0.034, 0.012) * g2(z, 0.012), 1, 0.8, 0.78); // nose tip
    }
    // stubble: jaw, chin and upper lip, fading out toward the cheek
    mix(0.3 * sm(-y, 0.045, 0.075) * (1 - sm(az, 0.05, 0.07)) * (1 - 0.8 * g2(y + 0.067, 0.011) * g2(z, 0.02)), 0.7, 0.68, 0.68);
    col[i * 3] = r; col[i * 3 + 1] = gr; col[i * 3 + 2] = b;
  }
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

/* ------------------------------- the model ------------------------------ */

/* two-bone IK scratch */
const _ikD = new THREE.Vector3();
const _ikP = new THREE.Vector3();
const _ikU = new THREE.Vector3();
const _ikE = new THREE.Vector3();
const _ikF = new THREE.Vector3();
const _ikQ = new THREE.Quaternion();
const DOWN = new THREE.Vector3(0, -1, 0);

/**
 * Two-bone IK in the shoulder's parent space: aims the upper arm and bends the
 * elbow so the hand lands on `target`, with the elbow pointing toward `pole`.
 */
function solveArm(shoulder: THREE.Vector3, target: THREE.Vector3, pole: THREE.Vector3, a: number, b: number, qSh: THREE.Quaternion, qEl: THREE.Quaternion) {
  _ikD.subVectors(target, shoulder);
  const L = THREE.MathUtils.clamp(_ikD.length(), Math.abs(a - b) + 1e-3, a + b - 1e-3);
  _ikD.normalize();
  const alpha = Math.acos(THREE.MathUtils.clamp((a * a + L * L - b * b) / (2 * a * L), -1, 1));
  _ikP.copy(pole).addScaledVector(_ikD, -pole.dot(_ikD)).normalize();
  _ikU.copy(_ikD).multiplyScalar(Math.cos(alpha)).addScaledVector(_ikP, Math.sin(alpha));
  _ikE.copy(shoulder).addScaledVector(_ikU, a);
  _ikF.subVectors(target, _ikE).normalize();
  qSh.setFromUnitVectors(DOWN, _ikU);
  _ikF.applyQuaternion(_ikQ.copy(qSh).invert());
  qEl.setFromUnitVectors(DOWN, _ikF);
}

/** Sneaker, toe along +X, origin at the ankle. Lofted along its length, then laid down. */
function sneaker(parent: THREE.Object3D, upperMat: THREE.Material, soleMat: THREE.Material, accent: THREE.Material) {
  const lay = (secs: Sec[], mat: THREE.Material) => {
    const g = loftGeometry(secs, 28);
    g.rotateZ(-Math.PI / 2); // local +Y → +X, local +X → world down
    const m = new THREE.Mesh(g, mat);
    parent.add(m);
    return m;
  };
  lay(
    [
      { y: -0.07, rx: 0.045, rz: 0.034, ox: 0.035, n: 2.4 },
      { y: -0.04, rx: 0.055, rz: 0.037, ox: 0.03, n: 2.4 },
      { y: 0.0, rx: 0.052, rz: 0.039, ox: 0.028, n: 2.4 },
      { y: 0.08, rx: 0.04, rz: 0.044, ox: 0.04, n: 2.4 },
      { y: 0.15, rx: 0.03, rz: 0.045, ox: 0.052, n: 2.4 },
      { y: 0.2, rx: 0.022, rz: 0.039, ox: 0.058, n: 2.4 },
      { y: 0.236, rx: 0.008, rz: 0.024, ox: 0.068, n: 2.4 },
    ],
    upperMat
  );
  lay(
    [
      { y: -0.078, rx: 0.011, rz: 0.03, ox: 0.072, n: 3 },
      { y: -0.05, rx: 0.011, rz: 0.038, ox: 0.072, n: 3 },
      { y: 0.06, rx: 0.011, rz: 0.045, ox: 0.072, n: 3 },
      { y: 0.14, rx: 0.011, rz: 0.047, ox: 0.072, n: 3 },
      { y: 0.21, rx: 0.011, rz: 0.04, ox: 0.072, n: 3 },
      { y: 0.246, rx: 0.011, rz: 0.026, ox: 0.072, n: 3 },
    ],
    soleMat
  );
  // brand stripe along the side, and a dark collar
  for (const z of [-1, 1]) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.014, 0.003), accent);
    s.position.set(0.045, -0.04, z * 0.0425);
    s.rotation.z = 0.2;
    parent.add(s);
  }
}

/** The rigged character when public/models/courier.glb has loaded, the code-built courier otherwise. */
export function buildCourier(M: Mats) {
  return hasCourierAsset() ? buildRiggedCourier(M) : buildProceduralCourier(M);
}

function buildProceduralCourier(M: Mats) {
  const root = new THREE.Group();
  const HIP = 0.953;
  const THIGH = 0.45;
  const SHIN = 0.42;

  /* ---- materials ---- */
  const folds = foldBump(7, 0.5);
  const fabric = (color: number, rough: number, bump: number) =>
    new THREE.MeshPhysicalMaterial({
      color,
      roughness: rough,
      metalness: 0,
      bumpMap: folds,
      bumpScale: bump,
      sheen: 0.5,
      sheenRoughness: 0.7,
      sheenColor: new THREE.Color(0x9bb4ff),
    });
  const polo = fabric(0x1f4fb8, 0.9, 1.4);
  const poloTrim = fabric(0x163a8a, 0.9, 0.6);
  const chinos = fabric(0x2a2f3b, 0.86, 1.6);
  const skin = new THREE.MeshPhysicalMaterial({ color: 0xc78f6b, roughness: 0.58, metalness: 0, sheen: 0.25, sheenColor: new THREE.Color(0xffc8a8), sheenRoughness: 0.5 });
  const shoeUpper = new THREE.MeshStandardMaterial({ color: 0xf0f0ee, roughness: 0.55, metalness: 0 });
  const shoeSole = new THREE.MeshStandardMaterial({ color: 0xcfd2d6, roughness: 0.75, metalness: 0 });
  const leather = new THREE.MeshStandardMaterial({ color: 0x1b1c1f, roughness: 0.45, metalness: 0.1 });
  const headMap = headTexture("#c78f6b", "#2a1d15");
  headMap.wrapS = THREE.RepeatWrapping;
  headMap.offset.x = -0.25; // the sphere's face sits at u = 0.5, the texture's at 0.25
  const headMat = new THREE.MeshStandardMaterial({ map: headMap, vertexColors: true, roughness: 0.6, metalness: 0 });
  const sclera = new THREE.MeshStandardMaterial({ color: 0xf1ede8, roughness: 0.25, metalness: 0 });
  const iris = new THREE.MeshStandardMaterial({ color: 0x3a2515, roughness: 0.2, metalness: 0 });
  const pupil = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0 });

  /* ---- legs: hip → knee → ankle ---- */
  const legs: { hip: THREE.Group; knee: THREE.Group; foot: THREE.Group }[] = [];
  for (const z of [-0.09, 0.09]) {
    const hip = new THREE.Group();
    hip.position.set(0, HIP, z);
    loft(
      hip,
      chinos,
      [
        { y: 0.02, rx: 0.098, rz: 0.092, n: 2.1 },
        { y: -0.1, rx: 0.099, rz: 0.09, n: 2.1 },
        { y: -0.25, rx: 0.085, rz: 0.079, n: 2.1 },
        { y: -0.38, rx: 0.067, rz: 0.065, n: 2.1 },
        { y: -THIGH, rx: 0.059, rz: 0.058, n: 2.1 },
      ],
      32
    );
    const knee = new THREE.Group();
    knee.position.y = -THIGH;
    hip.add(knee);
    ball(knee, chinos, 0.054, [0, 0, 0]);
    loft(
      knee,
      chinos,
      [
        { y: 0, rx: 0.059, rz: 0.058 },
        { y: -0.07, rx: 0.061, rz: 0.058 },
        { y: -0.17, rx: 0.062, rz: 0.057, ox: -0.011 },
        { y: -0.29, rx: 0.05, rz: 0.047, ox: -0.004 },
        { y: -0.37, rx: 0.044, rz: 0.043 },
        { y: -SHIN - 0.005, rx: 0.047, rz: 0.046 }, // trouser hem, just over the shoe
      ],
      32
    );
    const foot = new THREE.Group();
    foot.position.y = -SHIN;
    knee.add(foot);
    sneaker(foot, shoeUpper, shoeSole, M.brand);
    root.add(hip);
    legs.push({ hip, knee, foot });
  }

  /* ---- upper body: bends at the hips ---- */
  const upper = new THREE.Group();
  upper.position.y = HIP;
  root.add(upper);

  // pelvis in trousers, belt, buckle
  loft(
    upper,
    chinos,
    [
      { y: -0.15, rx: 0.088, rz: 0.15, n: 2.2 },
      { y: -0.07, rx: 0.106, rz: 0.171, n: 2.2 },
      { y: 0.0, rx: 0.113, rz: 0.177, n: 2.2 },
      { y: 0.055, rx: 0.109, rz: 0.172, n: 2.2 },
    ],
    40
  );
  loft(
    upper,
    leather,
    [
      { y: 0.03, rx: 0.115, rz: 0.18, n: 2.2 },
      { y: 0.07, rx: 0.113, rz: 0.178, n: 2.2 },
    ],
    40
  );
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.034, 0.045), M.steel);
  buckle.position.set(0.118, 0.05, 0);
  upper.add(buckle);

  // torso: V-taper from waist to a broad chest and shoulder line, tucked into the trousers
  loft(
    upper,
    polo,
    [
      { y: 0.0, rx: 0.105, rz: 0.165, n: 2.3 },
      { y: 0.1, rx: 0.105, rz: 0.158, ox: 0.004, n: 2.3 },
      { y: 0.22, rx: 0.108, rz: 0.166, ox: 0.01, n: 2.3 },
      { y: 0.34, rx: 0.118, rz: 0.18, ox: 0.012, n: 2.3 },
      { y: 0.44, rx: 0.124, rz: 0.198, ox: 0.016, n: 2.4 },
      { y: 0.5, rx: 0.116, rz: 0.208, ox: 0.016, n: 2.4 },
      { y: 0.55, rx: 0.096, rz: 0.19, ox: 0.012, n: 2.3 },
      { y: 0.59, rx: 0.072, rz: 0.13, ox: 0.006, n: 2.2 },
      { y: 0.62, rx: 0.056, rz: 0.075, n: 2.1 },
    ],
    48
  );
  // polo collar, placket and chest logo
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.014, 10, 32), poloTrim);
  collar.rotation.x = Math.PI / 2;
  collar.scale.set(0.95, 1.05, 1);
  collar.position.set(0.006, 0.606, 0);
  upper.add(collar);
  const placket = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.13, 0.034), poloTrim);
  placket.position.set(0.12, 0.525, 0);
  placket.rotation.z = 0.4;
  upper.add(placket);
  const logo = decal(decalTexture("ELIV", "#ffffff"), 0.1, 0.03);
  logo.position.set(0.125, 0.465, 0.092);
  logo.rotation.y = Math.PI / 2 - 0.42;
  upper.add(logo);

  /* ---- neck + head ---- */
  loft(
    upper,
    skin,
    [
      { y: 0.57, rx: 0.062, rz: 0.07, ox: -0.004 },
      { y: 0.62, rx: 0.055, rz: 0.06, ox: 0.0 },
      { y: 0.67, rx: 0.052, rz: 0.057, ox: 0.01 },
    ],
    28
  );
  const headPivot = new THREE.Group();
  headPivot.position.set(0.004, 0.628, 0);
  upper.add(headPivot);
  const head = new THREE.Group();
  head.position.set(0.01, 0.117, 0);
  headPivot.add(head);
  head.add(new THREE.Mesh(buildHeadGeometry(), headMat));
  for (const z of [-1, 1]) {
    const eyeZ = z * 0.0315;
    ball(head, sclera, 0.0105, [0.07, 0.014, eyeZ]);
    ball(head, iris, 0.0062, [0.0815, 0.014, eyeZ], [0.4, 1, 1]);
    ball(head, pupil, 0.0032, [0.0836, 0.014, eyeZ], [0.3, 1, 1]);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.0113, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.4), skin);
    lid.position.set(0.07, 0.0145, eyeZ);
    head.add(lid);
    ball(head, skin, 0.026, [-0.004, 0.0, z * 0.0775], [0.5, 1, 0.26]); // ears
  }

  // courier cap in the brand blue: dome, curved peak, front logo
  const cap = new THREE.Group();
  cap.position.set(-0.005, 0.045, 0);
  head.add(cap);
  const crown = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), M.brand);
  crown.scale.set(0.099, 0.08, 0.082);
  cap.add(crown);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.006, 32, 1, false, 0, Math.PI), M.brandDark);
  brim.scale.set(2.3, 1, 1.05);
  brim.position.set(0.0, -0.004, 0);
  brim.rotation.z = -0.1;
  cap.add(brim);
  ball(cap, M.brandDark, 0.009, [0, 0.079, 0], [1, 0.5, 1]); // button
  const capLogo = decal(decalTexture("EL", "#ffffff"), 0.052, 0.02);
  capLogo.position.set(0.093, 0.03, 0);
  capLogo.rotation.set(0, Math.PI / 2, 0.3);
  cap.add(capLogo);

  /* ---- arms: shoulder → elbow → wrist ---- */
  const UPPER_ARM = 0.29;
  const FOREARM = 0.3; // elbow to the middle of the hand
  const arms: { sh: THREE.Group; el: THREE.Group }[] = [];
  for (const z of [-0.205, 0.205]) {
    const sh = new THREE.Group();
    sh.position.set(0, 0.532, z);
    upper.add(sh);
    ball(sh, polo, 0.056, [0, -0.014, 0], [0.95, 0.95, 0.9]); // deltoid
    loft(
      sh,
      polo,
      [
        { y: 0.02, rx: 0.058, rz: 0.055 },
        { y: -0.06, rx: 0.058, rz: 0.056 },
        { y: -0.14, rx: 0.056, rz: 0.054 },
        { y: -0.168, rx: 0.057, rz: 0.055 },
      ],
      28
    );
    const hem = new THREE.Mesh(new THREE.TorusGeometry(0.0555, 0.0055, 8, 24), poloTrim);
    hem.rotation.x = Math.PI / 2;
    hem.position.y = -0.166;
    sh.add(hem);
    loft(
      sh,
      skin,
      [
        { y: 0.0, rx: 0.048, rz: 0.046 },
        { y: -0.1, rx: 0.051, rz: 0.048, ox: 0.003 }, // biceps
        { y: -0.22, rx: 0.044, rz: 0.042 },
        { y: -UPPER_ARM, rx: 0.039, rz: 0.038 },
      ],
      28
    );
    const el = new THREE.Group();
    el.position.y = -UPPER_ARM;
    sh.add(el);
    ball(el, skin, 0.039, [0, 0, 0]);
    loft(
      el,
      skin,
      [
        { y: 0, rx: 0.04, rz: 0.037 },
        { y: -0.07, rx: 0.042, rz: 0.036 }, // forearm
        { y: -0.19, rx: 0.032, rz: 0.027 },
        { y: -0.248, rx: 0.026, rz: 0.021 },
      ],
      24
    );
    // hand: palm, four fingers and a thumb, palm facing in
    const side = z > 0 ? -1 : 1; // +1 → the hand's inner side is +z
    loft(
      el,
      skin,
      [
        { y: -0.24, rx: 0.026, rz: 0.021 },
        { y: -0.27, rx: 0.036, rz: 0.022 },
        { y: -0.31, rx: 0.042, rz: 0.02 },
        { y: -0.34, rx: 0.04, rz: 0.017 },
      ],
      20
    );
    const fingers: [number, number][] = [
      [0.029, 0.072],
      [0.0095, 0.08],
      [-0.0095, 0.075],
      [-0.028, 0.06],
    ];
    for (const [fx, fl] of fingers) {
      const f = new THREE.Group();
      f.position.set(fx, -0.335, 0);
      f.rotation.z = 0.12; // relaxed, slightly curled forward
      el.add(f);
      loft(
        f,
        skin,
        [
          { y: 0, rx: 0.0098, rz: 0.0098 },
          { y: -fl * 0.5, rx: 0.0088, rz: 0.0088 },
          { y: -fl, rx: 0.0065, rz: 0.0065 },
          { y: -fl - 0.006, rx: 0.003, rz: 0.003 },
        ],
        10
      );
    }
    const thumb = new THREE.Group();
    thumb.position.set(0.032, -0.275, side * 0.012);
    thumb.rotation.set(0, 0, 0.55);
    el.add(thumb);
    loft(
      thumb,
      skin,
      [
        { y: 0, rx: 0.0125, rz: 0.012 },
        { y: -0.03, rx: 0.011, rz: 0.0105 },
        { y: -0.058, rx: 0.0085, rz: 0.008 },
        { y: -0.064, rx: 0.003, rz: 0.003 },
      ],
      10
    );
    if (z < 0) {
      const watch = new THREE.Mesh(new THREE.CylinderGeometry(0.031, 0.031, 0.02, 20), M.charcoal);
      watch.position.y = -0.222;
      el.add(watch);
      const face = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.004, 20), M.glass);
      face.position.set(0, -0.222, 0);
      face.scale.set(1, 1, 1);
      el.add(face);
    }
    arms.push({ sh, el });
  }

  /** Parcel rides here while carried: held against the stomach, its bottom at the hands. */
  const hands = new THREE.Object3D();
  hands.position.set(0.41, 0.3, 0);
  upper.add(hands);

  // IK goals (upper-body space): hands cup the parcel's lower side edges, elbows back and out
  const grips = [new THREE.Vector3(0.4, 0.16, -0.25), new THREE.Vector3(0.4, 0.16, 0.25)];
  const poles = [new THREE.Vector3(-1, -0.35, -0.7), new THREE.Vector3(-1, -0.35, 0.7)];
  const qFreeSh = new THREE.Quaternion(), qFreeEl = new THREE.Quaternion();
  const qIkSh = new THREE.Quaternion(), qIkEl = new THREE.Quaternion();
  const eul = new THREE.Euler();

  const pose = (stride: number, carry: number, lean: number) => {
    const ph = (stride / 0.78) * Math.PI;
    for (let i = 0; i < 2; i++) {
      const p = ph + i * Math.PI;
      const swing = Math.sin(p);
      // thigh swings; the knee folds while that leg travels forward
      const l = legs[i];
      l.hip.rotation.z = swing * 0.42 + lean * 0.35;
      l.knee.rotation.z = -(0.06 + Math.max(0, Math.cos(p)) * 0.62) - lean * 0.6;
      // ankle rolls: toe up at heel strike, heel lifts as the leg pushes off
      l.foot.rotation.z = -(l.hip.rotation.z + l.knee.rotation.z) * 0.4;
    }
    // body: bob, a little hip sway and counter-rotation of the shoulders against the legs
    upper.position.y = HIP - Math.abs(Math.sin(ph)) * 0.025 + 0.012 - lean * 0.1;
    upper.rotation.z = -lean * 0.62 - 0.04 * (1 - lean);
    upper.rotation.y = Math.sin(ph) * 0.07 * (1 - lean);
    upper.rotation.x = Math.cos(ph) * 0.025 * (1 - lean);
    headPivot.rotation.z = lean * 0.4 + 0.03; // eyes stay on the job while he bends
    headPivot.rotation.y = -upper.rotation.y * 0.8;
    for (let i = 0; i < 2; i++) {
      const { sh, el } = arms[i];
      // free: natural counter-swing to the legs
      const freeSwing = -Math.sin(ph + i * Math.PI) * 0.38;
      qFreeSh.setFromEuler(eul.set((i ? 1 : -1) * 0.06, 0, freeSwing + lean * 0.5));
      qFreeEl.setFromEuler(eul.set(0, 0, 0.18 + Math.max(0, freeSwing) * 0.3));
      if (carry > 0) {
        solveArm(sh.position, grips[i], poles[i], UPPER_ARM, FOREARM, qIkSh, qIkEl);
        sh.quaternion.slerpQuaternions(qFreeSh, qIkSh, carry);
        el.quaternion.slerpQuaternions(qFreeEl, qIkEl, carry);
      } else {
        sh.quaternion.copy(qFreeSh);
        el.quaternion.copy(qFreeEl);
      }
    }
  };
  pose(0, 1, 0);
  return { root, pose, hands };
}
