// Standalone shader background for the .webgl canvas, adapted from the
// reference Experience/Background implementation for use alongside the
// GSAP-driven carousel (no Gallery/Debug/Trail dependencies required).
import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

// Raw ShaderMaterial writes gl_FragColor directly with no output re-encode,
// so hex colors must stay untouched instead of being auto-converted to linear
THREE.ColorManagement.enabled = false;

// THREE.Color silently no-ops on anything that isn't a 3 or 6-digit hex string,
// leaving the previous value in place instead of resetting it — guard against that
const toValidHex = (hex) => {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex);
  if (!match) {
    console.warn(`Invalid mood color "${hex}", falling back to #000000`);
    return '#000000';
  }
  return hex;
};

// One mood per project scene, in scroll order. Swap these for the real
// brand hex codes as each project's palette is finalized.
const projectMoods = [
  { background: '#FCE8E9', blob1: '#FAC4D2', blob2: '#e0b8bb' }, // Reagan Koble Photography
  { background: '#7A674E', blob1: '#DBC4A5', blob2: '#C2976C' }, // Moonrise Photos
  { background: '#C4B39A', blob1: '#DED1BA', blob2: '#DED1BA' }, // Laura Hartmann Films
  { background: '#F2EDE8', blob1: '#5D747B', blob2: '#F3B884' }, // Captured By Nic (placeholder, pending hex)
].map((mood) => ({
  background: toValidHex(mood.background),
  blob1: toValidHex(mood.blob1),
  blob2: toValidHex(mood.blob2),
}));

const canvas = document.querySelector('.webgl');

if (canvas instanceof HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const currentColors = {
    background: new THREE.Color(projectMoods[0].background),
    blob1: new THREE.Color(projectMoods[0].blob1),
    blob2: new THREE.Color(projectMoods[0].blob2),
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    depthWrite: false,
    depthTest: false,
    uniforms: {
      uBackgroundColor: { value: currentColors.background },
      uBlob1Color: { value: currentColors.blob1 },
      uBlob2Color: { value: currentColors.blob2 },
      uNoiseStrength: { value: 0.035 },
      uBlobRadius: { value: 0.65 },
      uBlobRadiusSecondary: { value: 0.65 * 0.78 },
      uBlobStrength: { value: 0.9 },
      uTime: { value: 0 },
      uVelocityIntensity: { value: 0 },
    },
  });

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  const resize = () => {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  };
  resize();
  window.addEventListener('resize', resize);

  const scratchColor = new THREE.Color();

  // Blends the background mood to match whichever project is centered in view
  const updateMoodFromProgress = (progress) => {
    const steps = Math.max(projectMoods.length - 1, 0);
    const position = THREE.MathUtils.clamp(progress, 0, 1) * steps;
    const index = steps > 0 ? THREE.MathUtils.clamp(Math.floor(position), 0, steps - 1) : 0;
    const blend = steps > 0 ? position - index : 0;

    const from = projectMoods[index] ?? projectMoods[0];
    const to = projectMoods[index + 1] ?? from;

    currentColors.background.set(from.background).lerp(scratchColor.set(to.background), blend);
    currentColors.blob1.set(from.blob1).lerp(scratchColor.set(to.blob1), blend);
    currentColors.blob2.set(from.blob2).lerp(scratchColor.set(to.blob2), blend);

    // Keeps the fixed header/footer text readable against the current background
    const { r, g, b } = currentColors.background;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    // Hysteresis: leaving the dark theme needs a slightly lighter background than entering it
    const threshold = document.body.classList.contains('theme-dark') ? 0.54 : 0.5;
    document.body.classList.toggle('theme-dark', luminance < threshold);
  };

  ScrollTrigger.create({
    trigger: '.scene-wrapper',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => updateMoodFromProgress(self.progress),
    onRefresh: (self) => updateMoodFromProgress(self.progress),
  });

  // Reuse GSAP's own ticker so this doesn't run a second, competing rAF loop
  gsap.ticker.add((time) => {
    material.uniforms.uTime.value = time * 1000;
    renderer.render(scene, camera);
  });
}

