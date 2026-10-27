import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { DentalModelPreset, FinishMode } from '../utils/clinicLogic';

interface Dental3DShowcaseProps {
  activePreset: DentalModelPreset;
  onPresetChange: (preset: DentalModelPreset) => void;
  explodedAmount: number;
  onExplodedChange: (val: number) => void;
  finishMode: FinishMode;
  onFinishChange: (mode: FinishMode) => void;
  onBookSelectedModel: (preset: DentalModelPreset) => void;
}

const _targetVec = new THREE.Vector3();

function createProceduralGridTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle clinical measurement grid
  ctx.strokeStyle = 'rgba(45, 212, 191, 0.14)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 512; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  // Concentric calibration ring
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.22)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(256, 256, 180, 0, Math.PI * 2);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

function createTitaniumThreadBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  for (let y = 0; y < 256; y++) {
    const wave = Math.floor(((Math.sin((y / 256) * Math.PI * 28) + 1) * 0.5) * 255);
    ctx.fillStyle = `rgb(${wave},${wave},${wave})`;
    ctx.fillRect(0, y, 256, 1);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export const Dental3DShowcase: React.FC<Dental3DShowcaseProps> = ({
  activePreset,
  onPresetChange,
  explodedAmount,
  onExplodedChange,
  finishMode,
  onFinishChange,
  onBookSelectedModel,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const [hudCollapsed, setHudCollapsed] = useState(false);

  // Store mutable state in ref so WebGL scene never tears down on UI updates
  const stateRef = useRef({
    activePreset,
    explodedAmount,
    finishMode,
    currentExploded: explodedAmount,
    rotationAngle: 0,
  });

  const requestRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    stateRef.current.activePreset = activePreset;
    stateRef.current.explodedAmount = explodedAmount;
    stateRef.current.finishMode = finishMode;
    if (requestRenderRef.current) {
      requestRenderRef.current();
    }
  }, [activePreset, explodedAmount, finishMode]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1320);
    scene.fog = new THREE.FogExp2(0x0b1320, 0.065);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 7.1);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3-Point Warm/Cool Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    keyLight.position.set(4, 6, 5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 20;
      const d = 4;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 1.4);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // Ground calibration platform + contact shadow
    const gridTex = createProceduralGridTexture(renderer);
    const floorGeo = new THREE.CircleGeometry(4.2, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: gridTex,
      roughness: 0.75,
      metalness: 0.15,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.65;
    floorMesh.receiveShadow = !isSoftwareGl;
    scene.add(floorMesh);

    const shadowGeo = new THREE.CircleGeometry(1.75, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -1.63; // Offset >= 0.02 to prevent Z-fighting
    scene.add(contactShadow);

    // Shared PBR Materials
    const threadBump = createTitaniumThreadBumpMap();

    const enamelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.14,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });

    const dentinMaterial = new THREE.MeshStandardMaterial({
      color: 0xfde68a,
      roughness: 0.48,
      metalness: 0.05,
    });

    const titaniumMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.25,
      metalness: 0.92,
      bumpMap: threadBump,
      bumpScale: 0.03,
    });

    const goldAbutmentMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.22,
      metalness: 0.88,
    });

    const gingivaMaterial = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.55,
      metalness: 0.05,
    });

    const pulpMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.35,
      roughness: 0.4,
    });

    const alignerShellMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x99f6e4,
      transparent: true,
      opacity: isSoftwareGl ? 0.38 : 0.48,
      roughness: 0.1,
      metalness: 0.05,
      clearcoat: 1.0,
      depthWrite: false,
    });

    // Root Group holding all 3 presets
    const rootModelGroup = new THREE.Group();
    scene.add(rootModelGroup);

    // =========================================================================
    // PRESET 1: Composite 8-Part Molar & Titanium Implant Assembly
    // =========================================================================
    const implantMolarGroup = new THREE.Group();
    rootModelGroup.add(implantMolarGroup);

    // Part 1: Crown Enamel Base (LatheGeometry sculpted anatomical molar profile)
    const crownSection = new THREE.Group();
    const crownPoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.58, 0.02),
      new THREE.Vector2(0.76, 0.25),
      new THREE.Vector2(0.82, 0.58),
      new THREE.Vector2(0.72, 0.88),
      new THREE.Vector2(0.35, 0.92),
      new THREE.Vector2(0.0, 0.78),
    ];
    const crownLatheGeo = new THREE.LatheGeometry(crownPoints, 32);
    const crownBaseMesh = new THREE.Mesh(crownLatheGeo, enamelMaterial);
    crownBaseMesh.castShadow = !isSoftwareGl;
    crownSection.add(crownBaseMesh);

    // Parts 2-5: 4 Anatomical Molar Cusps on top of the crown
    const cuspGeo = new THREE.SphereGeometry(0.34, 24, 20);
    cuspGeo.scale(1, 0.68, 1);
    const cuspOffsets = [
      [0.34, 0.82, 0.34],
      [-0.34, 0.82, 0.34],
      [0.34, 0.82, -0.34],
      [-0.34, 0.82, -0.34],
    ];
    cuspOffsets.forEach(([cx, cy, cz]) => {
      const cusp = new THREE.Mesh(cuspGeo, enamelMaterial);
      cusp.position.set(cx, cy, cz);
      crownSection.add(cusp);
    });
    crownSection.position.y = 0.35;
    implantMolarGroup.add(crownSection);

    // Part 6: Internal Dentin & Neurovascular Pulp Core
    const coreSection = new THREE.Group();
    const dentinGeo = new THREE.CylinderGeometry(0.46, 0.36, 0.65, 28);
    const dentinMesh = new THREE.Mesh(dentinGeo, dentinMaterial);
    coreSection.add(dentinMesh);

    const pulpGeo = new THREE.CapsuleGeometry(0.16, 0.35, 12, 16);
    const pulpMesh = new THREE.Mesh(pulpGeo, pulpMaterial);
    pulpMesh.position.y = 0.1;
    coreSection.add(pulpMesh);
    coreSection.position.y = 0.05;
    implantMolarGroup.add(coreSection);

    // Part 7: Gold/Titanium Hex Prosthetic Abutment Collar
    const abutmentSection = new THREE.Group();
    const abutmentCollarGeo = new THREE.CylinderGeometry(0.38, 0.46, 0.35, 6);
    const abutmentPostGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.55, 24);
    const collarMesh = new THREE.Mesh(abutmentCollarGeo, goldAbutmentMaterial);
    const postMesh = new THREE.Mesh(abutmentPostGeo, goldAbutmentMaterial);
    postMesh.position.y = 0.25;
    abutmentSection.add(collarMesh, postMesh);
    abutmentSection.position.y = -0.35;
    implantMolarGroup.add(abutmentSection);

    // Part 8: Threaded Grade-5 Titanium Root Implant Fixture + Gingiva Ring
    const fixtureSection = new THREE.Group();
    const fixtureBodyGeo = new THREE.CylinderGeometry(0.38, 0.22, 1.15, 32);
    const fixtureMesh = new THREE.Mesh(fixtureBodyGeo, titaniumMaterial);
    fixtureSection.add(fixtureMesh);

    // Helical macro-threads along the titanium fixture
    const threadRingGeo = new THREE.TorusGeometry(0.33, 0.04, 12, 28);
    threadRingGeo.rotateX(Math.PI / 2);
    for (let i = 0; i < 6; i++) {
      const ring = new THREE.Mesh(threadRingGeo, titaniumMaterial);
      const scale = 1 - i * 0.065;
      ring.scale.set(scale, scale, 1);
      ring.position.y = 0.4 - i * 0.16;
      fixtureSection.add(ring);
    }

    const gingivaRingGeo = new THREE.TorusGeometry(0.68, 0.18, 16, 36);
    gingivaRingGeo.rotateX(Math.PI / 2);
    const gingivaRing = new THREE.Mesh(gingivaRingGeo, gingivaMaterial);
    gingivaRing.position.y = 0.48;
    fixtureSection.add(gingivaRing);

    fixtureSection.position.y = -0.95;
    implantMolarGroup.add(fixtureSection);

    // =========================================================================
    // PRESET 2: Orthodontic Braces & Archwire Dental Arch (Composite 10+ Parts)
    // =========================================================================
    const orthoArchGroup = new THREE.Group();
    orthoArchGroup.visible = false;
    rootModelGroup.add(orthoArchGroup);

    // Gingival horseshoe base
    const archCurvePoints: THREE.Vector3[] = [];
    const numTeeth = 8;
    for (let i = 0; i <= 24; i++) {
      const t = (i / 24) * Math.PI - Math.PI / 2;
      const x = Math.sin(t) * 1.55;
      const z = Math.cos(t) * 1.25 - 0.35;
      archCurvePoints.push(new THREE.Vector3(x, 0, z));
    }
    const archCurve = new THREE.CatmullRomCurve3(archCurvePoints);

    const gumTubeGeo = new THREE.TubeGeometry(archCurve, 36, 0.34, 16, false);
    const gumArchMesh = new THREE.Mesh(gumTubeGeo, gingivaMaterial);
    gumArchMesh.position.y = -0.45;
    orthoArchGroup.add(gumArchMesh);

    // Sculpted Teeth along the arch + Brackets + Elastic Ligatures
    const teethSubGroup = new THREE.Group();
    const bracketsSubGroup = new THREE.Group();
    orthoArchGroup.add(teethSubGroup, bracketsSubGroup);

    const toothGeo = new THREE.CapsuleGeometry(0.22, 0.38, 12, 18);
    const bracketBaseGeo = new THREE.BoxGeometry(0.16, 0.14, 0.09);
    const bracketSlotGeo = new THREE.BoxGeometry(0.18, 0.04, 0.11);

    for (let i = 0; i < numTeeth; i++) {
      const u = (i + 0.5) / numTeeth;
      const pt = archCurve.getPointAt(u);
      const tangent = archCurve.getTangentAt(u);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      // Tooth crown
      const tMesh = new THREE.Mesh(toothGeo, enamelMaterial);
      tMesh.position.set(pt.x, 0.05, pt.z);
      tMesh.lookAt(pt.x + normal.x, 0.05, pt.z + normal.z);
      const isCentral = i === 3 || i === 4;
      tMesh.scale.set(isCentral ? 1.15 : 0.95, isCentral ? 1.1 : 0.95, 0.82);
      teethSubGroup.add(tMesh);

      // Orthodontic Twin Bracket
      const bGroup = new THREE.Group();
      const bBase = new THREE.Mesh(bracketBaseGeo, titaniumMaterial);
      const bSlot = new THREE.Mesh(bracketSlotGeo, goldAbutmentMaterial);
      bSlot.position.z = 0.02;
      bGroup.add(bBase, bSlot);

      const bracketPos = pt.clone().addScaledVector(normal, 0.21);
      bGroup.position.set(bracketPos.x, 0.08, bracketPos.z);
      bGroup.lookAt(bracketPos.x + normal.x, 0.08, bracketPos.z + normal.z);
      bracketsSubGroup.add(bGroup);
    }

    // Continuous NiTi Thermal Archwire passing through brackets
    const wireCurvePoints = archCurvePoints.map((p) => {
      const dir = p.clone().setY(0).normalize();
      return new THREE.Vector3(p.x + dir.x * 0.23, 0.08, p.z + dir.z * 0.23);
    });
    const wireCurve = new THREE.CatmullRomCurve3(wireCurvePoints);
    const archwireGeo = new THREE.TubeGeometry(wireCurve, 40, 0.032, 12, false);
    const archwireMesh = new THREE.Mesh(archwireGeo, titaniumMaterial);
    bracketsSubGroup.add(archwireMesh);

    // =========================================================================
    // PRESET 3: Clear Aligner & Aesthetic Veneer Digital Twin
    // =========================================================================
    const alignerGroup = new THREE.Group();
    alignerGroup.visible = false;
    rootModelGroup.add(alignerGroup);

    const alignerGumBase = gumArchMesh.clone();
    alignerGroup.add(alignerGumBase);

    const alignerTeethSub = teethSubGroup.clone();
    alignerGroup.add(alignerTeethSub);

    // Translucent Precision Clear Aligner Tray over the arch
    const alignerTrayGroup = new THREE.Group();
    const trayTubeGeo = new THREE.TubeGeometry(archCurve, 40, 0.31, 20, false);
    const trayShellMesh = new THREE.Mesh(trayTubeGeo, alignerShellMaterial);
    trayShellMesh.renderOrder = 10;
    trayShellMesh.position.y = 0.12;
    alignerTrayGroup.add(trayShellMesh);

    // Force-attachment precision buttons on teeth
    const attachmentGeo = new THREE.BoxGeometry(0.09, 0.12, 0.06);
    for (let i = 1; i < numTeeth - 1; i += 2) {
      const u = (i + 0.5) / numTeeth;
      const pt = archCurve.getPointAt(u);
      const tangent = archCurve.getTangentAt(u);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const att = new THREE.Mesh(attachmentGeo, goldAbutmentMaterial);
      const attPos = pt.clone().addScaledVector(normal, 0.2);
      att.position.set(attPos.x, 0.1, attPos.z);
      alignerTrayGroup.add(att);
    }
    alignerGroup.add(alignerTrayGroup);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 3.2;
    controls.maxDistance = 9.0;
    controls.maxPolarAngle = Math.PI * 0.54;
    controls.target.set(0, -0.15, 0);
    controls.update();

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Apply current preset, exploded separation & finish material mode
    function syncSceneState() {
      const { activePreset: preset, explodedAmount: targetExp, finishMode: mode } = stateRef.current;

      // Smooth interpolation toward exploded target
      stateRef.current.currentExploded = THREE.MathUtils.lerp(
        stateRef.current.currentExploded,
        targetExp,
        0.25
      );
      const exp = stateRef.current.currentExploded;

      implantMolarGroup.visible = preset === 'implant_molar';
      orthoArchGroup.visible = preset === 'orthodontic_arch';
      alignerGroup.visible = preset === 'clear_aligner';

      // Exploded kinematic layer offsets
      crownSection.position.y = 0.35 + exp * 0.85;
      coreSection.position.y = 0.05 + exp * 0.28;
      abutmentSection.position.y = -0.35 - exp * 0.18;
      fixtureSection.position.y = -0.95 - exp * 0.65;

      gumArchMesh.position.y = -0.45 - exp * 0.45;
      teethSubGroup.position.y = exp * 0.15;
      bracketsSubGroup.position.z = exp * 0.55;
      bracketsSubGroup.position.y = exp * 0.35;

      alignerGumBase.position.y = -0.45 - exp * 0.4;
      alignerTrayGroup.position.y = exp * 0.85;

      // Material finish modes
      if (mode === 'natural_enamel') {
        enamelMaterial.color.setHex(0xf8fafc);
        enamelMaterial.wireframe = false;
        enamelMaterial.transparent = false;
        enamelMaterial.opacity = 1.0;
        titaniumMaterial.wireframe = false;
      } else if (mode === 'titanium_blueprint') {
        enamelMaterial.color.setHex(0x38bdf8);
        enamelMaterial.wireframe = true;
        enamelMaterial.transparent = true;
        enamelMaterial.opacity = 0.85;
        titaniumMaterial.wireframe = false;
      } else {
        // xray_translucent
        enamelMaterial.color.setHex(0x99f6e4);
        enamelMaterial.wireframe = false;
        enamelMaterial.transparent = true;
        enamelMaterial.opacity = 0.42;
        titaniumMaterial.wireframe = false;
      }
    }

    // On-Demand Render Pipeline with Software-WebGL Guard
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        renderDirty = false;
        syncSceneState();
        controls.update();
        renderer.render(scene, camera);

        const expDiff = Math.abs(stateRef.current.currentExploded - stateRef.current.explodedAmount);
        if (expDiff > 0.005) {
          renderDirty = true;
        }

        const done = () => {
          renderBusy = false;
          if (renderDirty) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    requestRenderRef.current = requestRender;
    controls.addEventListener('change', requestRender);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 480;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        requestRender();
      }
    };
    window.addEventListener('resize', handleResize);

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => handleResize()) : null;
    if (resizeObserver) {
      resizeObserver.observe(container);
    }

    // Keyboard rotation support for accessibility and testing
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        rootModelGroup.rotation.y -= 0.18;
        requestRender();
      } else if (e.key === 'ArrowRight') {
        rootModelGroup.rotation.y += 0.18;
        requestRender();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Initial render
    rootModelGroup.rotation.y = 0.35;
    handleResize();
    requestRender();

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      controls.removeEventListener('change', requestRender);
      controls.dispose();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.dispose();
    };
  }, []);

  const presetMeta: Record<
    DentalModelPreset,
    { label: string; subtitle: string; partsCount: string; clinicalNote: string }
  > = {
    implant_molar: {
      label: '3D Implant & Molar',
      subtitle: 'Grade-5 Titanium Root Fixture + Zirconia Crown',
      partsCount: '8 Precision Layers',
      clinicalNote: 'Drag to rotate 360° or slide Exploded View to inspect the internal dentin, pulp chamber, hex abutment, and titanium threads.',
    },
    orthodontic_arch: {
      label: 'Fixed Braces Arch',
      subtitle: 'Twin Torque Brackets + Thermal NiTi Archwire',
      partsCount: '10 Arch Components',
      clinicalNote: 'Inspect how self-ligating & twin orthodontic brackets guide crowded teeth into ideal alignment at Dental House Saddar.',
    },
    clear_aligner: {
      label: 'Clear Aligner Twin',
      subtitle: 'Medical-Grade Thermoplastic Tray + Attachments',
      partsCount: '9 Digital Layers',
      clinicalNote: 'Removable invisible aligner therapy paired with composite force-attachments for discreet adult & teen smile correction.',
    },
  };

  const activeInfo = presetMeta[activePreset];

  return (
    <div
      className="relative w-full h-[460px] sm:h-[520px] lg:h-full min-h-[460px] rounded-2xl overflow-hidden bg-[#0B1320] border border-slate-800 flex flex-col justify-between select-none"
      data-testid="dental-3d-viewport"
      data-active-preset={activePreset}
      data-finish-mode={finishMode}
    >
      {/* Isolated WebGL Canvas Mount */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        aria-label={`Interactive 3D dental model showing ${activeInfo.label}`}
      />

      {/* Top-Left Minimal Spec Header Overlay (No backdrop-blur over WebGL) */}
      <div className="relative z-10 p-4 sm:p-5 flex flex-wrap items-start justify-between gap-3 pointer-events-none">
        <div className="bg-[#0F172A]/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 max-w-xs pointer-events-auto">
          <div className="flex items-center gap-2 text-[11px] text-teal-300 font-mono-tabular">
            <span>3D CLINICAL SIMULATOR</span>
            <span aria-hidden="true">·</span>
            <span>{activeInfo.partsCount}</span>
          </div>
          <p className="text-sm font-semibold text-white mt-0.5">{activeInfo.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => onBookSelectedModel(activePreset)}
          className="pointer-events-auto px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
        >
          Book This Treatment →
        </button>
      </div>

      {/* Unified Collapsible Bottom Control Dock (Zero Side-Panel Clutter) */}
      <div className="relative z-10 px-3 pb-3 sm:px-4 sm:pb-4 flex flex-col items-center pointer-events-none">
        <div className="w-full max-w-[620px] pointer-events-auto">
          <div className="flex justify-center mb-1.5">
            <button
              type="button"
              onClick={() => setHudCollapsed((prev) => !prev)}
              className="px-3 py-1 rounded-t-lg bg-[#0F172A]/95 border border-b-0 border-slate-700 text-[11px] font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              aria-expanded={!hudCollapsed}
            >
              {hudCollapsed ? '▴ Show 3D Controls' : '▾ Hide 3D Controls'}
            </button>
          </div>

          {!hudCollapsed && (
            <div className="bg-[#0F172A]/95 border border-slate-700/90 rounded-xl p-3 sm:p-3.5 shadow-xl space-y-2.5">
              {/* Row 1: 3D Model Preset Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div
                  className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 overflow-x-auto max-w-full"
                  role="group"
                  aria-label="3D Dental Model View"
                >
                  {(Object.keys(presetMeta) as DentalModelPreset[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onPresetChange(key)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activePreset === key
                          ? 'bg-teal-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {presetMeta[key].label}
                    </button>
                  ))}
                </div>

                {/* Optical / Surface Finish Switcher */}
                <div
                  className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800"
                  role="group"
                  aria-label="3D Surface Finish Mode"
                >
                  <button
                    type="button"
                    onClick={() => onFinishChange('natural_enamel')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      finishMode === 'natural_enamel'
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Enamel
                  </button>
                  <button
                    type="button"
                    onClick={() => onFinishChange('xray_translucent')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      finishMode === 'xray_translucent'
                        ? 'bg-slate-700 text-teal-300'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    X-Ray
                  </button>
                  <button
                    type="button"
                    onClick={() => onFinishChange('titanium_blueprint')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      finishMode === 'titanium_blueprint'
                        ? 'bg-slate-700 text-sky-300'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Wireframe
                  </button>
                </div>
              </div>

              {/* Row 2: Exploded Anatomy Slider */}
              <div className="flex items-center gap-3 pt-1 border-t border-slate-800/80">
                <label
                  htmlFor="exploded-anatomy-slider"
                  className="text-[11px] font-medium text-slate-300 whitespace-nowrap shrink-0"
                >
                  Anatomy Explode:
                </label>
                <input
                  id="exploded-anatomy-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={explodedAmount}
                  onChange={(e) => onExplodedChange(parseFloat(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] font-mono-tabular text-teal-300 w-9 text-right shrink-0">
                  {Math.round(explodedAmount * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => onExplodedChange(explodedAmount > 0.1 ? 0 : 0.75)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {explodedAmount > 0.1 ? 'Assemble' : 'Explode Layers'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
