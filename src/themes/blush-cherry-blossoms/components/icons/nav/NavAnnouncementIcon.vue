<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" class="nav-icon" aria-hidden="true">
    <path
      class="nav-icon__scroll"
      d="M224 192h448c70.7 0 128 57.3 128 128v384c0 70.7-57.3 128-128 128H224c-70.7 0-128-57.3-128-128V320c0-70.7 57.3-128 128-128z"
    />
    <path
      stroke="currentColor"
      stroke-width="36"
      stroke-linecap="round"
      d="M288 384h320M288 512h384M288 640h256"
    />
    <circle cx="512" cy="160" r="56" class="nav-icon__pin" />
    <circle cx="512" cy="160" r="24" fill="var(--color-sakura-light, #ffe4ec)" />
    <circle cx="768" cy="256" r="32" class="nav-icon__petal" />
  </svg>
</template>

<style scoped>
.nav-icon {
  width: 1.15em;
  height: 1.15em;
  display: block;
}

.nav-icon__scroll {
  fill: rgba(255, 228, 236, 0.65);
  stroke: currentColor;
  stroke-width: 32;
  stroke-linejoin: round;
}

.nav-icon__pin {
  fill: var(--color-sakura-deep, #f48fb1);
}

.nav-icon__petal {
  fill: var(--color-sakura-pink, #ffb7c5);
}
</style>
