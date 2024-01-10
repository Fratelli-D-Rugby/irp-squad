<template>
  <div class="info" :class="[`idx-${idx}`, {'in-list': inList, 'draggable': !selectable && actionable}]">
    <div v-if="idx === 0 || actionable" class="pic">
      <div>
        <svg-icon v-if="player.fake" type="mdi" :path="mdiAccountPlus" :size="48"></svg-icon>
        <img :src="profilePic" />
      </div>
    </div>
    <span class="name">{{ player.last_name }} {{ firstName }} <span v-if="player.score">({{ player.score }})</span></span>
    <span class="icon" v-if="selectable && actionable" @click="$emit('add', player)">
      <svg-icon type="mdi" :path="mdiAccountPlus" :size="48"></svg-icon>
    </span>
    <span class="icon" v-if="!selectable && actionable" @click="$emit('remove', player)">
      <svg-icon type="mdi" :path="mdiAccountRemove" :size="48"></svg-icon>
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SvgIcon from "vue3-icon"
import { mdiAccountPlus, mdiAccountRemove } from '@mdi/js'

import profile0 from '@/assets/images/0.svg'
import profile1 from '@/assets/images/1.svg'
import profile2 from '@/assets/images/2.svg'
import profile3 from '@/assets/images/3.svg'
import profile4 from '@/assets/images/4.svg'
import profile5 from '@/assets/images/5.svg'
import profile6 from '@/assets/images/6.svg'

const defaultImages = [profile0, profile1, profile2, profile3, profile4, profile5, profile6]

const profilePic = computed(() => {
  if (props.player.img_url) {
    return props.player.img_url
  } else {
    return defaultImages[props.player.id % defaultImages.length]
  }
})

const emit = defineEmits(['add', 'remove'])

const props = defineProps({
  player: {
    type: Object,
    default: () => {}
  },
  selectable: {
    type: Boolean,
    default: false
  },
  idx: {
    type: Number,
    default: 0
  },
  actionable: {
    type: Boolean,
    default: false
  },
  inList: {
    type: Boolean,
    default: false
  },
})

const firstName = computed(() => {
  if (!props.player.fake) {
    return `${props.player.first_name[0]}.`
  }
  return '?'
})
</script>

<style lang="scss">
.info {
  font-size: 1.1vw;
  text-align: center;
  @include mobile {
    font-size: 10px;
  }
  &.idx-0:not(.in-list) {
    font-size: 1.6vw;
    @include mobile {
      font-size: 16px;
    }
  }
  &.in-list {
    font-size: 1.8vw;
    text-align: left;
    width: 80%;
    background: rgba(227, 227, 227, 0.6);
    padding: 0.5vw 1vw;
    border-radius: 15px;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    @include mobile {
      font-size: 20px;
      padding: 5px 10px;
      width: 100%;
    }
    &.draggable {
      cursor: move;
    }
    &:hover {
      background: rgba(227, 227, 227, 1);
    }
  }
  .pic {
    width: 40%;
    height: 0;
    padding-top: 40%;
    background: $blue;
    border-radius: 100%;
    margin: 0px auto;
    margin-bottom: 0.4vw;
    position: relative;
    overflow: hidden;
    @include mobile {
      width: 50%;
      padding-top: 50%;
      margin-bottom: 5px;
    }
    & > div {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) !important;
      width: 100%;
      height: 100%;
      img, svg {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
      }
      svg {
        width: 60%;
        height: 60%;
        top: 15%;
        left: 15%;
      }
    }
  }
  .name {
    flex-grow: 1;
  }
  .icon {
    cursor: pointer;
    opacity: 0.6;
    &:hover {
      opacity: 1;
    }
  }
  &.in-list {
    display: flex;
    align-items: center;
    margin: 0 0 0.9vw 0.9vw;
    @include mobile {
      margin: 0 0 10px 0;
    }
    .pic {
      width: 16%;
      padding-top: 16%;
      margin: 0 0.9vw 0 0;
      background: $blue;
      @include mobile {
        margin: 0 10px 0 0;
      }
    }
    .icon {
      @include mobile {
        width: 50px;
        text-align: center;
        svg {
          width: 70%;
        }
      }
    }
  }
}
</style>