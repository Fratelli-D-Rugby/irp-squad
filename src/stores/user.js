import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'

import { useSelections } from '@/stores/selections.js'
import { useToasts } from '@/stores/toasts.js'


import { env } from '@/env'

export const useUser = defineStore(`${env.VITE_NAMESPACE}-user-store`, {
  state: () => {
    return {
      localUser: {},
      logged: false,
      pending_save: false
    }
  },

  persist: true,

  getters: {
    user(state) {
      return state.localUser;
    },

    isLogged(state) {
      return state.logged;
    },

    isPendingSave(state) {
      return state.pending_save;
    },

  },

  actions: {
    async login(provider) {
      const {
        setToast,
      } = useToasts()
      this.fetching = true;
      try {
        let _options = {}
        if (provider === 'google') {
          _options = {
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          }
        }
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: provider,
          options: _options
        })
        if (error) throw(error)
        
      } catch(error) {
        setToast('Error Logging in!', 'error')
        this.resetState()
      } finally {
        this.fetching = false;
      }
    },
    async loginViaEmail(email) {
      const {
        setToast,
      } = useToasts()
      this.fetching = true;
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: `${env.VITE_NAMESPACE}`,
          },
        })        
        if (error) throw(error)
        return true
      } catch(error) {
        setToast('Error Logging in!', 'error')
        this.resetState()
      } finally {
        this.fetching = false;
      }
    },
    async logout() {
      const {
        setToast,
      } = useToasts()
      const {
        resetSelection,
      } = useSelections()
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw(error)
        this.resetState()
        resetSelection()
        setToast('Logged out!', 'success')
      } catch(error) {
      }
    },
    setUser(data) {
      const {
        setToast,
      } = useToasts()
      if (data) {
        this.localUser = {
          id: data.user.id,
          meta: data.user.user_metadata
        }
        this.logged = true
        setToast('Logged in!', 'success')
      } else {
        this.resetState()
      }
    },
    setPendingSave(val) {
      this.pending_save = val
    },
    resetState() {
      this.localUser = {}
      this.logged = false
      this.pending_save = false
    },
  }
})
