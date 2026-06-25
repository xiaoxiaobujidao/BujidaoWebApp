<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    class="nav-icon"
    aria-hidden="true"
  >
    <path
      class="nav-icon__wallet"
      d="M192 320h512c88.4 0 160 71.6 160 160v224c0 88.4-71.6 160-160 160H192c-88.4 0-160-71.6-160-160V480c0-88.4 71.6-160 160-160z"
    />
    <path fill="currentColor" d="M608 480h192c70.7 0 128 57.3 128 128s-57.3 128-128 128H608V480z" />
    <circle cx="768" cy="608" r="48" class="nav-icon__coin" />
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="40"
      stroke-linecap="round"
      d="M320 544h128M320 672h192"
    />
    <path class="nav-icon__gem" d="M832 256 896 320 832 384 768 320Z" />
  </svg>
</template>

<style scoped>
.nav-icon {
  width: 1.15em;
  height: 1.15em;
  display: block;
}

.nav-icon__wallet {
  fill: rgba(206, 147, 216, 0.2);
  stroke: currentColor;
  stroke-width: 36;
  stroke-linejoin: round;
}

.nav-icon__coin {
  fill: var(--color-accent-light, #ce93d8);
}

.nav-icon__gem {
  fill: var(--color-accent-deep, #7b1fa2);
}
</style>
