// Lightweight Three.js wave overlay for sections
(function () {
  const motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  if (motionQuery.matches) return;

  function initSectionWaves() {
    if (!window.THREE) return;
    const sections = document.querySelectorAll('section');
    sections.forEach((section, idx) => {
      if (section.dataset.waveInitialized) return;
      section.dataset.waveInitialized = 'true';
      section.classList.add('has-wave');

      const canvas = document.createElement('canvas');
      canvas.className = 'wave-canvas';
      section.prepend(canvas);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0.8, 6);

      const light = new THREE.DirectionalLight(0xf4c542, 0.6);
      light.position.set(2, 4, 3);
      const hemi = new THREE.HemisphereLight(0xffffff, 0x0c0c0c, 0.4);
      scene.add(light, hemi);

      const geo = new THREE.PlaneGeometry(6, 3.5, 24, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: idx % 2 === 0 ? 0xf4c542 : 0x0cd4b8,
        emissive: 0x111111,
        metalness: 0.2,
        roughness: 0.5,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -0.6;
      mesh.position.y = -0.3;
      scene.add(mesh);

      const pos = geo.attributes.position;
      const original = pos.array.slice();

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const w = rect.width || section.clientWidth || 800;
        const h = rect.height || section.clientHeight || 400;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      const animate = () => {
        const t = performance.now() * 0.0015;
        for (let i = 0; i < pos.count; i++) {
          const ix = i * 3;
          const ox = original[ix];
          const oy = original[ix + 1];
          pos.array[ix + 2] = Math.sin(ox * 1.4 + t) * 0.18 + Math.cos(oy * 1.6 + t * 1.2) * 0.12;
        }
        pos.needsUpdate = true;
        mesh.rotation.z = Math.sin(t * 0.35) * 0.08;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      resize();
      window.addEventListener('resize', resize);
      animate();
    });
  }

  window.initSectionWaves = initSectionWaves;
})();
