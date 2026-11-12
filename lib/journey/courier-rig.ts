import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import { decalTexture } from "./textures";
import { decal, type Mats } from "./models";

/* ------------------------------------------------------------------ */
/* Courier from a real rigged character (public/models/courier.glb)    */
/*                                                                     */
/* The scene scrubs with the scroll bar, so no baked animation plays:  */
/* every frame the skeleton is posed from three numbers (stride, carry,*/
/* lean). Bones are aimed along directions in the character's own     */
/* frame (x forward, y up, z sideways, metres), arms use two-bone IK   */
/* so both hands land on the parcel. Same interface as the procedural  */
/* courier in courier.ts, which remains the fallback if the file is    */
/* missing.                                                            */
/* ------------------------------------------------------------------ */

let asset: THREE.Object3D | null = null;
export const hasCourierAsset = () => asset !== null;

export async function loadCourierAsset(url = "/models/courier.glb") {
  if (asset) return true;
  try {
    const gltf = await new GLTFLoader().loadAsync(url);
    asset = gltf.scene;
    return true;
  } catch (e) {
    console.warn("Courier model failed to load, using the built-in courier.", e);
    return false;
  }
}

const HEIGHT = 1.8; // metres, crown to sole
const Y = new THREE.Vector3(0, 1, 0);
const Q0 = new THREE.Quaternion().setFromAxisAngle(Y, Math.PI / 2); // model faces +Z → character faces +X
const Q0i = Q0.clone().invert();

type Node = {
  bone: THREE.Bone;
  key: string;
  parent: Node | null;
  L0: THREE.Quaternion; // rest local rotation
  P0: THREE.Vector3; // rest local position (model units)
  axis: THREE.Vector3; // local direction to the bone it aims at
  aimKey?: string;
  wq0: THREE.Quaternion; // rest world rotation
  wp0: THREE.Vector3; // rest world position
};

/** bone → the bone it points at (its "child" for aiming) */
const AIM: Record<string, string> = {
  Spine: "Spine1",
  Spine1: "Spine2",
  Spine2: "Neck",
  Neck: "Head",
  Head: "HeadTop_End",
  LeftShoulder: "LeftArm",
  RightShoulder: "RightArm",
  LeftArm: "LeftForeArm",
  LeftForeArm: "LeftHand",
  RightArm: "RightForeArm",
  RightForeArm: "RightHand",
  LeftUpLeg: "LeftLeg",
  LeftLeg: "LeftFoot",
  LeftFoot: "LeftToeBase",
  RightUpLeg: "RightLeg",
  RightLeg: "RightFoot",
  RightFoot: "RightToeBase",
};

function brandCap(M: Mats) {
  const cap = new THREE.Group();
  const crown = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), M.brand);
  crown.scale.set(0.099, 0.08, 0.086);
  cap.add(crown);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.099, 0.099, 0.012, 40, 1, true), M.brand);
  band.scale.set(1, 1, 0.87);
  band.position.y = 0.002;
  cap.add(band);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.084, 0.084, 0.006, 32, 1, false, 0, Math.PI), M.brandDark);
  brim.scale.set(2.2, 1, 1.05);
  brim.position.set(0.0, -0.002, 0);
  brim.rotation.z = -0.04;
  cap.add(brim);
  const button = new THREE.Mesh(new THREE.SphereGeometry(0.009, 12, 8), M.brandDark);
  button.position.y = 0.079;
  button.scale.y = 0.5;
  cap.add(button);
  const logo = decal(decalTexture("EL", "#ffffff"), 0.052, 0.02);
  logo.position.set(0.094, 0.032, 0);
  logo.rotation.set(0, Math.PI / 2, 0.3);
  cap.add(logo);
  return cap;
}

export function buildRiggedCourier(M: Mats) {
  const model = cloneSkinned(asset!) as THREE.Group;

  // ---- scale to a 1.80 m man standing on the floor ----
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  const s = HEIGHT / (box.max.y - box.min.y);
  const holder = new THREE.Group();
  holder.quaternion.copy(Q0);
  holder.scale.setScalar(s);
  holder.position.y = -box.min.y * s;
  holder.add(model);
  const root = new THREE.Group();
  root.add(holder);

  model.traverse((o) => {
    const m = o as THREE.SkinnedMesh;
    if (m.isMesh) {
      m.frustumCulled = false;
      m.castShadow = true;
      m.receiveShadow = true;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      for (const mt of mats) (mt as THREE.MeshStandardMaterial).envMapIntensity = 0.7;
    }
  });

  // ---- skeleton bookkeeping ----
  const byKey = new Map<string, Node>();
  const order: Node[] = [];
  let hipsBone: THREE.Bone | null = null;
  model.traverse((o) => {
    if ((o as THREE.Bone).isBone && o.name.replace(/^mixamorig\d*:?/, "") === "Hips") hipsBone = o as THREE.Bone;
  });
  if (!hipsBone) throw new Error("courier model has no Hips bone");
  const walk = (bone: THREE.Bone, parent: Node | null) => {
    const key = bone.name.replace(/^mixamorig\d*:?/, "");
    const n: Node = {
      bone,
      key,
      parent,
      L0: bone.quaternion.clone(),
      P0: bone.position.clone(),
      axis: new THREE.Vector3(0, 1, 0),
      wq0: new THREE.Quaternion(),
      wp0: new THREE.Vector3(),
    };
    n.wq0.copy(parent ? parent.wq0 : new THREE.Quaternion()).multiply(n.L0);
    n.wp0.copy(parent ? parent.wp0 : new THREE.Vector3()).add(n.P0.clone().applyQuaternion(parent ? parent.wq0 : new THREE.Quaternion()));
    byKey.set(key, n);
    order.push(n);
    for (const c of bone.children) if ((c as THREE.Bone).isBone) walk(c as THREE.Bone, n);
  };
  walk(hipsBone, null);
  for (const [k, target] of Object.entries(AIM)) {
    const n = byKey.get(k);
    const t = byKey.get(target);
    if (n && t) {
      n.aimKey = target;
      n.axis.copy(t.P0).normalize();
    }
  }
  const node = (k: string) => byKey.get(k)!;
  /** length of a bone: from its joint to the joint it aims at, model units */
  const len = (k: string) => node(AIM[k]).P0.length();

  const hipsN = node("Hips");
  const footY0 = node("LeftFoot").wp0.y;
  const Lt = len("LeftUpLeg");
  const Ls = len("LeftLeg");
  const armA = len("LeftArm");
  const armB = len("LeftForeArm");
  /** a bone's rest direction in the character frame, tilted forward by `a` radians (spine, neck, head keep their natural curve) */
  const tilt = (k: string, a: number) => {
    const n = node(k);
    const d = n.axis.clone().applyQuaternion(n.wq0).applyQuaternion(Q0);
    return d.applyAxisAngle(new THREE.Vector3(0, 0, 1), -a).applyQuaternion(Q0i);
  };

  // rest direction of each foot (toe vector) as pitch, so a flat sole stays flat
  const footRest = (side: string) => node(side + "Foot").axis.clone().applyQuaternion(node(side + "Foot").wq0).applyQuaternion(Q0);

  // ---- brand cap on the head bone ----
  const head = node("Head");
  const headTop = node("HeadTop_End");
  const capHolder = new THREE.Group();
  capHolder.quaternion.copy(head.wq0).invert(); // children align with the model frame
  const headH = headTop.P0.length();
  capHolder.position.copy(headTop.P0).multiplyScalar(0.65);
  const cap = brandCap(M);
  const capScale = (headH * s) / 0.19 / s;
  cap.scale.setScalar(capScale);
  cap.rotation.y = -Math.PI / 2; // cap is built facing +X; the model faces +Z
  cap.position.set(0, 0, headH * 0.07);
  capHolder.add(cap);
  head.bone.add(capHolder);

  /** Parcel rides here while carried (in character space, set each pose). */
  const hands = new THREE.Object3D();
  root.add(hands);

  // ---- scratch ----
  const wq = new Map<Node, THREE.Quaternion>();
  const wp = new Map<Node, THREE.Vector3>();
  for (const n of order) {
    wq.set(n, new THREE.Quaternion());
    wp.set(n, new THREE.Vector3());
  }
  const targets = new Map<string, THREE.Vector3>(); // aim directions, model frame
  const extra = new Map<string, THREE.Quaternion>(); // extra world rotations (yaw)
  const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3();
  const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _pi = new THREE.Quaternion();
  const dirChar = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).normalize().applyQuaternion(Q0i);
  const downVec = (a: number, z = 0) => dirChar(Math.sin(a), -Math.cos(a), z);
  const yaw = (a: number) => new THREE.Quaternion().setFromAxisAngle(Y, a);

  // arm IK (model space)
  const armPole = [new THREE.Vector3(-1, -0.35, -0.7), new THREE.Vector3(-1, -0.35, 0.7)]; // character frame
  const ikPoint = new THREE.Vector3();
  const ikDirs: { up: THREE.Vector3; fore: THREE.Vector3 }[] = [
    { up: new THREE.Vector3(), fore: new THREE.Vector3() },
    { up: new THREE.Vector3(), fore: new THREE.Vector3() },
  ];

  /** Two-bone IK in model space: fills the aim directions of upper arm and forearm. */
  const solveArm = (S: THREE.Vector3, T: THREE.Vector3, poleModel: THREE.Vector3, out: { up: THREE.Vector3; fore: THREE.Vector3 }) => {
    const d = _a.subVectors(T, S);
    const L = THREE.MathUtils.clamp(d.length(), Math.abs(armA - armB) + 1e-3, armA + armB - 1e-3);
    d.normalize();
    const alpha = Math.acos(THREE.MathUtils.clamp((armA * armA + L * L - armB * armB) / (2 * armA * L), -1, 1));
    const p = _b.copy(poleModel).addScaledVector(d, -poleModel.dot(d)).normalize();
    out.up.copy(d).multiplyScalar(Math.cos(alpha)).addScaledVector(p, Math.sin(alpha)).normalize();
    const E = _c.copy(S).addScaledVector(out.up, armA);
    out.fore.subVectors(T, E).normalize();
  };

  const pose = (stride: number, carry: number, lean: number) => {
    const ph = (stride / 0.78) * Math.PI;

    // legs: same gait as the procedural courier, as absolute directions
    const leg: { a: number; b: number }[] = [];
    for (let i = 0; i < 2; i++) {
      const p = ph + i * Math.PI;
      const a = Math.sin(p) * 0.42 + lean * 0.35;
      const k = -(0.06 + Math.max(0, Math.cos(p)) * 0.62) - lean * 0.6;
      leg.push({ a, b: a + k });
    }
    // pelvis height: the lowest ankle stays on the floor
    const drop = Math.max(...leg.map((l) => Lt * Math.cos(l.a) + Ls * Math.cos(l.b)));
    const hipsY = footY0 + drop;

    const L = lean * 0.62 + 0.04 * (1 - lean); // forward lean of the chest
    const sway = Math.sin(ph) * 0.07 * (1 - lean);
    targets.clear();
    extra.clear();
    targets.set("Spine", tilt("Spine", L * 0.3));
    targets.set("Spine1", tilt("Spine1", L * 0.65));
    targets.set("Spine2", tilt("Spine2", L));
    extra.set("Spine2", yaw(sway));
    targets.set("Neck", tilt("Neck", L * 0.42));
    targets.set("Head", tilt("Head", lean * 0.2 + 0.01));
    extra.set("Head", yaw(-sway * 0.8));

    const sides = ["Left", "Right"];
    for (let i = 0; i < 2; i++) {
      const sd = sides[i];
      const sg = i === 0 ? -1 : 1; // Left is −z in the character frame
      targets.set(sd + "UpLeg", downVec(leg[i].a, 0));
      targets.set(sd + "Leg", downVec(leg[i].b, 0));
      // ankle rolls: toe up at heel strike, heel up at push-off
      const fr = footRest(sd);
      _q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), leg[i].b * 0.6);
      targets.set(sd + "Foot", fr.clone().applyQuaternion(_q).applyQuaternion(Q0i));
      // shoulders sit a touch below horizontal once the arms drop
      targets.set(sd + "Shoulder", dirChar(0, -0.1, sg));
    }

    // chest pivot and the parcel anchor, in character metres
    const pivotY = hipsY * s;
    const lc = Math.cos(L), ls = Math.sin(L);
    const upperToChar = (x: number, y: number, z: number, out: THREE.Vector3) =>
      out.set(x * lc + y * ls, -x * ls + y * lc + pivotY, z);
    upperToChar(0.41, 0.3, 0, hands.position);

    // ---- walk the skeleton parent-first, writing rotations ----
    for (const n of order) {
      const pq = n.parent ? wq.get(n.parent)! : _pi.identity();
      const pp = n.parent ? wp.get(n.parent)! : null;
      const q = wq.get(n)!;
      const p = wp.get(n)!;
      if (n === hipsN) {
        n.bone.position.set(n.P0.x, hipsY, n.P0.z);
        p.copy(n.bone.position);
        n.bone.quaternion.copy(n.L0);
        q.copy(n.L0);
        continue;
      }
      p.copy(n.P0).applyQuaternion(pq).add(pp!);

      let desired: THREE.Vector3 | undefined = targets.get(n.key);
      // arms: free swing blended with the IK carry
      const armSide = n.key === "LeftArm" ? 0 : n.key === "RightArm" ? 1 : n.key === "LeftForeArm" ? 0 : n.key === "RightForeArm" ? 1 : -1;
      if (armSide >= 0) {
        const sg = armSide === 0 ? -1 : 1;
        const sw = -Math.sin(ph + armSide * Math.PI) * 0.38;
        const fAbs = sw - 0.04 * (1 - lean) - 0.12 * lean;
        const isUpper = n.key.endsWith("Arm") && !n.key.endsWith("ForeArm");
        if (isUpper) {
          // shoulder joint is this bone's origin: aim the IK once here
          const ik = ikDirs[armSide];
          if (carry > 0) {
            upperToChar(0.4, 0.16, sg * 0.25, _a);
            ikPoint.copy(_a).applyQuaternion(Q0i).multiplyScalar(1 / s);
            solveArm(p, ikPoint, armPole[armSide].clone().applyQuaternion(Q0i), ik);
          }
          const free = downVec(fAbs, sg * 0.12);
          desired = carry > 0 ? free.lerp(ik.up, carry).normalize() : free;
        } else {
          const g = fAbs + 0.18 + Math.max(0, sw) * 0.3;
          const free = downVec(g, sg * 0.06);
          desired = carry > 0 ? free.lerp(ikDirs[armSide].fore, carry).normalize() : free;
        }
      }

      // D: world-frame correction. local = Pq⁻¹ · D · Pq · L0
      const D = _q;
      D.identity();
      if (desired && n.aimKey) {
        const now = _b.copy(n.axis).applyQuaternion(_q2.copy(pq).multiply(n.L0));
        D.setFromUnitVectors(now, desired);
      }
      const ex = extra.get(n.key);
      if (ex) D.premultiply(ex);
      const local = _q2.copy(pq).invert().multiply(D).multiply(pq).multiply(n.L0);
      n.bone.quaternion.copy(local);
      q.copy(pq).multiply(local);
    }
  };

  pose(0, 1, 0);
  return { root, pose, hands };
}
