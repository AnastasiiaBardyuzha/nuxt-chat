<template>
  <v-col cols="12">
    <v-text-field
      label="Enter message"
      v-model="text"
      @keydown.enter="send"
      outlined
    ></v-text-field>
  </v-col>
</template>

<script>
export default {
  data() {
    return {
      text: ''
    }
  },
  methods: {
    send() {
      this.$socket.emit('createMessage', { //в качестве данных мы передаем текст текущ сообщения и id юзера отправляющего сообщ который мы получаем из стора
        text: this.text,
        id: this.$store.state.user.id
      }, data => { // передаем солбэк который будет вызван после того как сервер сделает свое дело. туда мы передаем data
        if(typeof data === 'string') {
          console.log(data);
        } else {
          this.text = '';
        }
      })
    }
  }
}
</script>