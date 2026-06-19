<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" class="nav-icon" aria-hidden="true">
    <ellipse cx="512" cy="560" rx="320" ry="120" class="nav-icon__cloud" />
    <rect x="352" y="288" width="128" height="320" rx="64" class="nav-icon__tower" />
    <rect x="512" y="224" width="128" height="384" rx="64" class="nav-icon__tower" />
    <rect x="672" y="352" width="128" height="256" rx="64" class="nav-icon__tower" />
    <circle cx="416" cy="352" r="32" class="nav-icon__blossom" />
    <circle cx="576" cy="288" r="32" class="nav-icon__blossom" />
    <circle cx="736" cy="416" r="32" class="nav-icon__blossom" />
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="32"
      stroke-linecap="round"
      d="M256 560h512"
    />
  </svg>
</template>

<style scoped>
.nav-icon {
  width: 1.15em;
  height: 1.15em;
  display: block;
}

.nav-icon__cloud {
  fill: rgba(255, 228, 236, 0.55);
  stroke: currentColor;
  stroke-width: 32;
}

.nav-icon__tower {
  fill: rgba(255, 183, 197, 0.35);
  stroke: currentColor;
  stroke-width: 28;
}

.nav-icon__blossom {
  fill: var(--color-sakura-deep, #f48fb1);
}
</style>
