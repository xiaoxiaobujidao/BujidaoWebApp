<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" class="nav-icon" aria-hidden="true">
    <path
      class="nav-icon__file"
      d="M256 160h320l192 192v512c0 35.3-28.7 64-64 64H256c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64z"
    />
    <path
      class="nav-icon__fold"
      d="M576 160v192c0 35.3 28.7 64 64 64h192"
    />
    <path
      stroke="currentColor"
      stroke-width="36"
      stroke-linecap="round"
      d="M320 480h384M320 608h320M320 736h256"
    />
    <path
      fill="none"
      stroke="var(--color-accent, #ab47bc)"
      stroke-width="32"
      stroke-linecap="round"
      d="M320 384h128"
    />
    <path class="nav-icon__tag" d="M704 128 832 256 704 384 576 256Z" />
    <circle cx="640" cy="256" r="32" fill="currentColor" />
  </svg>
</template>

<style scoped>
.nav-icon {
  width: 1.15em;
  height: 1.15em;
  display: block;
}

.nav-icon__file {
  fill: rgba(206, 147, 216, 0.18);
  stroke: currentColor;
  stroke-width: 32;
  stroke-linejoin: round;
}

.nav-icon__fold {
  fill: rgba(171, 71, 188, 0.15);
  stroke: currentColor;
  stroke-width: 32;
  stroke-linejoin: round;
}

.nav-icon__tag {
  fill: var(--color-accent-light, #ce93d8);
  opacity: 0.9;
}
</style>
