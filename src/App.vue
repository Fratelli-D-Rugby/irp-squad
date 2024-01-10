

<template>
  <router-view />
  <toast :msg="msg" :type="type"/>
</template>

<script setup>

import { supabase } from '@/utils/supabase'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import Toast from '@/components/Toast.vue'
import { useUser } from '@/stores/user.js'
const userStore = useUser()

const {
  setUser
} = userStore




import { useToasts } from '@/stores/toasts.js'
const toastsStore = useToasts()
const { msg, type } = storeToRefs(toastsStore)

onMounted(() => {
  const subscription = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'INITIAL_SESSION') {
      setUser(session)
      // handle initial session
    } else if (event === 'SIGNED_IN') {
      setUser(session)
      // handle sign in event
    } else if (event === 'SIGNED_OUT') {
      // handle sign out event
    } else if (event === 'PASSWORD_RECOVERY') {
      // handle password recovery event
    } else if (event === 'TOKEN_REFRESHED') {
      // handle token refreshed event
    } else if (event === 'USER_UPDATED') {
      setUser(session)
      // handle user updated event
    }
  })
})

</script>
