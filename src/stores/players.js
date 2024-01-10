import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'

import { useToasts } from '@/stores/toasts.js'

import { env } from '@/env'

export const usePlayers = defineStore(`${env.VITE_NAMESPACE}-players-store`, {
  state: () => {
    return {
      _players: [],
    }
  },

  getters: {
    players(state) {
      try {
        return state._players
      } catch(error) {
        return []
      }
    },

  },

  actions: {
    async getPlayers() {
      const {
        setToast,
      } = useToasts()
      try {
        let _query = supabase
          .from('players')
          .select('*')
        
        const { data, error } = await _query
          .order('last_name', { ascending: true })
        if (error) throw(error)
        this._players = data
      } catch(error) {
        setToast('Error loading, please retry', 'success')
      }
    },
  }
})