<template>
  <div class="player-container">
    <div class="preview">
      <div class="position">
        {{ position }}   
      </div>
      <div class="current-selection" @click="activateSelector">
        <player 
          v-if="currentSelection.length === 0"
          :player="fakePlayer"
          :idx="0"
          :actionable="false"
        />
        <player
          v-for="element, index in currentSelection"
          :player="element"
          :idx="index"
          :actionable="false"
        />
      </div>
    </div>
    <popup :open="selectionActive" :size="'full'" @toggle="activateSelector">
      <div class="title">
        {{ $t('selection.selection_for', {position}) }}
      </div>
      <div class="columns">
        <div class="current-selection">
          <span class="subtitle">{{ $t('selection.active') }}</span>
          <Sortable
            :list="currentSelection"
            item-key="id"
            tag="div"
            @end="onEnd"
            :options="scrollableOptions"
          >
            <template #item="{element, index}">
              <div class="draggable" :key="element.id">
                <player
                  :player="element"
                  :idx="index"
                  :actionable="true"
                  :in-list="true"
                  @remove="handleRemove"
                />
              </div>
            </template>
          </Sortable>
        </div>
        <div class="available-players">
          <span class="subtitle">{{ $t('selection.available') }}</span>
          <player
            v-for="player in selectable"
            :player="player"
            :selectable="currentSelection.length < 3"
            :actionable="currentSelection.length < 3"
            :in-list="true"
            @add="handleAdd"
          />
        </div>
      </div>
    </popup>
  </div>
</template>

<script setup>

import Player from '@/components/Player.vue'
import Popup from '@/components/Popup.vue'
import { ref, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayers } from '@/stores/players.js'
const playersStore = usePlayers()
import { Sortable } from "sortablejs-vue3"
import { useRoute } from 'vue-router'

const route = useRoute()

const currentRoute = computed(() => route.name)
const fanSquad = computed(() => currentRoute.value === 'fan-squad')
const sharedSquad = computed(() => currentRoute.value === 'shared-squad')

import { useSelections } from '@/stores/selections.js'
const selectionsStore = useSelections()

const { selected } = storeToRefs(selectionsStore)

const { setRoleSelection } = selectionsStore

const selectionActive = ref(false)

const scrollableOptions = ref({
})

const fakePlayer = ref({
  last_name: '',
  first_name: '',
  fake: true
})

const props = defineProps({
  position: {
    type: Number,
    default: 0
  }
})

const activateSelector = () => {
  if (!fanSquad.value && !sharedSquad.value) {
    selectionActive.value = !selectionActive.value
  }
}

const onEnd = (event) => {
  const _local = [...currentSelection.value]
  const item = _local.splice(event.oldIndex, 1)[0];
  nextTick(() => {
    _local.splice(event.newIndex, 0, item)
    currentSelection.value = _local
  });
}

const handleAdd = (player) => {
  const _local = currentSelection.value
  _local.push(player)
  currentSelection.value = _local
}

const handleRemove = (player) => {
  currentSelection.value = currentSelection.value.filter((el) => el.id !== player.id)
}

const currentSelection = computed({
  get() {
    if (fanSquad.value) {
      if (selectionsStore._fanSelection[props.position]) {
        return selectionsStore._fanSelection[props.position]
      }
    } else if (sharedSquad.value) {
      if (selectionsStore._sharedSelection[props.position]) {
        return selectionsStore._sharedSelection[props.position]
      }
    } else {
      if (selectionsStore._selection[props.position]) {
        return selectionsStore._selection[props.position]
      }
    }
    
    return []
  },
  set(newList) {
    setRoleSelection(props.position, newList)
  }
})

const available = computed(() => {
  return playersStore._players.filter((el) => {
    return [el.role, el.role_2, el.role_3, el.role_4, el.role_5, el.role_6].includes(props.position)
  })
})

const selectable = computed(() => {
  return available.value.filter((el) => {
    return !selected.value.map((el) => el.id).includes(el.id)
  })
})

</script>

<style lang="scss" scoped>

.player-container {
  width: 28%;
  padding: 0 1vw;
  position: relative;
  @include mobile {
    padding: 0 5px;
    margin-bottom: 3px;
  }
  .preview {
    padding: 0.5vw;
    background: rgba(255,255,255, 0.7);
    border-radius: 15px; 
    border: 4px solid $blue;
    @include mobile {
      padding: 0px;
      border: 2px solid $blue;
    }
  }
}
.current-selection, .available-players {
  padding: 5px;
  @include mobile {
    padding: 5px 10px;
  }
}

.position {
  font-size: 1.8vw;
  text-align: center;
  position: absolute;
  top: 0.5vw;
  left: 1.5vw;
  @include mobile {
    font-size: 18px;
    top: 8px;
    left: 14px;
  }
}

</style>