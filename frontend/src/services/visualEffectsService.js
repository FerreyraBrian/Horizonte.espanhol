/**
 * Visual Effects & Sound Utils
 * Maneja confeti, sonidos, vibraciones y efectos visuales
 */

export const triggerConfetti = (intensity = 'normal') => {
  const count = {
    light: 20,
    normal: 50,
    epic: 100,
  }[intensity] || 50;

  const emojis = ['⭐', '🎯', '✨', '🏆', '🚀', '💎', '🎉', '⚡', '🔥', '👑'];

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const startX = Math.random() * window.innerWidth;
    const startY = -50;
    const endX = (Math.random() - 0.5) * window.innerWidth;
    const distance = 300 + Math.random() * 200;

    confetti.style.position = 'fixed';
    confetti.style.left = startX + 'px';
    confetti.style.top = startY + 'px';
    confetti.style.setProperty('--tx', endX + 'px');
    confetti.style.setProperty('--distance', distance + 'px');
    confetti.style.setProperty('--duration', (2 + Math.random() * 1.5) + 's');
    confetti.style.zIndex = '9999';

    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
};

export const showXPPopup = (xp, x, y) => {
  const popup = document.createElement('div');
  popup.className = 'xp-popup';
  popup.textContent = `+${xp} XP`;
  popup.style.left = x + 'px';
  popup.style.top = y + 'px';

  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1500);
};

export const showAchievementNotification = (achievement) => {
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.style.setProperty('--achievement-color', achievement.color);
  notification.innerHTML = `
    <div class="achievement-icon">${achievement.icon}</div>
    <div class="achievement-content">
      <h4>¡LOGRO DESBLOQUEADO!</h4>
      <p>${achievement.title}</p>
    </div>
  `;

  document.body.appendChild(notification);
  playSound('achievement');
  triggerVibration([50, 30, 50, 30, 100]);

  setTimeout(() => notification.remove(), 4000);
};

export const showLevelUpNotification = (newLevel) => {
  const notification = document.createElement('div');
  notification.className = 'level-up-notification';
  notification.innerHTML = `
    <h2>¡NIVEL ${newLevel}!</h2>
    <p>🎉 ¡Sigue así, eres increíble!</p>
  `;

  document.body.appendChild(notification);
  triggerConfetti('epic');
  playSound('levelup');
  triggerVibration([100, 50, 100, 50, 100, 50, 200]);

  setTimeout(() => notification.remove(), 2000);
};

/**
 * Web Audio API - Sonidos
 */
export const playSound = (type = 'success') => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const sounds = {
      success: {
        frequency: [800, 1000],
        duration: 0.2,
      },
      achievement: {
        frequency: [1200, 1400],
        duration: 0.4,
      },
      levelup: {
        frequency: [800, 1000, 1200],
        duration: 0.6,
      },
      error: {
        frequency: 400,
        duration: 0.2,
      },
      click: {
        frequency: 600,
        duration: 0.1,
      },
      hover: {
        frequency: 450,
        duration: 0.08,
      },
      // Quiz option selection sounds - Musical scale (Do, Re, Mi, Fa, Sol, La)
      select0: {
        frequency: 262, // C
        duration: 0.15,
      },
      select1: {
        frequency: 294, // D
        duration: 0.15,
      },
      select2: {
        frequency: 330, // E
        duration: 0.15,
      },
      select3: {
        frequency: 349, // F
        duration: 0.15,
      },
      select4: {
        frequency: 392, // G
        duration: 0.15,
      },
      select5: {
        frequency: 440, // A
        duration: 0.15,
      },
      // Quiz feedback sounds
      correct: {
        frequency: [523, 659, 784], // C-E-G (Major chord)
        duration: 0.4,
      },
      wrong: {
        frequency: [392, 330, 262], // G-E-C (Descending)
        duration: 0.3,
      },
      submit: {
        frequency: [523, 262],
        duration: 0.25,
      },
      parabens: {
        frequency: [523, 659, 784, 1047], // Ascending major chord - CELEBRATION!
        duration: 1.2,
      },
      error_sound: {
        frequency: [200, 150, 100], // Deep descending error tones
        duration: 0.6,
      },
      rewind: {
        frequency: [100, 150, 200, 300], // Ascending "rewind" sound
        duration: 0.5,
      },
    };

    const sound = sounds[type] || sounds.success;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    // Master volume - Más bajo para sonidos frecuentes (hover)
    const isFrequentSound = ['hover', 'select0', 'select1', 'select2', 'select3', 'select4', 'select5'].includes(type);
    const volume = isFrequentSound ? 0.08 : 0.15;
    
    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + sound.duration
    );

    if (Array.isArray(sound.frequency)) {
      // Arpeggio
      sound.frequency.forEach((freq, index) => {
        setTimeout(() => {
          osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        }, (index * sound.duration) / sound.frequency.length * 1000);
      });
    } else {
      osc.frequency.value = sound.frequency;
    }

    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + sound.duration);
  } catch (error) {
    console.debug('Audio not available:', error);
  }
};

/**
 * Vibration API
 */
export const triggerVibration = (pattern = [30, 10, 30]) => {
  if (navigator.vibrate && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.debug('Vibration not available:', error);
    }
  }
};

/**
 * Animación de clic de botón mejorada
 */
export const createButtonRipple = (event) => {
  const button = event.currentTarget;

  // No ripple si ya está descontinuado
  if (button.classList.contains('btn-loading')) return;

  const ripple = document.createElement('span');
  ripple.className = 'button-ripple';

  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  ripple.style.width = size + 'px';
  ripple.style.height = size + 'px';
  ripple.style.left = x - size / 2 + 'px';
  ripple.style.top = y - size / 2 + 'px';

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
};

/**
 * Efecto de pulsación en elemento
 */
export const pulseElement = (element, color = '#3b82f6') => {
  const originalBoxShadow = element.style.boxShadow;
  element.style.boxShadow = `0 0 0 4px ${color}80`;

  setTimeout(() => {
    element.style.boxShadow = originalBoxShadow;
  }, 200);
};

/**
 * Animación de escritura de texto
 */
export const typeText = (element, text, speed = 50) => {
  let index = 0;
  element.textContent = '';

  const type = () => {
    if (index < text.length) {
      element.textContent += text[index];
      index++;
      setTimeout(type, speed);
    }
  };

  type();
};

/**
 * Cuenta regresiva visual
 */
export const countdownAnimation = (from, onTick, onComplete) => {
  let current = from;

  const tick = () => {
    if (current > 0) {
      onTick(current);
      current--;
      setTimeout(tick, 1000);
    } else {
      onComplete();
    }
  };

  tick();
};

/**
 * Animación de carga con puntos
 */
export const animateLoadingDots = (element, interval = 500) => {
  let dots = 0;
  const text = element.textContent.replace(/\.+$/, '');

  const animate = () => {
    dots = (dots + 1) % 4;
    element.textContent = text + '.'.repeat(dots);
  };

  const intervalId = setInterval(animate, interval);
  return () => clearInterval(intervalId);
};

/**
 * Shake animation (error)
 */
export const shakeElement = (element) => {
  const original = element.style.transform;

  const shakes = [
    'translateX(-5px)',
    'translateX(5px)',
    'translateX(-5px)',
    'translateX(5px)',
    'translateX(0)',
  ];

  let index = 0;
  const shake = () => {
    if (index < shakes.length) {
      element.style.transform = shakes[index];
      index++;
      setTimeout(shake, 50);
    } else {
      element.style.transform = original;
    }
  };

  shake();
};

/**
 * Scroll suave a elemento
 */
export const smoothScrollToElement = (element, offset = 100) => {
  const elementPosition =
    element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};

/**
 * Particle effect (pequeñas partículas)
 */
export const createParticleEffect = (x, y, count = 20, color = '#3b82f6') => {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '6px';
    particle.style.height = '6px';
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = color;
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9998';

    const angle = (i / count) * Math.PI * 2;
    const velocity = 4 + Math.random() * 4;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    let posX = x;
    let posY = y;
    let opacity = 1;

    const animate = () => {
      posX += vx;
      posY += vy;
      opacity -= 0.02;

      particle.style.transform = `translate(${posX}px, ${posY}px)`;
      particle.style.opacity = opacity;

      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        particle.remove();
      }
    };

    document.body.appendChild(particle);
    animate();
  }
};

/**
 * Animación de flip (volteo de tarjeta)
 */
export const createFlipAnimation = (element) => {
  const duration = 600;
  const start = Date.now();

  const animate = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const rotation = progress * 360;

    element.style.transform = `rotateY(${rotation}deg)`;
    element.style.transformStyle = 'preserve-3d';

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  animate();
};

/**
 * 🌟 Lluvia de estrellas celebratoria (SORPRESA!)
 */
export const createStarRain = () => {
  const stars = ['⭐', '✨', '💫', '🌟', '⚡', '💥', '🎆'];
  const count = 40;

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.textContent = stars[Math.floor(Math.random() * stars.length)];
    star.style.position = 'fixed';
    star.style.fontSize = (20 + Math.random() * 30) + 'px';
    star.style.left = Math.random() * window.innerWidth + 'px';
    star.style.top = '-50px';
    star.style.pointerEvents = 'none';
    star.style.zIndex = '10000';
    star.style.opacity = '1';
    star.style.animation = `star-fall ${2 + Math.random() * 2}s linear forwards, star-spin ${1 + Math.random() * 2}s linear infinite`;

    document.body.appendChild(star);
    setTimeout(() => star.remove(), 4000);
  }

  // Inyectar estilos si no existen
  if (!document.getElementById('star-rain-styles')) {
    const style = document.createElement('style');
    style.id = 'star-rain-styles';
    style.textContent = `
      @keyframes star-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
      }
      @keyframes star-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
};

/**
 * 🌊 Onda de choque (shockwave) - Efecto expansivo
 */
export const createShockwave = (x, y) => {
  const shockwave = document.createElement('div');
  shockwave.style.position = 'fixed';
  shockwave.style.left = x + 'px';
  shockwave.style.top = y + 'px';
  shockwave.style.width = '20px';
  shockwave.style.height = '20px';
  shockwave.style.borderRadius = '50%';
  shockwave.style.border = '3px solid #0284c7';
  shockwave.style.pointerEvents = 'none';
  shockwave.style.zIndex = '9999';
  shockwave.style.transform = 'translate(-50%, -50%)';

  document.body.appendChild(shockwave);

  const duration = 800;
  const start = Date.now();

  const animate = () => {
    const elapsed = Date.now() - start;
    const progress = elapsed / duration;
    const scale = 1 + progress * 4;
    const opacity = 1 - progress;

    shockwave.style.transform = `translate(-50%, -50%) scale(${scale})`;
    shockwave.style.opacity = opacity;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      shockwave.remove();
    }
  };

  animate();
};

/**
 * 🌀 Efecto de giro/rotación con escala
 */
export const createSpinEffect = (element) => {
  const duration = 600;
  const start = Date.now();
  const originalTransform = element.style.transform;

  const animate = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const rotation = progress * 720; // 2 vueltas
    const scale = 1 + Math.sin(progress * Math.PI) * 0.2; // Bounce en escala

    element.style.transform = `${originalTransform} rotate(${rotation}deg) scale(${scale})`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      element.style.transform = originalTransform;
    }
  };

  animate();
};

/**
 * 💥 Efecto de explosión/ruptura
 */
export const createBurstEffect = (x, y, count = 30) => {
  const particles = ['💥', '✨', '⭐', '🎆', '⚡', '🔥'];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.textContent = particles[Math.floor(Math.random() * particles.length)];
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.fontSize = (20 + Math.random() * 40) + 'px';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';

    const angle = (i / count) * Math.PI * 2;
    const velocity = 5 + Math.random() * 8;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity;

    let posX = x;
    let posY = y;
    let opacity = 1;
    let rotation = 0;

    const animate = () => {
      posX += vx;
      posY += vy;
      vy += 0.3; // gravedad
      opacity -= 0.015;
      rotation += 15;

      particle.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotation}deg)`;
      particle.style.opacity = opacity;

      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        particle.remove();
      }
    };

    document.body.appendChild(particle);
    animate();
  }
};

/**
 * ✅ Efecto de marca de verificación + giro
 */
export const createCheckmarkEffect = (element) => {
  const checkmark = document.createElement('div');
  checkmark.innerHTML = '✅';
  checkmark.style.position = 'absolute';
  checkmark.style.top = '50%';
  checkmark.style.left = '50%';
  checkmark.style.transform = 'translate(-50%, -50%) scale(0)';
  checkmark.style.fontSize = '60px';
  checkmark.style.pointerEvents = 'none';
  checkmark.style.zIndex = '999';

  const rect = element.getBoundingClientRect();
  checkmark.style.position = 'fixed';
  checkmark.style.top = rect.top + rect.height / 2 + 'px';
  checkmark.style.left = rect.left + rect.width / 2 + 'px';

  document.body.appendChild(checkmark);

  let frame = 0;
  const animate = () => {
    frame++;
    const progress = frame / 30;
    const scale = Math.min(progress * 2, 1);
    const rotation = progress * 360;

    checkmark.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;

    if (frame < 30) {
      requestAnimationFrame(animate);
    } else {
      setTimeout(() => checkmark.remove(), 200);
    }
  };

  animate();
};

/**
 * 🌈 Efecto de arcoíris de luz (Neon Glow)
 */
export const createNeonGlow = (element) => {
  const colors = ['#00ff00', '#00ff88', '#00ffff', '#0088ff', '#0000ff', '#8800ff', '#ff00ff'];
  let colorIndex = 0;

  const glow = setInterval(() => {
    element.style.boxShadow = `0 0 10px ${colors[colorIndex]}, 0 0 20px ${colors[colorIndex]}80, 0 0 30px ${colors[colorIndex]}40`;
    colorIndex = (colorIndex + 1) % colors.length;
  }, 150);

  setTimeout(() => clearInterval(glow), 2000);
};

/**
 * 🎯 Efecto de movimiento hacia arriba + fade (Celebración fluida)
 */
export const createFloatUpEffect = (element) => {
  const original = element.style.transform;
  const duration = 1200;
  const start = Date.now();

  const animate = () => {
    const elapsed = Date.now() - start;
    const progress = elapsed / duration;
    const distance = progress * 100;
    const opacity = 1 - progress;

    element.style.transform = `${original} translateY(-${distance}px)`;
    element.style.opacity = opacity;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  animate();
};

/**
 * 🎪 Efecto combinado: Parabéns (Para respuestas correctas)
 */
export const triggerParabensEffect = (x, y) => {
  // Sonido celebratorio
  playSound('parabens');
  triggerVibration([50, 30, 50, 30, 100, 30, 100]);

  // Onda de choque
  createShockwave(x, y);

  // Lluvia de estrellas
  setTimeout(() => createStarRain(), 200);

  // Explosión de partículas
  setTimeout(() => createBurstEffect(x, y, 35), 300);

  // Confeti épico
  setTimeout(() => triggerConfetti('epic'), 100);
};

/**
 * 💔 Efecto combinado: Error (Para respuestas incorrectas)
 */
export const triggerErrorEffect = (element) => {
  // Sonido de error
  playSound('error_sound');
  triggerVibration([100, 50, 50]);

  // Shake violento
  shakeElement(element);

  // Glow rojo
  const originalShadow = element.style.boxShadow;
  element.style.boxShadow = '0 0 20px #ef4444, 0 0 40px #dc262680';
  setTimeout(() => {
    element.style.boxShadow = originalShadow;
  }, 600);
};

/**
 * ⏮️ Efecto de RETROCESO/REWIND (Contrario a Parabéns)
 * Cuando el usuario hace "Reintentar" después de completar el quiz
 */
export const triggerRewindEffect = () => {
  // Sonido de retroceso (ascending tones - lo opuesto al error)
  playSound('rewind');
  
  // Vibración corta tipo "reset"
  triggerVibration([20, 10, 20, 10, 20]);

  // Efecto visual: Partículas que se comprimen hacia el centro
  createCompressionEffect(window.innerWidth / 2, window.innerHeight / 2, 25);

  // Onda de contracción (inversa a la explosión)
  createContractingShockwave(window.innerWidth / 2, window.innerHeight / 2);

  // Glow azul celeste (opuesto al rojo del error)
  const dummyEl = document.createElement('div');
  document.body.appendChild(dummyEl);
  dummyEl.style.position = 'fixed';
  dummyEl.style.top = '50%';
  dummyEl.style.left = '50%';
  dummyEl.style.width = '200px';
  dummyEl.style.height = '200px';
  dummyEl.style.transform = 'translate(-50%, -50%)';
  dummyEl.style.boxShadow = '0 0 30px #0284c7, 0 0 60px #0369a180';
  
  setTimeout(() => {
    dummyEl.style.transition = 'box-shadow 600ms ease-out';
    dummyEl.style.boxShadow = '0 0 0px #0284c700, 0 0 0px #0369a100';
  }, 0);
  
  setTimeout(() => {
    dummyEl.remove();
  }, 700);
};

/**
 * 💫 Efecto de compresión para retroceso
 */
export const createCompressionEffect = (x, y, count = 25) => {
  const particles = ['⭐', '✨', '💫', '🌟', '💎', '🎆'];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.textContent = particles[Math.floor(Math.random() * particles.length)];
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.fontSize = (15 + Math.random() * 25) + 'px';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '10001';

    // Empezar desde los bordes hacia adentro
    const angle = (i / count) * Math.PI * 2;
    const distance = 200 + Math.random() * 150;
    const startX = x + Math.cos(angle) * distance;
    const startY = y + Math.sin(angle) * distance;

    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    particle.style.opacity = '0.8';

    document.body.appendChild(particle);

    let posX = startX;
    let posY = startY;
    let opacity = 0.8;
    let rotation = 0;
    let frame = 0;

    const animate = () => {
      frame++;
      const progress = frame / 25;
      
      // Moverse hacia el centro
      posX += (x - posX) * 0.15;
      posY += (y - posY) * 0.15;
      opacity -= 0.032;
      rotation -= 12; // Girar hacia atrás

      particle.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotation}deg) scale(${1 - progress * 0.8})`;
      particle.style.opacity = opacity;

      if (opacity > 0 && frame < 25) {
        requestAnimationFrame(animate);
      } else {
        particle.remove();
      }
    };

    animate();
  }
};

/**
 * Onda de contracción (inverso a shockwave)
 */
export const createContractingShockwave = (x, y) => {
  const shockwave = document.createElement('div');
  shockwave.style.position = 'fixed';
  shockwave.style.left = x + 'px';
  shockwave.style.top = y + 'px';
  shockwave.style.width = '200px';
  shockwave.style.height = '200px';
  shockwave.style.borderRadius = '50%';
  shockwave.style.border = '3px solid #0284c7';
  shockwave.style.pointerEvents = 'none';
  shockwave.style.zIndex = '9999';
  shockwave.style.transform = 'translate(-50%, -50%) scale(4)';

  document.body.appendChild(shockwave);

  const duration = 800;
  const start = Date.now();

  const animate = () => {
    const elapsed = Date.now() - start;
    const progress = elapsed / duration;
    const scale = 4 - progress * 3.8; // De 4 a 0.2
    const opacity = 1 - progress;

    shockwave.style.transform = `translate(-50%, -50%) scale(${Math.max(scale, 0.2)})`;
    shockwave.style.opacity = opacity;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      shockwave.remove();
    }
  };

  animate();
};

/**
 * 🎰 JACKPOT EFFECT - Para respuesta perfecta en escucha
 * Efecto épico de victoria gaming
 */
export const triggerCasinoWinEffect = (x, y, streak = 1) => {
  // Sonido épico de victoria
  playSound('parabens');
  triggerVibration([100, 50, 100, 50, 100, 50, 150]);

  // Lluvia de estrellas
  createStarRain();

  // Múltiples explosiones en cascada para streak
  for (let i = 0; i < streak; i++) {
    setTimeout(() => {
      createBurstEffect(
        x + (Math.random() - 0.5) * 300,
        y + (Math.random() - 0.5) * 300,
        25
      );
    }, i * 200);
  }

  // Confeti épico
  setTimeout(() => triggerConfetti('epic'), 300);

  // Luces parpadeantes (efecto casino)
  createCasinoLights(x, y, 8);
};

/**
 * 🎯 LUCKY SPIN EFFECT - Para respuesta buena en escucha
 * Efecto de giro de ruleta
 */
export const createLuckySpinEffect = (x, y) => {
  const spinNumbers = ['7️⃣', '⭐', '🎯', '💎', '🔥', '✨'];
  
  // Sonido de spin (tono ascendente-descendente)
  playSound('success');
  triggerVibration([20, 10, 20, 10, 20, 10, 30]);

  // Crear efecto de rueda giratoria
  for (let i = 0; i < 12; i++) {
    const item = document.createElement('div');
    item.textContent = spinNumbers[i % spinNumbers.length];
    item.style.position = 'fixed';
    item.style.left = x + 'px';
    item.style.top = y + 'px';
    item.style.fontSize = '40px';
    item.style.pointerEvents = 'none';
    item.style.zIndex = '10000';

    const angle = (i / 12) * Math.PI * 2;
    const radius = 80;
    const finalX = x + Math.cos(angle) * radius;
    const finalY = y + Math.sin(angle) * radius;

    document.body.appendChild(item);

    let frame = 0;
    const animate = () => {
      frame++;
      const progress = frame / 20;
      const distance = progress * radius;
      const rotation = progress * 360;
      const currentX = x + Math.cos(angle) * distance;
      const currentY = y + Math.sin(angle) * distance;

      item.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
      item.style.opacity = 1 - progress * 0.5;

      if (frame < 20) {
        requestAnimationFrame(animate);
      } else {
        item.remove();
      }
    };

    animate();
  }
};

/**
 * 💡 CASINO LIGHTS - Luces parpadeantes tipo casino
 */
export const createCasinoLights = (x, y, count = 8) => {
  const colors = ['#FF006E', '#00D9FF', '#FFD60A', '#00F5FF', '#FF006E'];
  
  for (let i = 0; i < count; i++) {
    const light = document.createElement('div');
    light.style.position = 'fixed';
    light.style.left = x + 'px';
    light.style.top = y + 'px';
    light.style.width = '60px';
    light.style.height = '60px';
    light.style.borderRadius = '50%';
    light.style.backgroundColor = colors[i % colors.length];
    light.style.boxShadow = `0 0 30px ${colors[i % colors.length]}`;
    light.style.opacity = '0.8';
    light.style.pointerEvents = 'none';
    light.style.zIndex = '10000';
    light.style.transform = 'translate(-50%, -50%) scale(0)';

    const angle = (i / count) * Math.PI * 2;
    const distance = 120;

    document.body.appendChild(light);

    // Animación de aparición
    let frame = 0;
    const maxFrames = 30;
    const animate = () => {
      frame++;
      const progress = frame / maxFrames;
      const distance_anim = progress * distance;
      const scale = Math.sin(progress * Math.PI) * 1.2;

      light.style.left = (x + Math.cos(angle) * distance_anim) + 'px';
      light.style.top = (y + Math.sin(angle) * distance_anim) + 'px';
      light.style.transform = `translate(-50%, -50%) scale(${Math.max(scale, 0)})`;
      light.style.opacity = Math.sin(progress * Math.PI) * 0.9;

      if (frame < maxFrames) {
        requestAnimationFrame(animate);
      } else {
        light.remove();
      }
    };

    animate();
  }
};

/**
 * 🎪 CONFETTI CANNON - Disparador de confeti direccional
 */
export const createConfettiCannon = (x, y, direction = 'up') => {
  const emojis = ['🎉', '⭐', '✨', '🎊', '🎯', '🏆'];
  const count = 30;

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    confetti.style.position = 'fixed';
    confetti.style.left = x + 'px';
    confetti.style.top = y + 'px';
    confetti.style.fontSize = (20 + Math.random() * 30) + 'px';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '10000';
    confetti.style.opacity = '1';

    // Velocidades según dirección
    let vx = (Math.random() - 0.5) * 12;
    let vy = direction === 'up' ? -8 - Math.random() * 6 : -2 + Math.random() * 4;

    let posX = x;
    let posY = y;
    let rotation = 0;

    const animate = () => {
      posX += vx;
      posY += vy;
      vy += 0.2; // gravedad
      rotation += 15;
      confetti.style.opacity = Math.max(0, 1 - (Math.abs(vy) / 15));

      confetti.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotation}deg)`;

      if (posY < window.innerHeight) {
        requestAnimationFrame(animate);
      } else {
        confetti.remove();
      }
    };

    document.body.appendChild(confetti);
    animate();
  }
};
