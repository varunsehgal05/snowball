import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/** 3D mountain range using imported GLB model and a snowball rolling down a trail. */
export default function MountainCanvas({ progress = 0 }: { progress?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

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
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 500);
    camera.position.set(1.5, 2.0, 14);
    camera.lookAt(0, 3.2, -3);

    // Ball
    const ball = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 12),
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#ffffff"),
        emissive: new THREE.Color("#8FD3FF"),
        emissiveIntensity: 0.3,
        roughness: 0.85,
        transmission: 0.1,
        thickness: 0.5,
        ior: 1.31,
        attenuationColor: new THREE.Color("#8FD3FF"),
        attenuationDistance: 2,
        clearcoat: 0.3,
        clearcoatRoughness: 0.7,
      }),
    );
    scene.add(ball);

    // Lighting
    scene.add(new THREE.HemisphereLight(0x0a1526, 0x050a12, 1.5));
    const moon = new THREE.DirectionalLight(0x8fd3ff, 0.4);
    moon.position.set(5, 8, 6);
    scene.add(moon);
    const rimLight = new THREE.DirectionalLight(0x8fd3ff, 0.6);
    rimLight.position.set(-6, 3, -6);
    scene.add(rimLight);

    // Path variables (starts high/far back)
    let startX = 20;
    let startZ = -30;

    // GLB Loading
    const loader = new GLTFLoader();
    let terrainMesh: THREE.Group | null = null;
    let trail: THREE.Line | null = null;

    loader.load('/snowy-mountain.glb', (gltf) => {
      terrainMesh = gltf.scene;
      
      // Auto-scale and position the model to fit our scene
      const box = new THREE.Box3().setFromObject(terrainMesh);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      // We want the mountain to span roughly 140 units across X
      const scale = 140 / Math.max(size.x, 1);
      terrainMesh.scale.setScalar(scale);
      
      // Center it near origin but moved down slightly
      terrainMesh.position.set(-center.x * scale, -center.y * scale - 2, -center.z * scale - 5);
      
      // Override the downloaded model's colors with the True Black Hacker aesthetic
      // Use a dark grey (not pure black) so the material still reflects the moonlight!
      const snowMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#050a10"), // Dark grey
        emissive: new THREE.Color("#050a12"), // very subtle blue glow
        emissiveIntensity: 0.8,
        roughness: 0.9,
        metalness: 0.1,
      });
      
      // Add fog to blend seamlessly into the pitch black HTML background
      scene.fog = new THREE.FogExp2("#000000", 0.012);

      terrainMesh.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const m = child as THREE.Mesh;
          m.material = snowMaterial;
          // Force remove vertex colors that might override the material
          if (m.geometry && m.geometry.attributes.color) {
            m.geometry.deleteAttribute('color');
          }
        }
      });

      scene.add(terrainMesh);

      // Generate visual trail from the absolute peak downwards
      const trailPts: THREE.Vector3[] = [];
      const rc = new THREE.Raycaster();
      const dn = new THREE.Vector3(0, -1, 0);
      for (let t = 0; t <= 1; t += 0.005) {
        const x = startX + t * (-30 - startX);
        const z = startZ + t * (40 - startZ);
        
        rc.set(new THREE.Vector3(x, 100, z), dn);
        const hits = rc.intersectObject(terrainMesh, true);
        const y = hits.length > 0 ? hits[0].point.y : 0;
        
        trailPts.push(new THREE.Vector3(x, y + 0.2, z));
      }
      trail = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(trailPts),
        new THREE.LineBasicMaterial({ color: new THREE.Color("#8FD3FF"), transparent: true, opacity: 0.4 }),
      );
      scene.add(trail);
    });

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

    const raycaster = new THREE.Raycaster();
    const down = new THREE.Vector3(0, -1, 0);
    
    let raf = 0;
    let p = 0;
    const loop = () => {
      p += (progressRef.current - p) * 0.06;
      const t = Math.min(0.999, Math.max(0.001, p));
      
      // Calculate desired X and Z based on progress
      // Starts high/far away at the absolute peak and rolls down towards the camera
      const pointX = startX + t * (-30 - startX);
      const pointZ = startZ + t * (40 - startZ);
      let pointY = 0;
      
      // Calculate camera target X and Z
      // Camera trails behind (Z - 15) and slightly right (X + 5)
      const camX = pointX + 5;
      const camZ = pointZ - 15;
      let camGroundY = 0;
      
      // Snap to terrain if loaded
      if (terrainMesh) {
         // Snowball height
         raycaster.set(new THREE.Vector3(pointX, 100, pointZ), down);
         let hits = raycaster.intersectObject(terrainMesh, true);
         if (hits.length > 0) pointY = hits[0].point.y;
         
         // Camera height (prevent clipping)
         raycaster.set(new THREE.Vector3(camX, 100, camZ), down);
         hits = raycaster.intersectObject(terrainMesh, true);
         if (hits.length > 0) camGroundY = hits[0].point.y;
      }
      
      const s = 0.3 + t * 0.8;
      ball.position.set(pointX, pointY + s, pointZ);
      ball.scale.setScalar(s);
      ball.rotation.x += 0.04;
      ball.rotation.z += 0.02;

      // Camera follows from a safe distance, guaranteed to be above ground
      const targetCamY = Math.max(pointY + 6, camGroundY + 4);
      
      camera.position.x += (camX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (camZ - camera.position.z) * 0.05;
      
      // Look directly at the snowball to keep it framed beautifully in the center
      const targetLook = new THREE.Vector3(pointX, pointY, pointZ);
      camera.lookAt(targetLook);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={wrapRef} className="h-full w-full" aria-hidden />;
}
