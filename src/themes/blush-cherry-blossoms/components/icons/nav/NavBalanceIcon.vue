<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    class="nav-icon"
    aria-hidden="true"
  >
    <path
      class="nav-icon__purse"
      d="M352 256h320c88.4 0 160 71.6 160 160v352c0 88.4-71.6 160-160 160H352c-88.4 0-160-71.6-160-160V416c0-88.4 71.6-160 160-160z"
    />
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="40"
      stroke-linecap="round"
      d="M352 416h320"
    />
    <circle cx="512" cy="576" r="128" class="nav-icon__coin" />
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="36"
      stroke-linecap="round"
      d="M512 512v128M464 576h96"
    />
    <circle cx="704" cy="320" r="36" class="nav-icon__petal" />
    <circle cx="320" cy="320" r="28" class="nav-icon__petal nav-icon__petal--small" />
  </svg>
</template>

<style scoped>
.nav-icon {
  width: 1.15em;
  height: 1.15em;
  display: block;
}

.nav-icon__purse {
  fill: rgba(255, 183, 197, 0.28);
  stroke: currentColor;
  stroke-width: 36;
  stroke-linejoin: round;
}

.nav-icon__coin {
  fill: var(--color-sakura-light, #ffe4ec);
  stroke: var(--color-sakura-deep, #f48fb1);
  stroke-width: 24;
}

.nav-icon__petal {
  fill: var(--color-sakura-pink, #ffb7c5);
}

.nav-icon__petal--small {
  fill: var(--color-sakura-blush, #ffc0cb);
}
</style>
