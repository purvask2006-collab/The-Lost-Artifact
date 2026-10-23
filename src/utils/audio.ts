/**
 * Web Audio Retro Sound Synthesizer & Real Music Player
 * Handles authentic 16-bit sound effects and atmospheric background music tracks.
 */

// Uploaded audio assets from user
export const AUDIO_TRACKS = {
  bgm: {
    mainTheme: '/assets/aistudio/Video_game_backgroun__2-1792755421767.mp3_10466515.mpeg',
    shrineTheme: '/assets/aistudio/Video_game_backgroun__4-1792755771086.mp3_d74d7c2d.mpeg',
    pyramidTheme: '/assets/aistudio/Video_game_backgroun__2-1792755895102.mp3_1257ac81.mpeg',
  },
  sfx: {
    click: '/assets/aistudio/Very_short_2-second___1-1792755211416.mp3_94df93fd.mpeg',
    chime: '/assets/aistudio/Very_short_2-second___3-1792754973342.mp3_77f5bc57.mpeg',
    gemstone: '/assets/aistudio/Very_short_2-second___2-1792755296130.mp3_996416d2.mpeg',
    solve: '/assets/aistudio/Very_short_2-second___2-1792755296130.mp3__1__996416d2.mpeg',
  },
};

let audioCtx: AudioContext | null = null;
let currentBgmAudio: HTMLAudioElement | null = null;
let currentBgmTrack: string | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playAudioElement(src: string, volume = 0.5) {
  if (typeof window === 'undefined') return;
  try {
    const sound = new Audio(src);
    sound.volume = volume;
    sound.play().catch(() => {
      // Browser autoplay policy might block before interaction
    });
  } catch {
    // fallback gracefully
  }
}

export const bgmManager = {
  currentTrack: currentBgmTrack,
  volume: 0.35,

  play(track: keyof typeof AUDIO_TRACKS.bgm | string, enabled = true) {
    if (!enabled || typeof window === 'undefined') return;

    const trackSrc = AUDIO_TRACKS.bgm[track as keyof typeof AUDIO_TRACKS.bgm] || track;

    if (currentBgmAudio && currentBgmTrack === trackSrc && !currentBgmAudio.paused) {
      return; // Already playing this track
    }

    try {
      if (currentBgmAudio) {
        currentBgmAudio.pause();
        currentBgmAudio.currentTime = 0;
      }

      currentBgmAudio = new Audio(trackSrc);
      currentBgmAudio.loop = true;
      currentBgmAudio.volume = this.volume;
      currentBgmTrack = trackSrc;

      currentBgmAudio.play().catch(() => {
        // Will auto-resume on first click
      });
    } catch {
      // Audio element creation fallback
    }
  },

  pause() {
    if (currentBgmAudio) {
      currentBgmAudio.pause();
    }
  },

  resume(enabled = true) {
    if (!enabled || !currentBgmAudio) return;
    currentBgmAudio.play().catch(() => {});
  },

  stop() {
    if (currentBgmAudio) {
      currentBgmAudio.pause();
      currentBgmAudio.currentTime = 0;
      currentBgmAudio = null;
      currentBgmTrack = null;
    }
  },

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (currentBgmAudio) {
      currentBgmAudio.volume = this.volume;
    }
  },
};

export const soundManager = {
  /**
   * Hover blip
   */
  playHover(enabled = true) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {}
  },

  /**
   * Click / confirmation chime
   */
  playClick(enabled = true) {
    if (!enabled) return;
    playAudioElement(AUDIO_TRACKS.sfx.click, 0.4);

    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.setValueAtTime(900, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  },

  /**
   * Start adventure chime
   */
  playStartAdventure(enabled = true) {
    if (!enabled) return;
    playAudioElement(AUDIO_TRACKS.sfx.chime, 0.6);
  },

  /**
   * Travel transition
   */
  playTravel(enabled = true) {
    if (!enabled) return;
    playAudioElement(AUDIO_TRACKS.sfx.click, 0.5);
  },

  /**
   * Gemstone earned chime
   */
  playGemstoneEarned(enabled = true) {
    if (!enabled) return;
    playAudioElement(AUDIO_TRACKS.sfx.gemstone, 0.7);

    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime + i * 0.07;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      });
    } catch {}
  },

  /**
   * Puzzle solve chime
   */
  playSolve(enabled = true) {
    if (!enabled) return;
    playAudioElement(AUDIO_TRACKS.sfx.solve, 0.7);
  },

  /**
   * Sound toggle tick
   */
  playToggle(enabled = true) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  },

  playSoundTest() {
    this.playGemstoneEarned(true);
  },

  playCancel(enabled = true) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  },

  /**
   * Japanese Temple Bell chime (4 distinct bells)
   */
  playBell(bellIndex: number, enabled = true) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const frequencies = [440.0, 554.37, 659.25, 880.0];
      const baseFreq = frequencies[bellIndex % frequencies.length];

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseFreq * 2.76, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.8);
      osc2.stop(ctx.currentTime + 0.8);
    } catch {}
  },

  playSlide(enabled = true) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  },

  playRotateTile(enabled = true) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  },

  playGateOpen(enabled = true) {
    if (!enabled) return;
    playAudioElement(AUDIO_TRACKS.sfx.solve, 0.8);
  },

  playWaterFlow(enabled = true) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const notes = [587.33, 659.25, 880.0, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime + idx * 0.06;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.09, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch {}
  },

  playSnapKeystone(enabled = true) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  },
};
