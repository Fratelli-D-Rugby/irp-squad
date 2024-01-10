import { defineStore } from 'pinia'

import { env } from '@/env'

export const useToasts = defineStore(`${env.VITE_NAMESPACE}-toasts-store`, {
  state: () => {
    return {
      _msg: '',
      _type: '',
    }
  },

  getters: {
    msg(state) {
      return state._msg
    },

    type(state) {
      return state._type
    },

  },

  actions: {
    setToast(msg, type) {
      this._msg = msg
      this._type = type
    },
  }
})