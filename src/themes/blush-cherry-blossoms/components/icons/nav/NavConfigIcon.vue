<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    class="nav-icon"
    aria-hidden="true"
  >
    <path
      class="nav-icon__file"
      d="M288 192h288l160 160v480c0 44.2-35.8 80-80 80H288c-44.2 0-80-35.8-80-80V272c0-44.2 35.8-80 80-80z"
    />
    <path class="nav-icon__fold" d="M576 192v160c0 44.2 35.8 80 80 80h160" />
    <path
      stroke="currentColor"
      stroke-width="32"
      stroke-linecap="round"
      d="M352 448h256M352 576h320M352 704h224"
    />
    <path
      fill="none"
      stroke="var(--color-sakura-deep, #f48fb1)"
      stroke-width="28"
      stroke-linecap="round"
      d="M352 352h96"
    />
    <path class="nav-icon__bookmark" d="M736 160v224l-48-32-48 32V160z" />
    <circle cx="688" cy="224" r="20" class="nav-icon__petal" />
  </svg>
</template>

<style scoped>
.nav-icon {
  width: 1.15em;
  height: 1.15em;
  display: block;
}

.nav-icon__file {
  fill: rgba(255, 183, 197, 0.25);
  stroke: currentColor;
  stroke-width: 32;
  stroke-linejoin: round;
}

.nav-icon__fold {
  fill: rgba(255, 228, 236, 0.5);
  stroke: currentColor;
  stroke-width: 32;
  stroke-linejoin: round;
}

.nav-icon__bookmark {
  fill: var(--color-sakura-pink, #ffb7c5);
  stroke: var(--color-sakura-deep, #f48fb1);
  stroke-width: 16;
  stroke-linejoin: round;
}

.nav-icon__petal {
  fill: var(--color-sakura-blush, #ffc0cb);
}
</style>
