<template>
  <div v-if="open" class="popup" :class="size">
    <div class="popup-background" @click="$emit('toggle')"></div>
    <div class="internal-popup">
      <div class="controls">
        <div class="close" @click="$emit('toggle')">
          <svg-icon type="mdi" :path="mdiCloseCircleOutline" :size="24" :color="'#17a4eb'"></svg-icon>
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import SvgIcon from "vue3-icon"
import { mdiCloseCircleOutline } from '@mdi/js'
const emit = defineEmits(['toggle'])

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'small'
  }
})
</script>

<style lang="scss">
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
.popup-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255, 0.3);
}

.controls {
  position: absolute;
  top: 0;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: flex-end;
  .close {
    cursor: pointer;
    width: 50px;
    height: 50px;
    @include mobile {
      width: 40px;
      height: 40px;
    }
    svg {
      width: 70%;
      height: 70%;
      margin-left: 15%;
      margin-top: 15%;
    }
  }
}

.internal-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  max-width: 20vw;
  height: 50vh;
  background: rgba(255,255,255, 0.975);
  transform: translate(-50%, -50%);
  border: 10px solid $blue;
  border-radius: 15px;
  overflow: auto;
  padding: 1vw;
  @include mobile {
    height: 40vh;
    width: 90%;
    max-width: none;
    display: flex;
    flex-direction: column;
  }
  .title {
    text-align: center;
    font-size: 1.8vw;
    @include mobile {
      margin-top: 10px;
      font-size: 20px;
    }
  }
  .button {
    background: $blue;
    color: #fff;
  }
  .actions {
    flex-grow: 1;
  }
}

.small {
  .internal-popup {
    .title {
      @include mobile {
        margin-bottom: 25px;
      }
    }
  }
}
.full {
  .internal-popup {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    max-width: 1280px;
    height: 80vh;
    background: rgba(255,255,255, 0.975);
    transform: translate(-50%, -50%);
    border: 10px solid $blue;
    border-radius: 15px;
    overflow: auto;
    @include mobile {
      border: 5px solid $blue;
      width: 95%;
    }

    .columns {
      display: flex;
      flex-wrap: wrap;
    }
    .title {
      text-align: center;
      width: 100%;
      font-size: 1.6vw;
      padding: 10px;
      @include mobile {
        font-size: 20px;
      }
    }
    .subtitle {
      text-align: center;
      width: 100%;
      font-size: 1.2vw;
      padding: 10px;
      display: inline-block;
      margin-bottom: 20px;
      @include mobile {
        font-size: 16px;
        margin-bottom: 10px;
      }
    }
    .current-selection {
      width: 50%;
      @include mobile {
        width: 100%;
      }
    }
    .available-players {
      width: 50%;
      @include mobile {
        width: 100%;
      }
    }
  }
}
</style>