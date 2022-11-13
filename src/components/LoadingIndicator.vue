<template>
  <div class="center ghost">
    <div>
      <div :class="themeColorStore.themeColor" class="indicator" />
      <span class="text-light text-gray"><slot></slot></span>
    </div>
  </div>
</template>

<script setup>
import { useThemeColorStore } from '../stores/theme-color';

const themeColorStore = useThemeColorStore();
</script>

<style scoped>
.indicator {
  border: 12px solid;
  border-top: 12px solid transparent;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  animation: spin 1s linear infinite;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 15px;
  transition: var(--transition);
}

.indicator.yellow {
  background-color: transparent;
  border-color: rgb(var(--yellow), 0.5);
  border-top-color: transparent;
}

.indicator.orange {
  background-color: transparent;
  border-color: rgb(var(--orange), 0.5);
  border-top-color: transparent;
}

.indicator.sky-blue {
  background-color: transparent;
  border-color: rgb(var(--sky-blue), 0.5);
  border-top-color: transparent;
}

.indicator.sea-green {
  background-color: transparent;
  border-color: rgb(var(--sea-green), 0.5);
  border-top-color: transparent;
}

.indicator.pink {
  background-color: transparent;
  border-color: rgb(var(--pink), 0.5);
  border-top-color: transparent;
}

.indicator.salmon-pink {
  background-color: transparent;
  border-color: rgb(var(--salmon-pink), 0.5);
  border-top-color: transparent;
}

.ghost {
  z-index: 2;
  position: absolute;
  left: 0;
  top: 69px;
  width: 100%;
  height: calc(100% - 69px);
  background-color: white;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
