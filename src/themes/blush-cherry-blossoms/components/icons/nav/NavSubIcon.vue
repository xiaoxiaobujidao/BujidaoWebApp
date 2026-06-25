<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    class="nav-icon"
    aria-hidden="true"
  >
    <path class="nav-icon__plane" d="M160 512 864 256 704 768 480 608 320 832Z" />
    <path class="nav-icon__fold" d="M480 608 704 768 576 448Z" />
    <path
      fill="none"
      stroke="var(--color-sakura-deep, #f48fb1)"
      stroke-width="36"
      stroke-linecap="round"
      d="M736 320c80 64 112 128 112 192"
    />
    <circle cx="800" cy="288" r="36" class="nav-icon__petal" />
    <circle cx="736" cy="224" r="24" class="nav-icon__petal nav-icon__petal--small" />
  </svg>
</template>

<style scoped>
.nav-icon {
  width: 1.15em;
  height: 1.15em;
  display: block;
}

.nav-icon__plane {
  fill: rgba(255, 183, 197, 0.45);
  stroke: currentColor;
  stroke-width: 36;
  stroke-linejoin: round;
}

.nav-icon__fold {
  fill: rgba(244, 143, 177, 0.35);
  stroke: currentColor;
  stroke-width: 28;
  stroke-linejoin: round;
}

.nav-icon__petal {
  fill: var(--color-sakura-pink, #ffb7c5);
}

.nav-icon__petal--small {
  fill: var(--color-sakura-blush, #ffc0cb);
}
</style>
