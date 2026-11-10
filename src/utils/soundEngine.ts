/**
 * Web Audio API Sound Engine for NEXORA
 * Zero external audio file dependencies - 100% synthesized in-browser.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7;
  private ambientSourceNode: AudioNode | null = null;
  private ambientGainNode: GainNode | null = null;
  private currentAmbientType: string = 'none';

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.ambientGainNode && this.ctx) {
      this.ambientGainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    } else if (!muted && this.ambientGainNode && this.ctx) {
      this.ambientGainNode.gain.setValueAtTime(this.volume * 0.25, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ambientGainNode && this.ctx && !this.isMuted) {
      this.ambientGainNode.gain.setValueAtTime(this.volume * 0.25, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Click / UI Tap sound
   */
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12 * this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }

  /**
   * Correct Answer Chime (E5 -> G#5 -> B5 -> E6 crystalline chord)
   */
  public playCorrect() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [659.25, 830.61, 987.77, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

      const startTime = ctx.currentTime + idx * 0.06;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2 * this.volume, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  }

  /**
   * Gentle, non-punitive incorrect tone (Two mellow warm low notes)
   */
  public playIncorrect() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [311.13, 261.63]; // Eb4 -> C4
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const startTime = ctx.currentTime + idx * 0.12;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18 * this.volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.28);
    });
  }

  /**
   * Level Up celebratory fanfare
   */
  public playLevelUp() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [
      { f: 523.25, t: 0.0 },   // C5
      { f: 659.25, t: 0.1 },   // E5
      { f: 783.99, t: 0.2 },   // G5
      { f: 1046.50, t: 0.32 }, // C6
      { f: 1318.51, t: 0.45 }, // E6
      { f: 1567.98, t: 0.58 }  // G6
    ];

    notes.forEach(({ f, t }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const startTime = ctx.currentTime + t;
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25 * this.volume, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
  }

  /**
   * Streak Fire whoosh
   */
  public playStreakFire() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(250, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.18);
    filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.38);

    gain.gain.setValueAtTime(0.18 * this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }

  /**
   * Gem Pickup or Store Purchase tinkling
   */
  public playGemPickup() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    [1760, 2637, 3520].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const start = ctx.currentTime + idx * 0.05;
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.15 * this.volume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.22);
    });
  }

  /**
   * Task Completed Chime
   */
  public playTaskDone() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    [880, 1174.66, 1760].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const start = ctx.currentTime + idx * 0.08;
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.2 * this.volume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.35);
    });
  }

  /**
   * Cloud Sync confirmation sound
   */
  public playSyncSuccess() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.08 * this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }

  /**
   * Ambient Focus generator for nocturnal deep work
   */
  public startAmbient(type: 'lofi-rain' | 'binaural-focus' | 'white-noise' | 'none') {
    this.stopAmbient();
    if (this.isMuted || type === 'none') return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.currentAmbientType = type;
    this.ambientGainNode = ctx.createGain();
    this.ambientGainNode.gain.setValueAtTime(this.volume * 0.18, ctx.currentTime);
    this.ambientGainNode.connect(ctx.destination);

    if (type === 'white-noise' || type === 'lofi-rain') {
      // Generate 5-second loopable noise buffer
      const bufferSize = ctx.sampleRate * 4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'lofi-rain') {
          // Pink-ish filtered noise for rain sound
          data[i] = (lastOut + 0.04 * white) / 1.04;
          lastOut = data[i];
          data[i] *= 2.8;
        } else {
          data[i] = white * 0.2;
        }
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      if (type === 'lofi-rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, ctx.currentTime);
      } else {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.Q.setValueAtTime(0.8, ctx.currentTime);
      }

      noise.connect(filter);
      filter.connect(this.ambientGainNode);
      noise.start();
      this.ambientSourceNode = noise;
    } else if (type === 'binaural-focus') {
      // 220Hz left ear + 230Hz right ear = 10Hz Alpha frequency for deep calm study
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const merger = ctx.createChannelMerger(2);

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(216, ctx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(226, ctx.currentTime);

      osc1.connect(merger, 0, 0);
      osc2.connect(merger, 0, 1);

      merger.connect(this.ambientGainNode);
      osc1.start();
      osc2.start();

      // Combined node reference for teardown
      this.ambientSourceNode = osc1;
      (this.ambientSourceNode as any)._secondaryOsc = osc2;
    }
  }

  public stopAmbient() {
    if (this.ambientSourceNode) {
      try {
        (this.ambientSourceNode as any).stop?.();
        if ((this.ambientSourceNode as any)._secondaryOsc) {
          (this.ambientSourceNode as any)._secondaryOsc.stop?.();
        }
        this.ambientSourceNode.disconnect();
      } catch {
        // already stopped
      }
      this.ambientSourceNode = null;
    }
    if (this.ambientGainNode) {
      try {
        this.ambientGainNode.disconnect();
      } catch {}
      this.ambientGainNode = null;
    }
    this.currentAmbientType = 'none';
  }

  public getCurrentAmbient(): string {
    return this.currentAmbientType;
  }
}

export const sound = new SoundEngine();
