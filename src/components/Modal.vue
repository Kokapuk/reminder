<template>
  <div class="modal-bg center" :class="!show && 'hide'">
    <div class="modal-content" :class="!show && 'hide'">
      <h2 class="mb-25">{{ title }}</h2>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    show: Boolean,
  },
};
</script>

<style scoped>
.modal-bg {
  z-index: 3;
  position: fixed;
  left: 0;
  top: var(--border-height);
  width: 100%;
  height: 100%;
  background-color: rgba(var(--font-color), 0.5);
  transition: var(--transition);
  backdrop-filter: blur(3px);
}

.modal-bg.hide {
  opacity: 0;
  pointer-events: none;
}

.modal-content {
  max-width: 500px;
  background-color: white;
  padding: 25px;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.modal-content.hide {
  scale: .85;
}

</style>
