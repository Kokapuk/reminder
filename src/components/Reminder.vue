<template>
  <div
    @click="
      async () => {
        await $router.push(`/edit/${reminder.id}`);
      }
    "
    class="sticker"
    :class="[reminder.color, reminder.reminded && 'reminded']">
    <h3 class="title">{{ reminder.title }}</h3>
    <span class="text">{{ reminder.text }}</span>
    <span class="date">{{ useDateStore().dateToFullString(reminder.date) }}</span>
  </div>
</template>

<script>
import { useDateStore } from '../stores/date';

export default {
  props: {
    reminder: {
      type: Object,
      required: true,
    },
  },
  methods: {
    useDateStore,
  },
};
</script>

<style scoped>
.sticker {
  cursor: pointer;
}

.text {
  display: block;
  margin-top: 10px;
}
.date {
  display: inline-block;
  margin-top: 15px;
  border-radius: 5px;
  border: 1px solid rgba(11, 19, 48, 0.4);
  padding: 5px;
}

.reminded {
  opacity: 0.5;
}
</style>
