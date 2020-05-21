export const state = () => ({
  user: {},
  messages: [],
  users: []
})

export const actions = {

}

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  clearDate(state) {
    state.user = {}
    state.messages = []
    state.users = []
  },
  SOCKET_newMessage(state, message) {
    state.messages.push(message)
  },
  SOCKET_updateUsers(state, users) {
    state.users = users
  }
}

export const getters ={

}