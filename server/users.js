//создаем локальный объект который будет менеджерить пользователей

class Users {
  constructor() {
    this.users = []
  }

  add(user) {
    this.users.push(user)
  }

  get(id) {
    return this.users.find(user => user.id === id)
  }

  remove(id) {
    const user = this.get(id)

    if(user) {
      this.users = this.users.filter(user => user.id !== id)
    }

    return user
  }

  getByRoom(room) {
    return this.users = this.users.filter(user => user.room === room)
  }
}

//экспартируем класс
module.exports = function() {
  return new Users()
}