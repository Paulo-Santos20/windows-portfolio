let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.15) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playLoginSound(globalVolume = 1) {
  const v = (base) => base * globalVolume;
  playTone(523, 0.15, 'sine', v(0.12));
  setTimeout(() => playTone(659, 0.15, 'sine', v(0.12)), 100);
  setTimeout(() => playTone(784, 0.3, 'sine', v(0.12)), 200);
}

export function playMessageSound(globalVolume = 1) {
  const v = (base) => base * globalVolume;
  playTone(880, 0.08, 'sine', v(0.1));
  setTimeout(() => playTone(1109, 0.15, 'sine', v(0.1)), 80);
}

export function playNudgeSound(globalVolume = 1) {
  const v = (base) => base * globalVolume;
  playTone(200, 0.2, 'sawtooth', v(0.08));
  setTimeout(() => playTone(150, 0.2, 'sawtooth', v(0.08)), 120);
  setTimeout(() => playTone(120, 0.3, 'sawtooth', v(0.08)), 240);
}
