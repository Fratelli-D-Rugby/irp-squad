import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'

import { env } from '@/env'
import { useToasts } from '@/stores/toasts.js'

const parseRemoteSelection = (data) => {
  const _selection = {}
  data.forEach((el) => {
    if (!_selection.hasOwnProperty(el.role)) {
      _selection[el.role] = []
    }
    _selection[el.role][3 - el.rank] = el.player
  })
  return _selection
}

const parseFanSelection = (data) => {
  const _selection = {}
  data.forEach((el) => {
    if (!_selection.hasOwnProperty(el.selection_role)) {
      _selection[el.selection_role] = []
    }
    _selection[el.selection_role].push({
      id: el.id,
      first_name: el.first_name,
      last_name: el.last_name,
      score: el.score,
      img_url: el.img_url
    })
  })
  const _finalSelection = {}
  Object.keys(_selection).forEach((k) => {
    _finalSelection[k] = _selection[k].sort((a, b) => b.score - a.score).slice(0, 3)
  })
  Object.keys(_finalSelection).forEach((k) => {
    const double = Object.keys(_finalSelection).filter((_k) => {
      return ((_finalSelection[k][0].id === _finalSelection[_k][0].id) && (k !== _k))
    })
    if (double.length > 0) {
      double.forEach((_d) => {
        const second = (_finalSelection[k][0].score >= _finalSelection[_d][0].score) ? _d : k
        const temp = _finalSelection[second][0]
        _finalSelection[second][0] = _finalSelection[second][1]
        _finalSelection[second][1] = temp
      })
    }
  })
  return _finalSelection
}

export const useSelections = defineStore(`${env.VITE_NAMESPACE}-selection-store`, {
  state: () => {
    return {
      _selection: {},
      _fanSelection: {},
      _sharedSelection: {},
      _sharedTitle: '',
      _selectionTitle: '',
      _selectionId: ''
    }
  },

  persist: true,

  getters: {
    selection(state) {
      try {
        return state._selection
      } catch(error) {
        return {}
      }
    },
    fanSelection(state) {
      try {
        return state._fanSelection
      } catch(error) {
        return {}
      }
    },
    shared(state) {
      return {
        title: state._selectionTitle,
        id: state._selectionId
      }
    },
    extShared(state) {
      return state._sharedTitle
    },
    selected(state) {
      try {
        return Object.values(state._selection).flat(1)
      } catch(error) {
        return []
      }
    },
  },

  actions: {
    resetSelection() {
      this._selection = {}
      this._selectionTitle = ''
      this._selectionId = ''
    },
    async setRoleSelection(role, players) {
      this._selection[role] = players
    },
    async saveSelection(user, title) {
      const {
        setToast,
      } = useToasts()
      setToast('Saving...', 'success')
      const _selection = []
      try {
        Object.keys(this._selection).forEach((k) => {
          this._selection[k].forEach((el, idx) => {
            _selection.push({
              player: el.id,
              role: parseInt(k),
              rank: 3 - idx
            })
          })
          
        })
        const { error: delError } = await supabase
          .from('selections')
          .delete()
          .eq('user_id', user)
        if (delError) throw(delError)
        const { data: _sharedData, error: checkShareError } = await supabase
          .from('shared')
          .select()
          .eq('user_id', user)
        if (checkShareError) throw(checkShareError)
        if (_sharedData.length) {
          const { data: sharedData, error: shareError } = await supabase
            .from('shared')
            .update({title: title})
            .eq('user_id', user)
            .select() 
          if (shareError) throw(shareError)
          this._selectionTitle = sharedData[0].title
          this._selectionId = sharedData[0].id
        } else {
          const { data: sharedData, error: shareError } = await supabase
            .from('shared')
            .insert([{title: title}])
            .select() 
          if (shareError) throw(shareError)
          this._selectionTitle = sharedData[0].title
          this._selectionId = sharedData[0].id
        }
        const { data, error } = await supabase
          .from('selections')
          .insert(_selection)
          .select() 
        if (error) throw(error)
        
        setToast('Selection saved!', 'success')
      } catch(error) {
        setToast('Error saving, please retry' + error, 'success')
      }
    },
    async getSelection(user) {
      const {
        setToast,
      } = useToasts()
      try {
        const {data, error} = await supabase.from('selections')
          .select('*, player(*)')
          .eq('user_id', user)
          .order('role', { ascending: true })
          .order('rank', { ascending: false })
        if (error) throw(error)
        const { data: _sharedData, error: checkShareError } = await supabase
          .from('shared')
          .select()
          .eq('user_id', user)
        if (checkShareError) throw(checkShareError)
        if (_sharedData.length > 0) {
          this._selectionTitle = _sharedData[0].title
          this._selectionId = _sharedData[0].id
          this._selection = parseRemoteSelection(data)
        }
      } catch(error) {
        setToast('Error getting selection, please retry' + error, 'success')
      }
    },
    async getSharedSelection(id) {
      const {
        setToast,
      } = useToasts()
      try {
        const { data: _sharedData, error: checkShareError } = await supabase
          .from('shared')
          .select()
          .eq('id', id)
        if (checkShareError) throw(checkShareError)
        const {data, error} = await supabase.from('selections')
          .select('*, player(*)')
          .eq('user_id', _sharedData[0].user_id)
          .order('role', { ascending: true })
          .order('rank', { ascending: false })
        if (error) throw(error)
        
        this._sharedTitle = _sharedData[0].title
        this._sharedSelection = parseRemoteSelection(data)
      } catch(error) {
        setToast('Error getting selection, please retry' + error, 'success')
      }
    },
    async getFanSelection() {
      const {
        setToast,
      } = useToasts()
      try {
        const {data, error} = await supabase.rpc('get_all_selection')
        if (error) throw(error)
        this._fanSelection = parseFanSelection(data)
      } catch(error) {
        setToast('Error getting selection, please retry', 'success')
      }
    }
  }
})