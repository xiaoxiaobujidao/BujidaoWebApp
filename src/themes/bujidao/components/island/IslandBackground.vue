<template>
  <div class="island-bg" aria-hidden="true">
    <div class="island-bg__sky" />
    <div class="island-bg__sun" />
    <div class="island-bg__orbs">
      <span v-for="i in 6" :key="i" class="island-bg__orb" :class="`island-bg__orb--${i}`" />
    </div>
    <div class="island-bg__waves">
      <svg class="island-bg__wave island-bg__wave--back" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          fill="rgba(255,255,255,0.18)"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
      <svg class="island-bg__wave island-bg__wave--front" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          fill="rgba(255,255,255,0.28)"
          d="M0,256L48,240C96,224,192,192,288,186.7C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.island-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.island-bg__sky {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    var(--color-sky-top) 0%,
    var(--color-sky-mid) 42%,
    var(--color-sky-bottom) 100%
  );
}

.island-bg__sun {
  position: absolute;
  top: 8%;
  right: 12%;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 236, 179, 0.95) 0%, rgba(255, 200, 120, 0.35) 45%, transparent 70%);
  filter: blur(2px);
  animation: sun-pulse 8s ease-in-out infinite;
}

.island-bg__orbs {
  position: absolute;
  inset: 0;
}

.island-bg__orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.45) 0%, transparent 72%);
  animation: float-orb 14s ease-in-out infinite;
}

.island-bg__orb--1 {
  width: 140px;
  height: 140px;
  top: 12%;
  left: 8%;
}

.island-bg__orb--2 {
  width: 90px;
  height: 90px;
  top: 28%;
  right: 18%;
  animation-delay: -2s;
}

.island-bg__orb--3 {
  width: 180px;
  height: 180px;
  top: 48%;
  left: 4%;
  animation-delay: -5s;
}

.island-bg__orb--4 {
  width: 110px;
  height: 110px;
  top: 62%;
  right: 8%;
  animation-delay: -7s;
}

.island-bg__orb--5 {
  width: 70px;
  height: 70px;
  top: 18%;
  left: 48%;
  animation-delay: -3s;
}

.island-bg__orb--6 {
  width: 150px;
  height: 150px;
  bottom: 18%;
  left: 38%;
  animation-delay: -9s;
}

.island-bg__waves {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 28vh;
  min-height: 160px;
}

.island-bg__wave {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
}

.island-bg__wave--back {
  bottom: 0;
  opacity: 0.7;
  animation: wave-drift 18s ease-in-out infinite;
}

.island-bg__wave--front {
  bottom: -8px;
  animation: wave-drift 12s ease-in-out infinite reverse;
}

.dark .island-bg__sun {
  background: radial-gradient(circle, rgba(126, 200, 247, 0.35) 0%, rgba(61, 165, 232, 0.12) 45%, transparent 70%);
}

.dark .island-bg__wave--back path {
  fill: rgba(126, 200, 247, 0.08);
}

.dark .island-bg__wave--front path {
  fill: rgba(126, 200, 247, 0.12);
}

@keyframes float-orb {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.55;
  }
  50% {
    transform: translateY(-18px) scale(1.04);
    opacity: 0.85;
  }
}

@keyframes wave-drift {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-2%);
  }
}

@keyframes sun-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.06);
    opacity: 1;
  }
}

@media (max-width: 767px) {
  .island-bg__sun {
    width: 80px;
    height: 80px;
    top: 6%;
    right: 8%;
  }

  .island-bg__orb--3,
  .island-bg__orb--6 {
    transform: scale(0.75);
  }
}
</style>
