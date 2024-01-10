<template>
  <div v-if="msg" class="toast-container" :class="type">
    {{ msg }}
  </div>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useToasts } from '@/stores/toasts.js'

const {
  setToast,
} = useToasts()

const props = defineProps({
  type: {
    type: String,
    default: 'success'
  },
  msg: {
    type: String,
    default: ''
  }
})

const timer = ref()

watch(() => props.msg, () => {
  if (props.msg.length > 0) {
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      setToast('', 'success')
    }, 5000)
  }
})

</script>

<style lang="scss">
  .toast-container {
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 1vw;
    font-size: 1.8vw;
    background: #fff;
    border: 5px solid $blue;
    border-radius: 15px;
    @include mobile {
      font-size: 16px;
      border: 2px solid $blue;
      padding: 10px;
    }
  }
</style>