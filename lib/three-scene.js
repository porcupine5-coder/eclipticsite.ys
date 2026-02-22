import * as THREE from 'three';

class HeroScene {
  constructor(containerSelector) {
    if (typeof window === 'undefined') return;

    // We no longer rely strictly on the container for the canvas itself, 
    // as we want a fixed full-screen background.
    // However, we might still use the container for logical reference if needed.
    
    this.canvas = document.getElementById('hero-canvas');
    if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'hero-canvas';
        // Append to body for full screen fixed positioning
        document.body.appendChild(this.canvas);
    }
    
    // Set fixed styles for full screen background
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none'; // Allow clicking through to content

    // Scene setup
    this.scene = new THREE.Scene();
    
    // Orthographic camera for full-screen 2D shader
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas,
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    
    // Mouse tracking variables
    this.mouseX = 0.5;
    this.mouseY = 0.5;
    this.targetMouseX = 0.5;
    this.targetMouseY = 0.5;
    this.prevMouseX = 0.5;
    this.prevMouseY = 0.5;
    this.mouseVelocity = 0;
    this.isDark = document.body.getAttribute('data-theme') === 'dark';

    this.setupRenderer();
    this.createFluidPlane();
    this.addEventListeners();
    this.animate();
  }

  setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  createFluidPlane() {
    // Vertex Shader (Pass-through)
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment Shader (Fluid Effect)
    const fragmentShader = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      uniform float uMouseVelocity;
      uniform float uIsDark;
      varying vec2 vUv;

      // Simplex noise functions
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = vUv;
        vec2 mouseInfluence = uMouse;
        
        // Create flowing noise
        float noise1 = snoise(uv * 3.0 + uTime * 0.2);
        float noise2 = snoise(uv * 2.0 - uTime * 0.15);
        float noise3 = snoise(uv * 4.0 + uTime * 0.3);
        
        // Mouse interaction - create fluid distortion
        vec2 toMouse = uv - mouseInfluence;
        float mouseDist = length(toMouse);
        float mouseEffect = smoothstep(0.4, 0.0, mouseDist) * uMouseVelocity;
        
        // Distort UV coordinates based on mouse
        vec2 distortedUV = uv;
        distortedUV += normalize(toMouse) * mouseEffect * 0.3;
        distortedUV += vec2(noise1, noise2) * 0.05;
        
        // Create animated gradient with distortion
        float gradient1 = sin(distortedUV.x * 2.0 + uTime * 0.5 + noise1) * 0.5 + 0.5;
        float gradient2 = cos(distortedUV.y * 2.0 - uTime * 0.3 + noise2) * 0.5 + 0.5;
        float gradient3 = sin((distortedUV.x + distortedUV.y) * 1.5 + uTime * 0.4 + noise3) * 0.5 + 0.5;
        
        vec3 color;
        
        if (uIsDark > 0.5) {
          // Dark mode - deep blues and purples (Matched to Cyberpunk Theme)
          vec3 color1 = vec3(0.07, 0.09, 0.15); // Dark BG
          vec3 color2 = vec3(0.15, 0.10, 0.30); // Deep Purple
          vec3 color3 = vec3(0.25, 0.20, 0.60); // Indigo
          vec3 color4 = vec3(0.40, 0.10, 0.40); // Dark Pink accent
          
          color = mix(color1, color2, gradient1);
          color = mix(color, color3, gradient2);
          color = mix(color, color4, gradient3 * 0.5);
          
          // Add mouse glow (Cyan/Blue)
          color += vec3(0.2, 0.8, 1.0) * mouseEffect * 0.4;
        } else {
          // Light mode - soft pastels (Matched to Light Theme)
          vec3 color1 = vec3(0.98, 0.98, 0.99); // Off white
          vec3 color2 = vec3(0.90, 0.92, 0.98); // Light blueish
          vec3 color3 = vec3(0.85, 0.90, 0.95); // Sky blue
          vec3 color4 = vec3(0.95, 0.85, 0.90); // Light pinkish
          
          color = mix(color1, color2, gradient1);
          color = mix(color, color3, gradient2);
          color = mix(color, color4, gradient3 * 0.4);
          
          // Add mouse glow
          color += vec3(0.4, 0.4, 0.95) * mouseEffect * 0.3;
        }
        
        // Add subtle vignette
        float vignette = smoothstep(1.2, 0.3, length(uv - 0.5));
        color *= 0.85 + vignette * 0.15;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Create Plane
    const geometry = new THREE.PlaneGeometry(2, 2);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uMouseVelocity: { value: 0 },
        uIsDark: { value: this.isDark ? 1.0 : 0.0 }
      }
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);
  }

  addEventListeners() {
    this.resizeHandler = () => this.onResize();
    this.mouseMoveHandler = (e) => this.onMouseMove(e);
    this.touchMoveHandler = (e) => this.onTouchMove(e);

    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('mousemove', this.mouseMoveHandler);
    window.addEventListener('touchmove', this.touchMoveHandler);

    // MutationObserver to watch for theme changes on body
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          this.updateTheme();
        }
      });
    });

    this.observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  onResize() {
    if (!this.material) return;
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.material.uniforms.uResolution.value.set(
      window.innerWidth, 
      window.innerHeight
    );
  }

  onMouseMove(e) {
    this.targetMouseX = e.clientX / window.innerWidth;
    this.targetMouseY = 1.0 - (e.clientY / window.innerHeight);
  }

  onTouchMove(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.targetMouseX = touch.clientX / window.innerWidth;
      this.targetMouseY = 1.0 - (touch.clientY / window.innerHeight);
    }
  }

  updateTheme() {
    this.isDark = document.body.getAttribute('data-theme') === 'dark';
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  animate() {
    if (!this.renderer) return;
    
    requestAnimationFrame(() => this.animate());

    // Smooth mouse following
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.1;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.1;

    // Calculate velocity
    const dx = this.mouseX - this.prevMouseX;
    const dy = this.mouseY - this.prevMouseY;
    const currentVelocity = Math.sqrt(dx * dx + dy * dy);
    this.mouseVelocity += (currentVelocity - this.mouseVelocity) * 0.1;

    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;

    if (this.material) {
      this.material.uniforms.uTime.value += 0.01;
      this.material.uniforms.uMouse.value.set(this.mouseX, this.mouseY);
      this.material.uniforms.uMouseVelocity.value = this.mouseVelocity * 20;
      
      // Smoothly transition uIsDark
      const targetDark = this.isDark ? 1.0 : 0.0;
      const currentDark = this.material.uniforms.uIsDark.value;
      this.material.uniforms.uIsDark.value += (targetDark - currentDark) * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    if (this.mouseMoveHandler) window.removeEventListener('mousemove', this.mouseMoveHandler);
    if (this.touchMoveHandler) window.removeEventListener('touchmove', this.touchMoveHandler);
    if (this.observer) this.observer.disconnect();
    if (this.renderer) {
        this.renderer.dispose();
        // Also remove the canvas
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
  }
}

export default HeroScene;
