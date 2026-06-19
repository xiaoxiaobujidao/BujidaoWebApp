<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" class="nav-icon" aria-hidden="true">
    <path
      fill="currentColor"
      d="M128 480 896 192 768 832 448 672 256 896Z"
    />
    <path
      class="nav-icon__fold"
      d="M448 672 768 832 640 480Z"
    />
    <circle cx="672" cy="320" r="64" class="nav-icon__link" fill="none" stroke-width="40" />
    <path
      fill="none"
      stroke="var(--color-accent-light, #ce93d8)"
      stroke-width="36"
      stroke-linecap="round"
      d="M736 384c64 48 96 96 96 144"
    />
  </svg>
</template>

<style scoped>
.nav-icon {
  width: 1.15em;
  height: 1.15em;
  display: block;
}

.nav-icon__fold {
  fill: rgba(123, 31, 162, 0.25);
}

.nav-icon__link {
  stroke: var(--color-accent-deep, #7b1fa2);
}
</style>
