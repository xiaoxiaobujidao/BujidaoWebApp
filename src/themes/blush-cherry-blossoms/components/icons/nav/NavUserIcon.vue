<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    class="nav-icon"
    aria-hidden="true"
  >
    <rect x="192" y="256" width="640" height="512" rx="64" class="nav-icon__card" />
    <circle cx="368" cy="448" r="96" fill="currentColor" />
    <path fill="currentColor" d="M240 608c0-70.7 57.3-128 128-128s128 57.3 128 128v48H240v-48z" />
    <path
      stroke="currentColor"
      stroke-width="36"
      stroke-linecap="round"
      d="M544 384h192M544 512h160M544 640h128"
    />
    <circle cx="768" cy="288" r="48" class="nav-icon__petal" />
    <circle cx="832" cy="352" r="32" class="nav-icon__petal nav-icon__petal--small" />
  </svg>
</template>

<style scoped>
.nav-icon {
  width: 1.15em;
  height: 1.15em;
  display: block;
}

.nav-icon__card {
  fill: rgba(255, 228, 236, 0.6);
  stroke: var(--color-sakura-deep, #f48fb1);
  stroke-width: 32;
}

.nav-icon__petal {
  fill: var(--color-sakura-pink, #ffb7c5);
}

.nav-icon__petal--small {
  fill: var(--color-sakura-blush, #ffc0cb);
}
</style>
