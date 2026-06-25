<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    class="nav-icon"
    aria-hidden="true"
  >
    <rect x="176" y="224" width="672" height="576" rx="40" class="nav-icon__card" />
    <circle cx="352" cy="448" r="96" fill="currentColor" />
    <path fill="currentColor" d="M224 608c0-70.7 57.3-128 128-128s128 57.3 128 128v64H224v-64z" />
    <path
      stroke="currentColor"
      stroke-width="40"
      stroke-linecap="round"
      d="M544 352h224M544 480h192M544 608h160"
    />
    <path class="nav-icon__gem" d="M736 224 832 320 736 416 640 320Z" />
  </svg>
</template>

<style scoped>
.nav-icon {
  width: 1.15em;
  height: 1.15em;
  display: block;
}

.nav-icon__card {
  fill: rgba(206, 147, 216, 0.15);
  stroke: currentColor;
  stroke-width: 36;
}

.nav-icon__gem {
  fill: var(--color-accent, #ab47bc);
  opacity: 0.8;
}
</style>
