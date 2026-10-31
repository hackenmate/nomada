// Lightweight organic ambient sound manager using Web Audio API
// Generates natural wind textures, architectural room resonance, and scroll-reactive harmonics

class AmbientAudioManager {
  private ctx: AudioContext | null = null;
  private isRunning = false;
  private isMuted = false;

  // Audio Nodes
  private masterGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private lfoGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;

  // Base parameters
  private targetMasterVolume = 0.055;
  private baseFilterFreq = 240;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generate pink/brown noise for natural wind gusts
  private createNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('Context not initialized');
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  public toggle(): boolean {
    if (this.isRunning && !this.isMuted) {
      this.stop(1.5);
      return false;
    } else {
      this.start(2.0);
      this.setMuted(false);
      return true;
    }
  }

  public start(fadeInSeconds = 2.5) {
    if (this.isRunning) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Master output gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, now);
      const targetVolume = this.isMuted ? 0.0001 : this.targetMasterVolume;
      this.masterGain.gain.exponentialRampToValueAtTime(targetVolume, now + fadeInSeconds);
      this.masterGain.connect(this.ctx.destination);

      // 1. Wind Texture Chain
      const noiseBuffer = this.createNoiseBuffer();
      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = noiseBuffer;
      this.noiseSource.loop = true;

      this.windFilter = this.ctx.createBiquadFilter();
      this.windFilter.type = 'lowpass';
      this.windFilter.frequency.setValueAtTime(this.baseFilterFreq, now);
      this.windFilter.Q.setValueAtTime(2.2, now);

      // Low-Frequency Oscillator (LFO) for breathing gusts
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, now); // ~8.3 second cycle
      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(60, now); // Modulates filter by +/- 60Hz
      lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.windFilter.frequency);
      lfo.start();

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.8, now);

      this.noiseSource.connect(this.windFilter);
      this.windFilter.connect(this.windGain);
      this.windGain.connect(this.masterGain);
      this.noiseSource.start();

      // 2. Earthy Warm Drone Chord (55 Hz & 110 Hz soft sines for architectural weight)
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.15, now);

      const droneFilter = this.ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(140, now);

      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(55, now); // A1 note

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(110.2, now); // A2 slightly detuned for organic beating

      this.droneOsc1.connect(droneFilter);
      this.droneOsc2.connect(droneFilter);
      droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start();
      this.droneOsc2.start();

      this.isRunning = true;
    } catch (e) {
      console.warn('Audio start failed or blocked by autoplay policy:', e);
      this.isRunning = false;
    }
  }

  public stop(fadeOutSeconds = 1.8) {
    if (!this.isRunning || !this.ctx || !this.masterGain) {
      this.isRunning = false;
      return;
    }

    try {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + fadeOutSeconds);

      setTimeout(() => {
        try {
          this.noiseSource?.stop();
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.noiseSource?.disconnect();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
        } catch {
          // cleanup
        }
        this.isRunning = false;
      }, fadeOutSeconds * 1000 + 100);
    } catch {
      this.isRunning = false;
    }
  }

  // React smoothly to user scrolling motion
  public onScroll(scrollYProgress: number, velocity: number) {
    if (!this.isRunning || !this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const absVelocity = Math.min(Math.abs(velocity), 100); // normalized
      const velocityBoost = (absVelocity / 100) * 180; // filter opens up with speed

      if (this.windFilter) {
        const targetFreq = Math.min(
          580,
          this.baseFilterFreq + velocityBoost + scrollYProgress * 120
        );
        this.windFilter.frequency.setTargetAtTime(targetFreq, now, 0.25);
      }

      if (this.windGain) {
        // Subtle volume swell during active scroll
        const targetWindGain = 0.7 + (absVelocity / 100) * 0.4;
        this.windGain.gain.setTargetAtTime(targetWindGain, now, 0.2);
      }
    } catch {
      // ignore
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      const target = this.isMuted ? 0.0001 : this.targetMasterVolume;
      this.masterGain.gain.setTargetAtTime(target, now, 0.15);
    }
    return !this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      const target = this.isMuted ? 0.0001 : this.targetMasterVolume;
      this.masterGain.gain.setTargetAtTime(target, now, 0.15);
    }
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const ambientSound = new AmbientAudioManager();
