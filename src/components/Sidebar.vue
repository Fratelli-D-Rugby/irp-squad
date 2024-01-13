<template>
  <div class="sidebar" :class="{'mobile-nav-visible': mobileNavVisible}">
    <router-link :to="{name: 'squad'}"><img class="logo" src="/logo.jpg" /></router-link>
    <div class="hamburger" @click="mobileNavVisible = !mobileNavVisible">
      <svg-icon v-if="!mobileNavVisible" type="mdi" :path="mdiMenu" :size="48" :color="'#fff'"></svg-icon>
      <svg-icon v-else type="mdi" :path="mdiClose" :size="48" :color="'#fff'"></svg-icon>
    </div>
    <div class="nav-wrapper">
      <div class="actions">
        <div class="sharing-title" v-if="!fanSquad && !sharedSquad && shared.id !== ''">
          {{ shared.title }}
        </div>
        <div class="sharing-title" v-if="sharedSquad && extShared !== ''">
          {{ extShared }}
        </div>
        <div class="sharing-title" v-if="fanSquad">
          {{ $t('selection.fans') }}
        </div>
        <div v-if="!sharedSquad && !fanSquad && isLogged && shared.id !== ''" class="button" @click="_copy">{{ $t('share.copy') }}</div>
        <div v-if="!isLogged" class="button" @click="loginVisible = true">{{ $t('selection.login') }}</div>
        <div v-if="fanSquad || sharedSquad" class="button">
          <router-link :to="{name: 'squad'}">
            {{ $t('selection.my_squad') }}
          </router-link>
        </div>
        <div v-if="!fanSquad && !sharedSquad" class="button" :class="{disabled: !completeSelection}" @click="save">{{ $t('selection.save_squad') }}</div>
        <div v-if="!fanSquad" class="button">
          <router-link :to="{name: 'fan-squad'}">
            {{ $t('selection.view_selection') }}
          </router-link>
        </div>
        <div v-if="isLogged" class="button" @click="_logout">{{ $t('selection.logout') }}</div>
      </div>
      <div class="footer">
        <div>{{ $t('footer.listen') }}</div>
        <div class="social">
          <a href="https://x.com/ItalianRugbyPod" target="_blank">
            <svg-icon type="mdi" :path="mdiTwitter" :size="32" :color="'#fff'"></svg-icon>
          </a>
          <a href="https://open.spotify.com/show/2mlp5PYwKp67hHd8BjFbQV?si=1009ad0c50944810" target="_blank">
            <svg-icon type="mdi" :path="mdiSpotify" :size="32" :color="'#fff'"></svg-icon>
          </a>
          <a href="https://www.youtube.com/channel/UCZc1LAX8Yo6quUekoCrKIPw" target="_blank">
            <svg-icon type="mdi" :path="mdiYoutube" :size="32" :color="'#fff'"></svg-icon>
          </a>
          <a href="https://podcasts.apple.com/gb/podcast/fratelli-drugby/id1688042572" target="_blank">
            <svg-icon type="mdi" :path="mdiPodcast" :size="32" :color="'#fff'"></svg-icon>
          </a>
          <a href="https://instagram.com/fratelli_di_rugby" target="_blank">
            <svg-icon type="mdi" :path="mdiInstagram" :size="32" :color="'#fff'"></svg-icon>
          </a>
        </div>
        <br />
        <p class="privacy"><router-link class="privacy" :to="{name: 'privacy-policy'}">Privacy</router-link> - 
        <router-link class="privacy" :to="{name: 'tos'}">ToS</router-link></p>
      </div>
    </div>
  </div>
  <popup :open="shareTitleVisible" @toggle="shareTitleVisible = !shareTitleVisible">
    <div class="title">{{ $t('selection.save_and_share') }}</div>
    <div class="actions">
      <p>Choose a title to share your squad:</p>
      <input class="title-input" type="text" v-model="sharingTitle" />
      <div class="button" @click="_save">{{ $t('selection.save_and_share') }}</div>
    </div>
  </popup>
  <popup :open="loginVisible" @toggle="loginVisible = !loginVisible">
    <div class="title">{{ $t('selection.login') }}</div>
    <div v-if="!_logginInViaEMail" class="actions">
      <!-- <div class="button" @click="login('google')">{{ $t('selection.login_with_google') }}</div>-->
      <div class="button" @click="login('twitter')">{{ $t('selection.login_with_twitter') }}</div>
      <div class="button" @click="_logginInViaEMail = true">{{ $t('selection.login_with_email') }}</div>
    </div>
    <div v-if="_logginInViaEMail & !loggingViaEmailSuccess" class="actions">
      <input class="title-input" type="text" v-model="_form._loggingEmail" :placeholder="$t('selection.insert_email')" />
      <div class="button"
        @click="_loginViaEmail()"
        :class=" { 'disabled': $v._loggingEmail.required.$invalid || $v._loggingEmail.email.$invalid }">
          {{ $t('selection.login_with_email') }}
        </div>
      <div class="button" @click="_logginInViaEMail = false">{{ $t('selection.cancel') }}</div>
    </div>
    <div v-if="_logginInViaEMail & loggingViaEmailSuccess" class="actions">
      <p>{{ $t('selection.check_your_email') }}</p>
    </div>
  </popup>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import SvgIcon from "vue3-icon"
import { storeToRefs } from 'pinia'
import Popup from '@/components/Popup.vue'
import { useUser } from '@/stores/user.js'
import { useToasts } from '@/stores/toasts.js'
import { mdiMenu, mdiClose, mdiTwitter, mdiSpotify, mdiYoutube, mdiPodcast, mdiInstagram } from '@mdi/js'
import { useClipboard } from '@vueuse/core'
const { copy } = useClipboard()
const userStore = useUser()


import { useRoute } from 'vue-router'

const route = useRoute()

const _logginInViaEMail = ref(false)
const loggingViaEmailSuccess = ref(false)
const _form = ref({
  _loggingEmail: ''
})
const rules = {
  _loggingEmail: { required, email }
}
const $v = useVuelidate(rules, _form)

const currentRoute = computed(() => route.name)
const fanSquad = computed(() => currentRoute.value === 'fan-squad')
const sharedSquad = computed(() => currentRoute.value === 'shared-squad')

const {
  login,
  logout,
  setPendingSave,
  loginViaEmail
} = userStore

const _loginViaEmail = async () => {
  const res = await loginViaEmail(_form.value._loggingEmail)
  if (res) {
    _form.value._loggingEmail = ''
    loggingViaEmailSuccess.value = true
  }
}

import { useSelections } from '@/stores/selections.js'
const selectionsStore = useSelections()

const {
  saveSelection,
  getSelection
} = selectionsStore


const { selection, shared, extShared } = storeToRefs(selectionsStore)

const completeSelection = computed(() => {
  return (Object.keys(selection.value).length === 15)
})

const { isLogged, user, isPendingSave } = storeToRefs(userStore)

const {
  setToast,
} = useToasts()

const loginVisible = ref(false)
const mobileNavVisible = ref(false)
const shareTitleVisible = ref(false)
const sharingTitle = ref('')

const _copy = () => {
  copy(`https://6nations.italianrugbypodcast.com/share/${shared.value.id}`)
  mobileNavVisible.value = false
  setToast('Link copied!', 'success')
}

const _logout = () => {
  logout()
  mobileNavVisible.value = false
}

const _save = () => {
  saveSelection(user.value.id, sharingTitle.value)
  mobileNavVisible.value = false
  shareTitleVisible.value = false
  setPendingSave(false)
}

const save = () => {
  if (!isLogged.value) {
    loginVisible.value = true
    setPendingSave(true)
  } else {
    shareTitleVisible.value = true
    mobileNavVisible.value = false
  }
}

watch(isLogged, () => {
  if (isLogged.value) {
    if (isPendingSave.value) {
      shareTitleVisible.value = true
      mobileNavVisible.value = false
    } else {
      getSelection(user.value.id)
    }
  }
})

watch(() => shared.value.id, () => {
  sharingTitle.value = shared.value.title
})

watch(currentRoute, () => {
  mobileNavVisible.value = false
})

</script>

<style lang="scss" scoped>
.sidebar {
  width: 20vw;
  height: 100%;
  background: $blue;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
  @include mobile {
    width: 100%;
    height: 60px;
    margin-bottom: 20px;
    flex-direction: row;
    justify-content: space-between;
    padding: 5px 10px;
  }
  .logo {
    width: 50%;
    margin: 0px auto;
    @include mobile {
      width: auto;
      height: 100%;
      margin: 0;
    }
  }
  .hamburger {
    display: none;
    @include mobile {
      display: block;
      width: 60px;
      height: 60px;
    }
  }
  &.mobile-nav-visible {
    .nav-wrapper {
      @include mobile {
        transform: translateY(0);
      }
    }
  }
}

.nav-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 2vw 0;
  @include mobile {
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    height: calc(100% - 60px);
    background: $blue;
    transform: translateY(calc(-100% - 60px));
  }
}
.actions {
  flex-grow: 1;
  padding: 2vw 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sharing-title {
  font-size: 2vw;
  margin-bottom: 1vw;
  color: #fff;
  @include mobile {
    margin-bottom: 25px;
    font-size: 22px;
  }
}

.footer {
  color: #fff;
  .social {
    display: flex;
    justify-content: space-around;
    width: 60%;
    margin-left: 20%;
    margin-top: 1vw;
    @include mobile {
      margin-top: 20px;
    }
  }
  .privacy {
    font-size: 0.7vw;
    color: #fff;
  }
}
</style>