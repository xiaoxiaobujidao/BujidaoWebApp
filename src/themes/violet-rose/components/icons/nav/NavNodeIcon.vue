<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" class="nav-icon" aria-hidden="true">
    <rect x="288" y="192" width="448" height="144" rx="24" class="nav-icon__server" />
    <rect x="224" y="400" width="576" height="144" rx="24" class="nav-icon__server" />
    <rect x="160" y="608" width="704" height="144" rx="24" class="nav-icon__server" />
    <circle cx="240" cy="264" r="24" class="nav-icon__led" />
    <circle cx="240" cy="472" r="24" class="nav-icon__led" />
    <circle cx="240" cy="680" r="24" class="nav-icon__led" />
    <path
      fill="none"
      stroke="var(--color-accent-light, #ce93d8)"
      stroke-width="32"
      stroke-linecap="round"
      d="M736 336v64M800 400h96M736 544v64M864 608h32"
    />
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="36"
      stroke-linecap="round"
      d="M512 336v64M512 544v64"
    />
  </svg>
</template>

<style scoped>
.nav-icon {
  width: 1.15em;
  height: 1.15em;
  display: block;
}

.nav-icon__server {
  fill: rgba(171, 71, 188, 0.12);
  stroke: currentColor;
  stroke-width: 32;
}

.nav-icon__led {
  fill: var(--color-accent, #ab47bc);
}
</style>
