// Lightweight Three.js wave overlay for sections with mobile-friendly fallbacks
(function () {
  const motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  const supportsWebGL = (() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (err) {
      return false;
    }
  })();

  const markFallback = (section) => {
    section.dataset.waveInitialized = 'true';
    section.classList.remove('has-wave');
    section.classList.add('wave-fallback');
  };

  function initSectionWaves() {
    if (motionQuery.matches || !window.THREE) return;

    const sections = Array.from(document.querySelectorAll('section'));
    if (!supportsWebGL) {
      sections.forEach(markFallback);
      return;
    }

    const isMobile = window.matchMedia && window.matchMedia('(max-width: 820px)').matches;
    const maxInstances = isMobile ? 1 : sections.length;
    let activeCount = 0;

    sections.forEach((section, idx) => {
      if (section.dataset.waveInitialized) return;
      if (activeCount >= maxInstances) {
        markFallback(section);
        return;
      }
      section.dataset.waveInitialized = 'true';
      section.classList.add('has-wave');
      activeCount += 1;

      const canvas = document.createElement('canvas');
      canvas.className = 'wave-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      section.prepend(canvas);

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: isMobile ? 'low-power' : 'default'
        });
      } catch (err) {
        canvas.remove();
        markFallback(section);
        return;
      }
      renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
      if (!renderer.getContext()) {
        canvas.remove();
        markFallback(section);
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0.8, 6);

      const light = new THREE.DirectionalLight(0xf4c542, 0.6);
      light.position.set(2, 4, 3);
      const hemi = new THREE.HemisphereLight(0xffffff, 0x0c0c0c, 0.4);
      scene.add(light, hemi);

      const geo = new THREE.PlaneGeometry(6, 3.5, isMobile ? 12 : 24, isMobile ? 8 : 16);
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
      let disposed = false;
      let frameId;

      const resize = () => {
        if (disposed) return;
        const rect = canvas.getBoundingClientRect();
        const w = rect.width || section.clientWidth || 800;
        const h = rect.height || section.clientHeight || 400;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      const cleanup = () => {
        if (disposed) return;
        disposed = true;
        if (frameId) cancelAnimationFrame(frameId);
        window.removeEventListener('resize', resize);
        renderer.dispose();
        canvas.remove();
        markFallback(section);
      };

      const animate = () => {
        if (disposed) return;
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
        frameId = requestAnimationFrame(animate);
      };

      canvas.addEventListener(
        'webglcontextlost',
        (event) => {
          event.preventDefault();
          cleanup();
        },
        { once: true }
      );

      resize();
      window.addEventListener('resize', resize);
      animate();
    });
  }

  window.initSectionWaves = initSectionWaves;
})();
