<script setup lang="ts">
import { ref } from 'vue'
import type { ThemeId } from '@violet-rose/themes/types'
import { useFallingPetals } from '@violet-rose/composables/useFallingPetals'

const props = defineProps<{
  theme: ThemeId
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
useFallingPetals(canvasRef, props.theme)
</script>

<template>
  <div class="theme-bg" aria-hidden="true">
    <div class="theme-bg__sky" />
    <div class="theme-bg__bokeh">
      <span v-for="i in 6" :key="i" class="theme-bg__orb" :class="`theme-bg__orb--${i}`" />
    </div>
    <canvas ref="canvasRef" class="theme-bg__canvas" />
    <div class="theme-bg__ground" />
  </div>
</template>

<style scoped>
.theme-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.theme-bg__sky {
  position: absolute;
  inset: 0;
  background: var(--bg-sky);
}

.theme-bg__bokeh {
  position: absolute;
  inset: 0;
}

.theme-bg__orb {
  position: absolute;
  border-radius: 50%;
  background: var(--bg-orb);
  filter: blur(2px);
  animation: float-orb 12s ease-in-out infinite;
}

.theme-bg__orb--1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 15%;
  animation-delay: 0s;
}

.theme-bg__orb--2 {
  width: 80px;
  height: 80px;
  top: 25%;
  right: 20%;
  animation-delay: -2s;
}

.theme-bg__orb--3 {
  width: 160px;
  height: 160px;
  top: 50%;
  left: 5%;
  animation-delay: -4s;
}

.theme-bg__orb--4 {
  width: 100px;
  height: 100px;
  top: 60%;
  right: 10%;
  animation-delay: -6s;
}

.theme-bg__orb--5 {
  width: 60px;
  height: 60px;
  top: 15%;
  left: 55%;
  animation-delay: -3s;
}

.theme-bg__orb--6 {
  width: 140px;
  height: 140px;
  bottom: 20%;
  left: 40%;
  animation-delay: -8s;
}

.theme-bg__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.theme-bg__ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: var(--bg-ground);
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
  .theme-bg__orb--1,
  .theme-bg__orb--3,
  .theme-bg__orb--6 {
    transform: scale(0.7);
  }
}
</style>
