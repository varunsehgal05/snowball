import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Frosted, translucent ice snowball. Rotates continuously and grows with scroll progress. */
export default function SnowballCanvas({ growth = 0.35 }: { growth?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const growthRef = useRef(growth);
  growthRef.current = growth;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wrap.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.2, 5.2);

    const group = new THREE.Group();
    scene.add(group);

    const geo = new THREE.IcosahedronGeometry(1, 16);
    const pos = geo.attributes["position"] as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      // Create organic lumps like a packed snowball
      const noise = 
        Math.sin(v.x * 4.5) * Math.cos(v.y * 4.5) * Math.sin(v.z * 4.5) * 0.06 +
        (Math.sin(v.x * 12) + Math.cos(v.y * 12) + Math.sin(v.z * 12)) * 0.012 +
        (Math.sin(v.x * 24) * Math.sin(v.z * 24)) * 0.004;
      const n = 1 + noise;
      v.multiplyScalar(n);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();

    const ball = new THREE.Mesh(
      geo,
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#ffffff"),
        roughness: 0.85,
        metalness: 0.05,
        transmission: 0.05, // very slight light bleed to simulate snow
        thickness: 0.5,
        clearcoat: 0.2, // slight glisten on the snow
        clearcoatRoughness: 0.7,
        transparent: false,
      }),
    );
    group.add(ball);

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.28, 48, 48),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#8FD3FF"),
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
      }),
    );
    group.add(halo);

    scene.add(new THREE.HemisphereLight(0x0a1526, 0x050a12, 1.8));
    const key = new THREE.DirectionalLight(0x8fd3ff, 1.4);
    key.position.set(3, 4, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8fd3ff, 1.2);
    rim.position.set(-3, 1.5, -2);
    scene.add(rim);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = wrap;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // playful hop on space
    let vy = 0;
    let y = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && y <= 0.001) {
        e.preventDefault();
        vy = 0.075;
      }
    };
    window.addEventListener("keydown", onKey);

    let raf = 0;
    let scale = 1;
    const loop = () => {
      group.rotation.y += 0.0045;
      group.rotation.x = Math.sin(Date.now() / 4000) * 0.12;
      vy -= 0.0035;
      y = Math.max(0, y + vy);
      if (y === 0) vy = 0;
      const target = 0.85 + growthRef.current * 0.55;
      scale += (target - scale) * 0.06;
      group.scale.setScalar(scale);
      group.position.y = y + Math.sin(Date.now() / 2600) * 0.05;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKey);
      geo.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={wrapRef} className="h-full w-full" aria-hidden />;
}
