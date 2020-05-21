const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const users = require('./users')() //подключаем объект юзерс

const newMesObj = (name, text, id) => ({ name, text, id })


io.on('connection', (socket) => {

  //data - то что мы передаем в функцию в методах
  //cb - callback function (в нее мы передаем нужную нам инфу уходящую  в методы)

  socket.on('userJoined', (data, cb) => { //в этих местах data это то что мы получаем из методов
    if(!data.name || !data.room) {
      return cb('Uncorrect room')
    }

    socket.join(data.room) //добавляем зашедшего пользователя в комнату в комнату в сокетах используя метод join и передавая номер комнаты
    
    users.remove(socket.id) //во избежание ошибок удалим сначала пользоватеkя из локальной базы данных
    
    users.add({ //добавляем зашедшего пользователя в комнату в локальную базу данных юзеров комнаты
      id: socket.id,
      name: data.name,
      room: data.room
    })

    cb({userId: socket.id})
    io.to(data.room).emit('updateUsers', users.getByRoom(data.room)) // обновляем список пользователей утех пользоватееле которые остались еще в чате
    socket.emit('newMessage', newMesObj('admin', `Welcome ${data.name}`)) //отправляем сообщение пользователю что он зашел при помощи эмита мутейшина newMessage и передачи в него newMesObj
    // socket.emit('newMessage', newMesObj('Test', `Welcome`))
    socket.broadcast.to(data.room)//передаем сообщение всем пользователям кроме вошедшего сообщение что есть вошедший пользователь
      .emit('newMessage', newMesObj('admin', `${data.name} entered`)) 
  })

  //создаем отрисовку сообщений
  socket.on('createMessage', (data, cb) => {
    if(!data.text) { //если пустой текст
      return cb('you shoul enter text')
    }

    //получаем пользователя
   const user = users.get(data.id)
   if(user) {
    //чоб отправить сообщ всем пользователям комнаты эмитим комнату при помощи объекта io вызываем метод to и нужно указаить комнату
    io.to(user.room).emit('newMessage', newMesObj(user.name, data.text, data.id))
   }
   cb()
  })

  //выход из чата
  socket.on('userLeft', (id, cb) => {
    const user = users.remove(id) //функция удаляет пользователя из масиива и возвращвет удаленного пользователя 

    if (user) {
      io.to(user.room)//передаем сообщение всем пользователям кроме вошедшего сообщение что есть вышедший пользователь
      .emit('newMessage', newMesObj('admin', `${user.name} exeted`))
    }
    cb()
  })

  //пользователь закрыл вкладку

  socket.on('disconnect', () => {
    const user = users.remove(socket.id) //функция удаляет пользователя из масиива и возвращaет удаленного пользователя 

    if (user) {
      io.to(user.room).emit('updateUsers', users.getByRoom(user.room)) // обновляем список пользователей утех пользоватееле которые остались еще в чате
      io.to(user.room)//передаем сообщение всем пользователям кроме вошедшего сообщение что есть вышедший пользователь
      .emit('newMessage', newMesObj('admin', `${user.name} exeted`))
    }
  })

})

module.exports = {
  app,
  server
}