<template>
  <div class="wrapper">
    <sidebar />
    <div class="squad-container">
      <div class="field-wrapper">
        <img class="background" src="/field.png" />
        <div class="players-wrapper">
          <div class="row">
            <player-selection :position="1" />
            <player-selection :position="2" />
            <player-selection :position="3" />
          </div>
          <div class="row">
            <player-selection :position="4" />
            <player-selection :position="5" />
          </div>
          <div class="row">
            <player-selection :position="6" />
            <player-selection :position="8" />
            <player-selection :position="7" />
          </div>
          <div class="row">
            <player-selection :position="9" />
            <player-selection :position="10" />
          </div>
          <div class="row">
            <player-selection :position="12" />
            <player-selection :position="13" />
          </div>
          <div class="row">
            <player-selection :position="11" />
            <player-selection :position="15" />
            <player-selection :position="14" />
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import PlayerSelection from '@/components/PlayerSelection.vue'
import Sidebar from '@/components/Sidebar.vue'
import { usePlayers } from '@/stores/players.js'
import { useSelections } from '@/stores/selections.js'
const playersStore = usePlayers()
const selectionsStore = useSelections()

import { useRoute } from 'vue-router'

const route = useRoute()

const currentRoute = computed(() => route.name)
const _currentRoute = computed(() => route)

const { getFanSelection, getSharedSelection } = selectionsStore

const {
  getPlayers,
} = playersStore


onMounted(async () => {
  getPlayers()
  if (currentRoute.value === 'fan-squad') {
    getFanSelection()
  } else if (currentRoute.value === 'shared-squad') {
    getSharedSelection(_currentRoute.value.params.id)
  }
})

watch(currentRoute, () => {
  if (currentRoute.value === 'fan-squad') {
    getFanSelection()
  } else if (currentRoute.value === 'shared-squad') {
    getSharedSelection(_currentRoute.value.params.id)
  }
})


</script>

<style lang="scss">
.wrapper {
  display: flex;
  align-items: stretch;
  width: 100%;
  overflow-x: hidden;
  min-height: 100%;
  @include mobile {
    flex-wrap: wrap;
  }
}
.squad-container {
  width: calc(100% - 20vw);
  position: relative;
  left: 20vw;
  @include mobile {
    width: 100%;
    left: 0;
    top: 80px;
  }
  .field-wrapper {
    width: 80%;
    position: relative;
    margin: 0px auto;
    @include mobile {
      width: 120%;
      left: -10%;
      height: 100%;
    }
    
    img.background {
      width: 100%;
      z-index: -1;
      @include mobile {
        height: 100%;
      }
    }
    .players-wrapper {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    .row {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>