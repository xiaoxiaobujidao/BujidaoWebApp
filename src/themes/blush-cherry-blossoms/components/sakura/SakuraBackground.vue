<script setup lang="ts">
import { ref } from 'vue'
import { useSakuraPetals } from '@blush-cherry-blossoms/composables/useSakuraPetals'

const canvasRef = ref<HTMLCanvasElement | null>(null)
useSakuraPetals(canvasRef)
</script>

<template>
  <div class="sakura-bg" aria-hidden="true">
    <div class="sakura-bg__sky" />
    <div class="sakura-bg__bokeh">
      <span v-for="i in 6" :key="i" class="sakura-bg__orb" :class="`sakura-bg__orb--${i}`" />
    </div>
    <canvas ref="canvasRef" class="sakura-bg__canvas" />
    <div class="sakura-bg__ground" />
  </div>
</template>

<style scoped>
.sakura-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.sakura-bg__sky {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #fce4ec 0%, #f8bbd9 35%, #f48fb1 65%, #e1bee7 100%);
}

.sakura-bg__bokeh {
  position: absolute;
  inset: 0;
}

.sakura-bg__orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 70%);
  filter: blur(2px);
  animation: float-orb 12s ease-in-out infinite;
}

.sakura-bg__orb--1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 15%;
  animation-delay: 0s;
}

.sakura-bg__orb--2 {
  width: 80px;
  height: 80px;
  top: 25%;
  right: 20%;
  animation-delay: -2s;
}

.sakura-bg__orb--3 {
  width: 160px;
  height: 160px;
  top: 50%;
  left: 5%;
  animation-delay: -4s;
}

.sakura-bg__orb--4 {
  width: 100px;
  height: 100px;
  top: 60%;
  right: 10%;
  animation-delay: -6s;
}

.sakura-bg__orb--5 {
  width: 60px;
  height: 60px;
  top: 15%;
  left: 55%;
  animation-delay: -3s;
}

.sakura-bg__orb--6 {
  width: 140px;
  height: 140px;
  bottom: 20%;
  left: 40%;
  animation-delay: -8s;
}

.sakura-bg__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.sakura-bg__ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 228, 236, 0.3) 40%,
    rgba(255, 183, 197, 0.15) 100%
  );
}

@keyframes float-orb {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) scale(1.05);
    opacity: 0.9;
  }
}

@media (max-width: 767px) {
  .sakura-bg__orb--1,
  .sakura-bg__orb--3,
  .sakura-bg__orb--6 {
    transform: scale(0.7);
  }
}
</style>
