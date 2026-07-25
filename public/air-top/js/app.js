// src/tops.js
var TOPS = [
  {
    id: "wood",
    label: "\u6728\u8D28",
    short: "\u6728",
    color: "#c4783a",
    friction: 0.985,
    mass: 1,
    humBase: 90,
    description: "\u7A33\u3001\u6E29\u6DA6"
  },
  {
    id: "metal",
    label: "\u91D1\u5C5E",
    short: "\u91D1",
    color: "#8aa0b4",
    friction: 0.992,
    mass: 1.35,
    humBase: 70,
    description: "\u6C89\u3001\u6301\u4E45"
  },
  {
    id: "neon",
    label: "\u9713\u8679",
    short: "\u9713",
    color: "#3ecf9a",
    friction: 0.978,
    mass: 0.75,
    humBase: 130,
    description: "\u8F7B\u3001\u654F\u611F"
  },
  {
    id: "glass",
    label: "\u7409\u7483",
    short: "\u7483",
    color: "#6eb8e8",
    friction: 0.988,
    mass: 0.9,
    humBase: 110,
    description: "\u900F\u3001\u7075\u52A8"
  }
];
var PHYSICS = {
  minRpmAlive: 40,
  maxRpm: 2400,
  whipBoost: 280,
  tapBoost: 120,
  fallLean: 28,
  leanStep: 4.5,
  uprightRate: 0.12
};

// src/physics.js
var TopPhysics = class {
  constructor(top) {
    this.applyTop(top);
    this.reset();
  }
  applyTop(top) {
    this.top = top;
    this.friction = top.friction;
    this.mass = top.mass;
  }
  reset() {
    this.rpm = 0;
    this.angle = 0;
    this.leanX = 0;
    this.leanY = 0;
    this.wobble = 0;
    this.alive = false;
    this.fallen = false;
    this.spinTime = 0;
    this.maxRpm = 0;
    this.lastFallenAt = 0;
  }
  whip(velocity = 0.85) {
    if (this.fallen) this.revive();
    const boost = PHYSICS.whipBoost / this.mass * Math.min(1.3, Math.max(0.4, velocity));
    this.rpm = Math.min(PHYSICS.maxRpm, this.rpm + boost);
    this.alive = true;
    this.fallen = false;
    this.maxRpm = Math.max(this.maxRpm, this.rpm);
  }
  tap(velocity = 0.85) {
    if (this.fallen) {
      this.revive();
      this.rpm = Math.min(PHYSICS.maxRpm, this.rpm + PHYSICS.tapBoost * 0.6);
      return;
    }
    const boost = PHYSICS.tapBoost / this.mass * Math.min(1.2, Math.max(0.35, velocity));
    this.rpm = Math.min(PHYSICS.maxRpm, this.rpm + boost);
    this.leanX *= 0.72;
    this.leanY *= 0.72;
    this.alive = true;
    this.maxRpm = Math.max(this.maxRpm, this.rpm);
  }
  revive() {
    this.fallen = false;
    this.alive = true;
    this.leanX = 0;
    this.leanY = 0;
    this.wobble = 0;
    this.spinTime = 0;
  }
  upright() {
    this.leanX = 0;
    this.leanY = 0;
    this.wobble *= 0.3;
    if (this.fallen && this.rpm > PHYSICS.minRpmAlive) {
      this.fallen = false;
      this.alive = true;
    }
  }
  lean(dx, dy) {
    if (this.fallen) return;
    this.leanX = clamp(this.leanX + dx, -40, 40);
    this.leanY = clamp(this.leanY + dy, -40, 40);
  }
  /**
   * @param {number} dt seconds
   */
  update(dt) {
    if (this.fallen) {
      this.rpm = Math.max(0, this.rpm * Math.pow(0.9, dt * 60));
      this.wobble = Math.min(1, this.wobble + dt * 0.4);
      return this.snapshot();
    }
    if (this.rpm > 1) {
      this.alive = true;
      this.spinTime += dt;
      const spinRate = this.rpm / 60 * Math.PI * 2;
      this.angle += spinRate * dt;
      const leanMag = Math.hypot(this.leanX, this.leanY);
      const leanDrag = 1 - Math.min(0.04, leanMag * 8e-4);
      this.rpm *= Math.pow(this.friction * leanDrag, dt * 60);
      const stability = Math.min(1, this.rpm / 800);
      this.leanX *= 1 - PHYSICS.uprightRate * stability * dt * 8;
      this.leanY *= 1 - PHYSICS.uprightRate * stability * dt * 8;
      const wobbleTarget = leanMag / 40 * (1 - stability) + (1 - Math.min(1, this.rpm / 300)) * 0.35;
      this.wobble += (wobbleTarget - this.wobble) * Math.min(1, dt * 4);
      this.maxRpm = Math.max(this.maxRpm, this.rpm);
      if (this.rpm < PHYSICS.minRpmAlive && leanMag > PHYSICS.fallLean * 0.55) {
        this.fall();
      } else if (this.rpm < PHYSICS.minRpmAlive * 0.5) {
        this.fall();
      } else if (leanMag > PHYSICS.fallLean && this.rpm < 500) {
        this.fall();
      }
    } else {
      this.rpm = 0;
      this.alive = false;
      this.wobble *= 0.95;
    }
    return this.snapshot();
  }
  fall() {
    if (this.fallen) return;
    this.fallen = true;
    this.alive = false;
    this.lastFallenAt = Date.now();
  }
  snapshot() {
    return {
      rpm: this.rpm,
      angle: this.angle,
      leanX: this.leanX,
      leanY: this.leanY,
      leanMag: Math.hypot(this.leanX, this.leanY),
      wobble: this.wobble,
      alive: this.alive,
      fallen: this.fallen,
      spinTime: this.spinTime,
      maxRpm: this.maxRpm
    };
  }
};
function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// src/audio-engine.js
var AudioEngine = class {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    this.humOsc = null;
    this.humOsc2 = null;
    this.humGain = null;
    this.humFilter = null;
    this.noiseSrc = null;
    this.noiseGain = null;
    this.humBase = 90;
    this.running = false;
  }
  async ensure() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") await this.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.65;
    this.master.connect(this.ctx.destination);
    this._buildHum();
  }
  _buildHum() {
    this.humOsc = this.ctx.createOscillator();
    this.humOsc2 = this.ctx.createOscillator();
    this.humFilter = this.ctx.createBiquadFilter();
    this.humGain = this.ctx.createGain();
    this.humOsc.type = "sawtooth";
    this.humOsc2.type = "triangle";
    this.humOsc.frequency.value = this.humBase;
    this.humOsc2.frequency.value = this.humBase * 1.01;
    this.humFilter.type = "lowpass";
    this.humFilter.frequency.value = 900;
    this.humFilter.Q.value = 0.7;
    this.humGain.gain.value = 1e-4;
    this.humOsc.connect(this.humFilter);
    this.humOsc2.connect(this.humFilter);
    this.humFilter.connect(this.humGain);
    this.humGain.connect(this.master);
    const noiseBuf = this._noiseBuffer(2);
    this.noiseSrc = this.ctx.createBufferSource();
    this.noiseSrc.buffer = noiseBuf;
    this.noiseSrc.loop = true;
    const np = this.ctx.createBiquadFilter();
    np.type = "bandpass";
    np.frequency.value = 1800;
    np.Q.value = 0.6;
    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.value = 1e-4;
    this.noiseSrc.connect(np);
    np.connect(this.noiseGain);
    this.noiseGain.connect(this.master);
    this.humOsc.start();
    this.humOsc2.start();
    this.noiseSrc.start();
    this.running = true;
  }
  setTopProfile(top) {
    this.humBase = top.humBase ?? 90;
  }
  setMuted(muted) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.65, this.ctx.currentTime, 0.02);
    }
  }
  /**
   * Drive continuous tone from physics snapshot.
   * @param {{ rpm: number, fallen: boolean, leanMag: number }} snap
   */
  sync(snap) {
    if (!this.ctx || !this.humGain || this.muted) return;
    const t = this.ctx.currentTime;
    const rpm = snap.fallen ? snap.rpm * 0.2 : snap.rpm;
    const norm = Math.min(1, rpm / 1800);
    const freq = this.humBase + norm * 220 + (snap.leanMag || 0) * 0.4;
    const vol = norm < 0.02 ? 1e-4 : 0.04 + norm * 0.22;
    this.humOsc.frequency.setTargetAtTime(freq, t, 0.05);
    this.humOsc2.frequency.setTargetAtTime(freq * 1.008, t, 0.05);
    this.humFilter.frequency.setTargetAtTime(600 + norm * 2200, t, 0.08);
    this.humGain.gain.setTargetAtTime(vol, t, 0.06);
    this.noiseGain.gain.setTargetAtTime(norm * 0.04, t, 0.08);
  }
  async whip(velocity = 0.85) {
    await this.ensure();
    if (this.muted) return;
    const t = this.ctx.currentTime;
    const v = Math.min(1.3, Math.max(0.3, velocity));
    const noise = this._noiseBuffer(0.25);
    const src = this.ctx.createBufferSource();
    src.buffer = noise;
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 900 + v * 800;
    bp.Q.value = 1.2;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.35 * v, t);
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.18);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    src.start(t);
    const osc = this.ctx.createOscillator();
    const og = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180 + v * 80, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);
    og.gain.setValueAtTime(0.2 * v, t);
    og.gain.exponentialRampToValueAtTime(1e-4, t + 0.14);
    osc.connect(og);
    og.connect(this.master);
    osc.start(t);
    osc.stop(t + 0.16);
  }
  async tap(velocity = 0.85) {
    await this.ensure();
    if (this.muted) return;
    const t = this.ctx.currentTime;
    const v = Math.min(1.2, Math.max(0.3, velocity));
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.08);
    g.gain.setValueAtTime(0.28 * v, t);
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.1);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t);
    osc.stop(t + 0.12);
    const click = this.ctx.createOscillator();
    const cg = this.ctx.createGain();
    click.type = "square";
    click.frequency.value = 640;
    cg.gain.setValueAtTime(0.08 * v, t);
    cg.gain.exponentialRampToValueAtTime(1e-4, t + 0.03);
    click.connect(cg);
    cg.connect(this.master);
    click.start(t);
    click.stop(t + 0.04);
  }
  async fall() {
    await this.ensure();
    if (this.muted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.45);
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.5);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t);
    osc.stop(t + 0.55);
  }
  _noiseBuffer(duration) {
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }
};

// src/wearable-input.js
var WEARABLE_DEFAULTS = {
  RING_TILT: 5,
  RING_SHAKE: 20,
  CANE_TAP: 8,
  CANE_SWING: 3,
  RING_THROTTLE: 8,
  CANE_THROTTLE: 6
};
function createWearableInput(handlers = {}) {
  const {
    RING_TILT,
    RING_SHAKE,
    CANE_TAP,
    CANE_SWING,
    RING_THROTTLE,
    CANE_THROTTLE
  } = WEARABLE_DEFAULTS;
  const throttleMs = handlers.throttleMs ?? 600;
  let ringFrames = 0;
  let caneFrames = 0;
  let lastBeta = 0;
  let lastGamma = 0;
  let listening = false;
  let orientationHandler = null;
  let motionHandler = null;
  let lastAction = 0;
  function throttleAction(fn, ms = throttleMs) {
    const now = Date.now();
    if (now - lastAction < ms) return;
    lastAction = now;
    fn?.();
  }
  function onRing(e) {
    ringFrames++;
    if (ringFrames % RING_THROTTLE !== 0) return;
    const beta = e.beta ?? 0;
    const gamma = e.gamma ?? 0;
    const dBeta = Math.abs(beta - lastBeta);
    const dGamma = Math.abs(gamma - lastGamma);
    lastBeta = beta;
    lastGamma = gamma;
    if (dBeta > RING_SHAKE || dGamma > RING_SHAKE) {
      throttleAction(() => handlers.onRingShake?.());
      return;
    }
    if (beta > RING_TILT) handlers.onRingTiltDown?.();
    else if (beta < -RING_TILT) handlers.onRingTiltUp?.();
    if (gamma > RING_TILT) handlers.onRingTiltRight?.();
    else if (gamma < -RING_TILT) handlers.onRingTiltLeft?.();
  }
  function onCane(e) {
    caneFrames++;
    if (caneFrames % CANE_THROTTLE !== 0) return;
    const a = e.accelerationIncludingGravity || e.acceleration;
    if (!a) return;
    const mag = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2);
    const spike = Math.abs(mag - 9.8);
    if (spike > CANE_TAP) {
      throttleAction(() => handlers.onCaneTap?.());
      return;
    }
    if (Math.abs(a.x || 0) > CANE_SWING) {
      const dir = (a.x || 0) > 0 ? "right" : "left";
      throttleAction(() => {
        handlers.onCaneSwing?.(dir);
        if (dir === "right") handlers.onCaneSwingRight?.();
        else handlers.onCaneSwingLeft?.();
      }, 800);
    }
  }
  async function requestPermission() {
    let ok = true;
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        ok = await DeviceOrientationEvent.requestPermission() === "granted";
      } catch {
        ok = false;
      }
    }
    if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        ok = ok && await DeviceMotionEvent.requestPermission() === "granted";
      } catch {
        ok = false;
      }
    }
    return ok;
  }
  function start() {
    if (listening || typeof window === "undefined") return;
    listening = true;
    orientationHandler = onRing;
    motionHandler = onCane;
    window.addEventListener("deviceorientation", orientationHandler);
    window.addEventListener("devicemotion", motionHandler);
  }
  function stop() {
    if (!listening) return;
    listening = false;
    if (typeof window !== "undefined") {
      if (orientationHandler) window.removeEventListener("deviceorientation", orientationHandler);
      if (motionHandler) window.removeEventListener("devicemotion", motionHandler);
    }
    orientationHandler = null;
    motionHandler = null;
  }
  return {
    start,
    stop,
    requestPermission,
    isListening: () => listening,
    get listening() {
      return listening;
    }
  };
}
var WearableInput = class {
  /**
   * @param {{
   *   onGesture?: (gesture: string, detail?: object) => void,
   *   onAction?: (action: string) => void,
   *   onBadge?: (kind: string, text: string, active: boolean) => void,
   *   profile?: 'generic'|'aim-draw'|'steer'|'relay',
   *   ringBadgeId?: string,
   *   caneBadgeId?: string,
   * }} opts
   */
  constructor(opts = {}) {
    this.onGesture = opts.onGesture ?? (() => {
    });
    this.onAction = opts.onAction;
    this.onBadge = opts.onBadge ?? (() => {
    });
    this.profile = opts.profile || "aim-draw";
    this.ringBadgeId = opts.ringBadgeId || "ring-badge";
    this.caneBadgeId = opts.caneBadgeId || "cane-badge";
    this.ringActive = false;
    this.caneActive = false;
    this.ringFrame = 0;
    this.caneFrame = 0;
    this.ringPrevBeta = null;
    this.ringPrevGamma = null;
    this.caneLastAccel = { x: 0, y: 0, z: 0 };
    this.canePrevGamma = null;
    this.lastHitAt = 0;
    this.neutralBeta = null;
  }
  setupRing() {
    if (typeof DeviceOrientationEvent === "undefined") return;
    this.onBadge("ring", "\u6212\u6307 \xB7 \u70B9\u51FB\u542F\u7528", false);
    const enable = async () => {
      try {
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
          const perm = await DeviceOrientationEvent.requestPermission();
          if (perm !== "granted") return;
        }
        this.ringActive = true;
        this.neutralBeta = null;
        this.onBadge("ring", "\u6212\u6307 \xB7 \u5DF2\u8FDE\u63A5", true);
        window.addEventListener("deviceorientation", (e) => this.handleRing(e));
      } catch {
        this.onBadge("ring", "\u6212\u6307 \xB7 \u4E0D\u652F\u6301", false);
      }
    };
    document.getElementById(this.ringBadgeId)?.addEventListener("click", enable, { once: true });
    if (typeof DeviceOrientationEvent.requestPermission !== "function") enable();
  }
  setupCane() {
    if (typeof DeviceMotionEvent === "undefined") return;
    this.onBadge("cane", "\u624B\u6756 \xB7 \u70B9\u51FB\u542F\u7528", false);
    const enable = async () => {
      try {
        if (typeof DeviceMotionEvent.requestPermission === "function") {
          const perm = await DeviceMotionEvent.requestPermission();
          if (perm !== "granted") return;
        }
        this.caneActive = true;
        this.onBadge("cane", "\u624B\u6756 \xB7 \u5DF2\u8FDE\u63A5", true);
        window.addEventListener("devicemotion", (e) => this.handleCane(e));
      } catch {
        this.onBadge("cane", "\u624B\u6756 \xB7 \u4E0D\u652F\u6301", false);
      }
    };
    document.getElementById(this.caneBadgeId)?.addEventListener("click", enable, { once: true });
    if (typeof DeviceMotionEvent.requestPermission !== "function") enable();
  }
  handleRing(e) {
    if (!this.ringActive) return;
    this.ringFrame++;
    const beta = e.beta || 0;
    const gamma = e.gamma || 0;
    const { RING_TILT, RING_SHAKE, RING_THROTTLE } = WEARABLE_DEFAULTS;
    if (this.profile === "aim-draw") {
      if (this.ringFrame % 2 === 0) {
        const x = Math.max(-1, Math.min(1, gamma / 45));
        const y = Math.max(-1, Math.min(1, beta / 45));
        this.onGesture("aim", { x, y });
      }
      if (this.ringFrame % RING_THROTTLE !== 0) return;
      if (this.ringPrevBeta === null) {
        this.ringPrevBeta = beta;
        this.ringPrevGamma = gamma;
        return;
      }
      const dBeta2 = beta - this.ringPrevBeta;
      const dGamma2 = gamma - this.ringPrevGamma;
      this.ringPrevBeta = beta;
      this.ringPrevGamma = gamma;
      if (Math.abs(dBeta2) > RING_SHAKE || Math.abs(dGamma2) > RING_SHAKE) {
        this.onGesture("cancel_draw");
      }
      return;
    }
    if (this.profile === "steer") {
      if (this.ringFrame % 2 === 0) {
        const x = Math.max(-1, Math.min(1, gamma / 35));
        const y = Math.max(-1, Math.min(1, (beta - 45) / 35));
        this.onGesture("steer", { x, y });
      }
      return;
    }
    if (this.profile === "relay") {
      if (this.ringFrame % RING_THROTTLE !== 0) return;
      if (this.ringPrevBeta === null) {
        this.ringPrevBeta = beta;
        this.ringPrevGamma = gamma;
        return;
      }
      const dBeta2 = Math.abs(beta - this.ringPrevBeta);
      const dGamma2 = Math.abs(gamma - this.ringPrevGamma);
      this.ringPrevBeta = beta;
      this.ringPrevGamma = gamma;
      if (dBeta2 > RING_SHAKE || dGamma2 > RING_SHAKE) {
        this.onAction?.("relayToggle");
        return;
      }
      if (dBeta2 > RING_TILT || dGamma2 > RING_TILT) {
        if (beta > 0) this.onAction?.("relayOn");
        else this.onAction?.("relayOff");
      }
      return;
    }
    if (this.ringFrame % RING_THROTTLE !== 0) return;
    if (this.ringPrevBeta === null) {
      this.ringPrevBeta = beta;
      this.ringPrevGamma = gamma;
      return;
    }
    const dBeta = Math.abs(beta - this.ringPrevBeta);
    const dGamma = Math.abs(gamma - this.ringPrevGamma);
    this.ringPrevBeta = beta;
    this.ringPrevGamma = gamma;
    if (dBeta > RING_SHAKE || dGamma > RING_SHAKE) {
      this.onGesture("shake", { dBeta, dGamma });
      return;
    }
    if (gamma > RING_TILT) this.onGesture("tilt", { dir: "right", gamma });
    else if (gamma < -RING_TILT) this.onGesture("tilt", { dir: "left", gamma });
    else if (beta > RING_TILT) this.onGesture("tilt", { dir: "up", beta });
    else if (beta < -RING_TILT) this.onGesture("tilt", { dir: "down", beta });
  }
  handleCane(e) {
    if (!this.caneActive) return;
    this.caneFrame++;
    const { CANE_TAP, CANE_SWING, CANE_THROTTLE } = WEARABLE_DEFAULTS;
    if (this.caneFrame % CANE_THROTTLE !== 0) return;
    const a = e.accelerationIncludingGravity || e.acceleration || { x: 0, y: 0, z: 0 };
    const dax = Math.abs((a.x || 0) - this.caneLastAccel.x);
    const day = Math.abs((a.y || 0) - this.caneLastAccel.y);
    const daz = Math.abs((a.z || 0) - this.caneLastAccel.z);
    this.caneLastAccel = { x: a.x || 0, y: a.y || 0, z: a.z || 0 };
    if (this.profile === "aim-draw") {
      if (dax > CANE_TAP || day > CANE_TAP || daz > CANE_TAP) {
        const now = Date.now();
        if (now - this.lastHitAt < 160) return;
        this.lastHitAt = now;
        const velocity = Math.min(1.25, Math.max(dax, day, daz) / 14);
        this.onGesture("release", { velocity });
        return;
      }
      const rot = e.rotationRate || { gamma: 0 };
      const rg = rot.gamma || 0;
      if (this.canePrevGamma !== null && Math.abs(rg - this.canePrevGamma) > CANE_SWING) {
        const now = Date.now();
        if (now - this.lastHitAt >= 100) {
          this.lastHitAt = now;
          const velocity = Math.min(1.2, Math.abs(rg - this.canePrevGamma) / 12);
          this.onGesture("draw", { velocity });
        }
      }
      this.canePrevGamma = rg;
      return;
    }
    if (this.profile === "relay") {
      if (dax > CANE_TAP || day > CANE_TAP || daz > CANE_TAP) this.onAction?.("relayToggle");
      return;
    }
    if (dax > CANE_TAP || day > CANE_TAP || daz > CANE_TAP) {
      const mag = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2);
      this.onGesture("tap", { spike: Math.max(dax, day, daz), mag });
      if (this.profile === "steer") this.onGesture("chirp", {});
      return;
    }
    if (Math.abs(a.x || 0) > CANE_SWING) {
      const dir = (a.x || 0) > 0 ? "right" : "left";
      this.onGesture("swing", { dir });
    }
  }
};
function attachWearableEnableButton(buttonId = "wearable-enable") {
  if (typeof document === "undefined") return;
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  const input = createWearableInput({
    onRingShake: () => window.onWearableGesture?.("shake", {}),
    onRingTiltUp: () => window.onWearableGesture?.("tilt", { dir: "up" }),
    onRingTiltDown: () => window.onWearableGesture?.("tilt", { dir: "down" }),
    onRingTiltLeft: () => window.onWearableGesture?.("tilt", { dir: "left" }),
    onRingTiltRight: () => window.onWearableGesture?.("tilt", { dir: "right" }),
    onCaneTap: () => window.onWearableGesture?.("tap", {}),
    onCaneSwing: (dir) => window.onWearableGesture?.("swing", { dir })
  });
  btn.addEventListener("click", async () => {
    const ok = await input.requestPermission().catch(() => false);
    if (!ok) return;
    input.start();
    btn.textContent = "\u6212\u6307/\u624B\u6756\u5DF2\u542F\u7528";
  });
}
if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.WearableInput = WearableInput;
  window.createWearableInput = createWearableInput;
  window.WEARABLE_DEFAULTS = WEARABLE_DEFAULTS;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => attachWearableEnableButton());
  } else {
    attachWearableEnableButton();
  }
}

// src/app.js
var $ = (id) => document.getElementById(id);
var audio = new AudioEngine();
var state = {
  topIndex: 0,
  muted: false,
  bestTime: Number(localStorage.getItem("air-top-best") || 0),
  sessionBest: 0
};
var physics = new TopPhysics(TOPS[0]);
var lastTs = 0;
var wasFallen = false;
function currentTop() {
  return TOPS[state.topIndex];
}
function wrap(i, n) {
  return (i % n + n) % n;
}
function showToast(msg) {
  const el = $("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("show"), 1200);
}
function haptic(ms = 14) {
  try {
    if (navigator.vibrate) navigator.vibrate(ms);
  } catch {
  }
}
function applyTheme() {
  const top = currentTop();
  document.documentElement.style.setProperty("--accent", top.color);
  document.body.dataset.top = top.id;
  audio.setTopProfile(top);
}
function formatTime(sec) {
  const s = Math.floor(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}:${String(r).padStart(2, "0")}` : `${r}s`;
}
function renderChrome() {
  const top = currentTop();
  applyTheme();
  $("top-name").textContent = top.label;
  $("top-hint").textContent = top.description;
  const tabs = $("top-tabs");
  tabs.innerHTML = TOPS.map(
    (t, i) => `
    <button type="button" class="top-tab ${i === state.topIndex ? "active" : ""}" data-i="${i}">
      ${t.label}
    </button>`
  ).join("");
  const muteBtn = $("mute-btn");
  muteBtn.classList.toggle("on", state.muted);
  const muteLabel = state.muted ? "\u5DF2\u9759\u97F3" : "\u9759\u97F3";
  muteBtn.setAttribute("aria-label", muteLabel);
  muteBtn.dataset.tip = muteLabel;
  muteBtn.title = muteLabel;
  $("best-time").textContent = formatTime(Math.max(state.bestTime, state.sessionBest));
}
function renderHud(snap) {
  $("rpm").textContent = String(Math.round(snap.rpm));
  $("spin-time").textContent = formatTime(snap.spinTime);
  $("lean-val").textContent = `${snap.leanMag.toFixed(0)}\xB0`;
  $("status").textContent = snap.fallen ? "\u5012\u4E0B\u4E86" : snap.alive ? "\u65CB\u8F6C\u4E2D" : "\u5F85\u547D";
  $("status").dataset.state = snap.fallen ? "fallen" : snap.alive ? "spin" : "idle";
  const topEl = $("top-visual");
  const shadow = $("shadow");
  const leanX = snap.leanX;
  const leanY = snap.leanY;
  const wobble = snap.wobble * 8;
  const rot = snap.angle * 180 / Math.PI;
  const tilt = Math.min(32, snap.leanMag * 0.9);
  const scale = snap.fallen ? 0.92 : 1;
  if (snap.fallen) {
    topEl.style.transform = `translate(${leanX * 1.2}px, 28px) rotate(${45 + leanX}deg) scale(${scale})`;
    topEl.classList.add("fallen");
  } else {
    topEl.classList.remove("fallen");
    topEl.style.transform = `
      translate(${leanX * 0.6 + Math.sin(snap.angle * 3) * wobble * 0.15}px, ${leanY * 0.15}px)
      rotateX(${12 + tilt * 0.3}deg)
      rotateZ(${rot}deg)
      rotateY(${leanX * 0.35}deg)
      scale(${scale})
    `;
  }
  const spinBody = $("top-body");
  if (spinBody) {
    spinBody.style.setProperty("--spin", `${rot}deg`);
  }
  shadow.style.transform = `translateX(${leanX * 0.9}px) scale(${1 + snap.leanMag * 8e-3}, ${0.55 + snap.wobble * 0.2})`;
  shadow.style.opacity = String(0.25 + Math.min(0.45, snap.rpm / 3e3));
  const rpmBar = $("rpm-bar");
  if (rpmBar) {
    rpmBar.style.width = `${Math.min(100, snap.rpm / PHYSICS.maxRpm * 100)}%`;
  }
}
function selectTop(i) {
  state.topIndex = wrap(i, TOPS.length);
  physics.applyTop(currentTop());
  renderChrome();
  showToast(`\u9640\u87BA \xB7 ${currentTop().label}`);
  haptic(8);
}
function setMuted(muted) {
  state.muted = muted;
  audio.setMuted(muted);
  renderChrome();
  showToast(muted ? "\u5DF2\u9759\u97F3" : "\u53D6\u6D88\u9759\u97F3");
}
async function doWhip(detail = {}) {
  await audio.ensure();
  const v = detail.velocity ?? 0.95;
  physics.whip(v);
  await audio.whip(v);
  haptic(18);
  const el = $("top-visual");
  el.classList.remove("whip");
  void el.offsetWidth;
  el.classList.add("whip");
  showToast("\u62BD\uFF01");
}
async function doTap(detail = {}) {
  await audio.ensure();
  const v = detail.velocity ?? 0.9;
  physics.tap(v);
  await audio.tap(v);
  haptic(12);
  showToast("\u70B9\u5730");
}
function doUpright() {
  physics.upright();
  haptic(10);
  showToast("\u6276\u6B63");
}
function handleGesture(gesture, detail) {
  switch (gesture) {
    case "lean_left":
      physics.lean(-PHYSICS.leanStep, 0);
      break;
    case "lean_right":
      physics.lean(PHYSICS.leanStep, 0);
      break;
    case "prev_top":
      selectTop(state.topIndex - 1);
      break;
    case "next_top":
      selectTop(state.topIndex + 1);
      break;
    case "whip":
      doWhip(detail || { velocity: 0.85 });
      break;
    case "tap":
      doTap(detail || { velocity: 0.85 });
      break;
    case "toggle_mute":
      setMuted(!state.muted);
      break;
    default:
      break;
  }
}
var wearable = new WearableInput({
  onGesture: handleGesture,
  onBadge: (kind, text, active) => {
    const el = $(`${kind}-badge`);
    if (!el) return;
    el.textContent = text;
    el.classList.toggle("active", active);
  }
});
function bindUi() {
  $("top-tabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".top-tab");
    if (!btn) return;
    selectTop(Number(btn.dataset.i));
  });
  $("whip-btn").addEventListener("click", () => doWhip({ velocity: 1 }));
  $("tap-btn").addEventListener("click", () => doTap({ velocity: 0.95 }));
  $("upright-btn").addEventListener("click", doUpright);
  $("mute-btn").addEventListener("click", () => setMuted(!state.muted));
  const stage = $("arena");
  let dragging = false;
  let lastX = 0;
  stage.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    stage.setPointerCapture?.(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    physics.lean(dx * 0.08, 0);
  });
  stage.addEventListener("pointerup", () => {
    dragging = false;
  });
  stage.addEventListener("pointercancel", () => {
    dragging = false;
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      e.preventDefault();
      doWhip({ velocity: 0.95 });
    } else if (e.key === "t" || e.key === "T") doTap({ velocity: 0.9 });
    else if (e.key === "r" || e.key === "R") doUpright();
    else if (e.key === "ArrowLeft") physics.lean(-PHYSICS.leanStep, 0);
    else if (e.key === "ArrowRight") physics.lean(PHYSICS.leanStep, 0);
    else if (e.key === "ArrowUp") selectTop(state.topIndex - 1);
    else if (e.key === "ArrowDown") selectTop(state.topIndex + 1);
    else if (e.key === "m" || e.key === "M") setMuted(!state.muted);
  });
}
function loop(ts) {
  if (!lastTs) lastTs = ts;
  const dt = Math.min(0.05, (ts - lastTs) / 1e3);
  lastTs = ts;
  const snap = physics.update(dt);
  renderHud(snap);
  audio.sync(snap);
  if (snap.fallen && !wasFallen) {
    audio.fall();
    haptic([20, 40, 20]);
    state.sessionBest = Math.max(state.sessionBest, snap.spinTime);
    if (snap.spinTime > state.bestTime) {
      state.bestTime = snap.spinTime;
      localStorage.setItem("air-top-best", String(state.bestTime));
      showToast(`\u65B0\u7EAA\u5F55 ${formatTime(snap.spinTime)}`);
    } else {
      showToast(`\u5012\u4E0B \xB7 ${formatTime(snap.spinTime)}`);
    }
    renderChrome();
  }
  wasFallen = snap.fallen;
  requestAnimationFrame(loop);
}
renderChrome();
bindUi();
wearable.setupRing();
wearable.setupCane();
requestAnimationFrame(loop);
document.body.addEventListener(
  "pointerdown",
  () => {
    audio.ensure();
  },
  { once: true }
);
//# sourceMappingURL=app.js.map
