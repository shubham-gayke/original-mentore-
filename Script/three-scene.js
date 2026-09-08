/**
 * Mentore Solution — Three.js Ambient Visual Experience Engine
 * Soft, elegant golden/amber 3D particle constellation, dynamic neural mesh,
 * interactive cursor physics, scroll parallax, and holographic geometric accents.
 */

(function () {
  "use strict";

  // Prevent multiple initializations
  if (window.__MENTORE_THREE_INITIALIZED__) return;
  window.__MENTORE_THREE_INITIALIZED__ = true;

  // Ensure Three.js is loaded
  function initWhenReady() {
    if (typeof THREE === "undefined") {
      setTimeout(initWhenReady, 50);
      return;
    }
    initThreeExperience();
  }

  function createSoftCircleTexture() {
    var canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    var ctx = canvas.getContext("2d");

    // Soft radial glow gradient: warm golden center fading to transparent
    var gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 248, 220, 1.0)");       // Bright champagne core
    gradient.addColorStop(0.25, "rgba(245, 197, 66, 0.85)");    // Warm gold
    gradient.addColorStop(0.6, "rgba(217, 119, 6, 0.35)");      // Amber halo
    gradient.addColorStop(1, "rgba(217, 119, 6, 0.0)");         // Soft transparent edge

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    var texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  function initThreeExperience() {
    // Respect reduced motion preference
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Canvas container setup
    var container = document.getElementById("threejs-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "threejs-container";
      container.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:0;overflow:hidden;";
      document.body.prepend(container);
    }

    var canvas = document.getElementById("threejs-ambient-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "threejs-ambient-canvas";
      canvas.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;";
      container.appendChild(canvas);
    }

    var width = window.innerWidth;
    var height = window.innerHeight;

    // Scene & Camera
    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.00065);

    var camera = new THREE.PerspectiveCamera(55, width / height, 1, 2500);
    camera.position.set(0, 0, 650);

    // Renderer
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
    } catch (e) {
      console.warn("WebGL not supported, Three.js ambient background disabled.", e);
      return;
    }

    var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // ==========================================
    // 1. GOLDEN STARDUST & CONSTELLATION NODES
    // ==========================================
    var PARTICLE_COUNT = width < 768 ? 450 : 850;
    var positions = new Float32Array(PARTICLE_COUNT * 3);
    var basePositions = new Float32Array(PARTICLE_COUNT * 3);
    var velocities = new Float32Array(PARTICLE_COUNT * 3);
    var scales = new Float32Array(PARTICLE_COUNT);
    var phases = new Float32Array(PARTICLE_COUNT);

    var BOUNDS_X = 1100;
    var BOUNDS_Y = 900;
    var BOUNDS_Z = 750;

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var i3 = i * 3;
      var x = (Math.random() - 0.5) * BOUNDS_X * 2;
      var y = (Math.random() - 0.5) * BOUNDS_Y * 2;
      var z = (Math.random() - 0.5) * BOUNDS_Z * 2;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;

      velocities[i3] = (Math.random() - 0.5) * 0.25;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.25;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.15;

      scales[i] = Math.random() * 0.75 + 0.5;
      phases[i] = Math.random() * Math.PI * 2;
    }

    var particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    var particleTexture = createSoftCircleTexture();
    var particleMaterial = new THREE.PointsMaterial({
      size: width < 768 ? 14 : 18,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    var particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // ==========================================
    // 2. DYNAMIC 3D CONSTELLATION LINES (NEURAL MESH)
    // ==========================================
    var MAX_LINES = width < 768 ? 300 : 700;
    var linePositions = new Float32Array(MAX_LINES * 6);
    var lineColors = new Float32Array(MAX_LINES * 6);

    var lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    var lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    var lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSystem);

    // ==========================================
    // 3. FLOATING HOLOGRAPHIC GEOMETRIC ACCENTS
    // ==========================================
    var polyGroup = new THREE.Group();
    
    var icoGeo = new THREE.IcosahedronGeometry(42, 1);
    var icoMat = new THREE.MeshBasicMaterial({
      color: 0xe5c158,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending
    });
    var icoMesh = new THREE.Mesh(icoGeo, icoMat);
    polyGroup.add(icoMesh);

    var innerGeo = new THREE.OctahedronGeometry(22, 0);
    var innerMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    var innerMesh = new THREE.Mesh(innerGeo, innerMat);
    polyGroup.add(innerMesh);

    var ringGeo = new THREE.TorusGeometry(65, 0.7, 16, 64);
    var ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    var ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    polyGroup.add(ringMesh);

    polyGroup.position.set(380, -120, -100);
    scene.add(polyGroup);

    var polyGroup2 = new THREE.Group();
    var torusKnotGeo = new THREE.TorusKnotGeometry(26, 4, 64, 12, 2, 3);
    var torusKnotMat = new THREE.MeshBasicMaterial({
      color: 0xf6c851,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending
    });
    var torusKnotMesh = new THREE.Mesh(torusKnotGeo, torusKnotMat);
    polyGroup2.add(torusKnotMesh);
    polyGroup2.position.set(-420, 180, -180);
    scene.add(polyGroup2);

    // ==========================================
    // 4. MOUSE & SCROLL INTERACTION
    // ==========================================
    var mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    var mouseWorld = new THREE.Vector3();
    var scrollOffset = 0;
    var targetScrollOffset = 0;

    function onMouseMove(e) {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    function onTouchMove(e) {
      if (e.touches && e.touches[0]) {
        mouse.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    }

    function onScroll() {
      var currentScrollY = window.scrollY || window.pageYOffset;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPercent = docHeight > 0 ? currentScrollY / docHeight : 0;
      targetScrollOffset = scrollPercent;
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // ==========================================
    // 5. WINDOW RESIZING
    // ==========================================
    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    }
    window.addEventListener("resize", onResize);

    // ==========================================
    // 6. ANIMATION LOOP (LOCKED AT 60FPS WITH LERP)
    // ==========================================
    var clock = new THREE.Clock();
    var isTabActive = true;

    document.addEventListener("visibilitychange", function () {
      isTabActive = !document.hidden;
      if (isTabActive) clock.start();
    });

    var CONNECT_DISTANCE = width < 768 ? 100 : 130;
    var CONNECT_DIST_SQ = CONNECT_DISTANCE * CONNECT_DISTANCE;

    function animate() {
      requestAnimationFrame(animate);

      if (!isTabActive) return;

      var delta = Math.min(clock.getDelta(), 0.05);
      var elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Smooth scroll interpolation
      scrollOffset += (targetScrollOffset - scrollOffset) * 0.06;

      // Camera responds subtly to mouse parallax & page scroll depth
      if (!prefersReducedMotion) {
        camera.position.x = mouse.x * 65;
        camera.position.y = -mouse.y * 50 + (scrollOffset * 180 - 90);
        camera.lookAt(0, scrollOffset * 60 - 30, 0);

        // Slow rotation of background particle field
        particleSystem.rotation.y = elapsedTime * 0.02 + mouse.x * 0.08;
        particleSystem.rotation.x = Math.sin(elapsedTime * 0.015) * 0.04 + scrollOffset * 0.2;

        // Animate 3D Holographic Geometries
        polyGroup.rotation.x += delta * 0.35;
        polyGroup.rotation.y += delta * 0.55;
        polyGroup.position.y = -120 + Math.sin(elapsedTime * 0.8) * 20;

        polyGroup2.rotation.x -= delta * 0.25;
        polyGroup2.rotation.y += delta * 0.3;
        polyGroup2.position.y = 180 + Math.cos(elapsedTime * 0.7) * 18;
      }

      // Project mouse into 3D world space
      mouseWorld.set(mouse.x * 400, mouse.y * 300, 200);

      // Update particle positions & build dynamic proximity mesh
      var posArray = particleGeometry.attributes.position.array;
      var linePosArray = lineGeometry.attributes.position.array;
      var lineColArray = lineGeometry.attributes.color.array;
      var lineIdx = 0;

      for (var i = 0; i < PARTICLE_COUNT; i++) {
        var i3 = i * 3;

        var phase = phases[i];
        var ox = basePositions[i3];
        var oy = basePositions[i3 + 1];
        var oz = basePositions[i3 + 2];

        var fx = Math.sin(elapsedTime * 0.4 + phase) * 25;
        var fy = Math.cos(elapsedTime * 0.35 + phase * 1.2) * 30;
        var fz = Math.sin(elapsedTime * 0.25 + phase * 0.8) * 20;

        var px = ox + fx;
        var py = oy + fy;
        var pz = oz + fz;

        var dx = px - mouseWorld.x;
        var dy = py - mouseWorld.y;
        var distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 180 && distToMouse > 0.1) {
          var force = (1.0 - distToMouse / 180) * 45;
          px += (dx / distToMouse) * force;
          py += (dy / distToMouse) * force;
        }

        posArray[i3] = px;
        posArray[i3 + 1] = py;
        posArray[i3 + 2] = pz;

        if (lineIdx < MAX_LINES * 6 && i % 2 === 0) {
          for (var j = i + 1; j < PARTICLE_COUNT; j += 3) {
            var j3 = j * 3;
            var distSq =
              (px - posArray[j3]) * (px - posArray[j3]) +
              (py - posArray[j3 + 1]) * (py - posArray[j3 + 1]) +
              (pz - posArray[j3 + 2]) * (pz - posArray[j3 + 2]);

            if (distSq < CONNECT_DIST_SQ) {
              var alpha = 1.0 - Math.sqrt(distSq) / CONNECT_DISTANCE;
              var r = 0.96 * alpha * 0.4;
              var g = 0.82 * alpha * 0.4;
              var b = 0.38 * alpha * 0.4;

              linePosArray[lineIdx] = px;
              linePosArray[lineIdx + 1] = py;
              linePosArray[lineIdx + 2] = pz;
              lineColArray[lineIdx] = r;
              lineColArray[lineIdx + 1] = g;
              lineColArray[lineIdx + 2] = b;

              linePosArray[lineIdx + 3] = posArray[j3];
              linePosArray[lineIdx + 4] = posArray[j3 + 1];
              linePosArray[lineIdx + 5] = posArray[j3 + 2];
              lineColArray[lineIdx + 3] = r;
              lineColArray[lineIdx + 4] = g;
              lineColArray[lineIdx + 5] = b;

              lineIdx += 6;
              if (lineIdx >= MAX_LINES * 6) break;
            }
          }
        }
      }

      particleGeometry.attributes.position.needsUpdate = true;

      for (var k = lineIdx; k < MAX_LINES * 6; k++) {
        linePosArray[k] = 0;
        lineColArray[k] = 0;
      }
      lineGeometry.setDrawRange(0, lineIdx / 3);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWhenReady);
  } else {
    initWhenReady();
  }
})();
