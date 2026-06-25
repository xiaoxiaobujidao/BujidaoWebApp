<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    class="nav-icon"
    aria-hidden="true"
  >
    <rect x="192" y="160" width="640" height="704" rx="32" class="nav-icon__board" />
    <rect x="256" y="256" width="512" height="544" rx="24" class="nav-icon__paper" />
    <path class="nav-icon__pin" d="M512 128 560 224 512 208 464 224Z" />
    <path
      stroke="currentColor"
      stroke-width="36"
      stroke-linecap="round"
      d="M320 384h384M320 512h320M320 640h256"
    />
    <circle cx="736" cy="704" r="80" class="nav-icon__badge" />
    <path
      fill="none"
      stroke="var(--color-accent-light, #ce93d8)"
      stroke-width="32"
      stroke-linecap="round"
      d="M704 704h64M736 672v64"
    />
  </svg>
</template>

<style scoped>
.nav-icon {
  width: 1.15em;
  height: 1.15em;
  display: block;
}

.nav-icon__board {
  fill: rgba(171, 71, 188, 0.1);
  stroke: currentColor;
  stroke-width: 32;
}

.nav-icon__paper {
  fill: rgba(255, 255, 255, 0.5);
  stroke: currentColor;
  stroke-width: 24;
}

.nav-icon__pin {
  fill: var(--color-accent, #ab47bc);
}

.nav-icon__badge {
  fill: var(--color-accent-deep, #7b1fa2);
  opacity: 0.85;
}
</style>
