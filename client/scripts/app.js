const app = {
  server: 'http://52.78.213.9:3000/messages',
  init: function () {},
  send: message =>
    $.ajax({
      type: 'POST',
      url: app.server,
      contentType: 'application/JSON',
      data: JSON.stringify(message),
      success: function (data) {
        console.log('Chatterbox: Message Sent!')
      },
      error: function (data) {
        console.error('Chatterbox: Failed To Send Message')
      }
    }),
  fetch: () =>
    $.ajax({
      type: 'GET',
      url: app.server,
      success: data => {
        $('#chats').html('')
        data.forEach(message => {
          if (message.roomname === $('#roomSelect').val()) {
            app.renderMessage(message)
          }
        })
      }
    }),
  clearMessages: () => {
    $('#chats').html('')
  },
  renderMessage: message => {
    $('#chats').prepend(
      `<div class="yourText, chat">
            <div class="usernameText">
            ${message.username}
            </div>
            <p class="text2">
            ${message.text}
            </p>
        </div>`
    )
  },
  renderRoom: () => {
    $('#roomSelect').append(
      `<option value="${$('#roomInput').val()}" class="selectOptions">${$('#roomInput').val()}</option>`
    )
  },
  handleSubmit: e => {
    var message = {
      username: $('#username').val(),
      text: $('#text').val(),
      roomname: $('#roomSelect').val()
    }
    app.send(message)
  },
  findRooms: () => {
    $.ajax({
      type: 'GET',
      url: app.server,
      success: data => {
        let rooms = {}
        data.forEach(message => {
          if (rooms[message.roomname] === undefined) {
            rooms[message.roomname] = 1
          }
        })
        for (var key in rooms) {
          $('#roomSelect').append(`<option value="${key}">${key}</option>`)
        }
      }
    })
  }
}

$(document).ready(() => {
  app.findRooms()
  setInterval(app.fetch, 200)
  app.fetch()

  $('#send').on('click', () => {
    if ($('#text').val() !== '') {
      app.handleSubmit()
      var message = {
        username: $('#username').val(),
        text: $('#text').val(),
        roomname: $('#roomSelect').val()
      }
      app.renderMessage(message)
      $('#text').val('')
    }
  })

  $('#roomSelect').change(() => {
    if ($('#roomSelect').val() !== '') {
      $('#room').hide()
      $('#roomSelect').hide()
      $('#createRoom').hide()
      $('#backArrow').show()
      $('#usernameBox').fadeIn(500)
    }
  })

  $('#usernameButton').on('click', () => {
    if ($('#username').val() !== '') {
      $('#main').removeClass('mainCenter')
      $('#usernameBox').hide()
      $('#textBox').fadeIn(500)
      $('#enter-button').fadeIn(500)
      $('#lobbyName').replaceWith(
        `<h5 id="lobbyName">${$('#roomSelect').val()}</h5>`
      )
      app.fetch()
      $('#currentRoom').slideDown(500)
    }
  })

  $('#roomButton').on('click', () => {
    if ($('#roomInput').val() !== '') {
      app.renderRoom()
      $('#roomInput').val('')
    }
  })

  $('#backArrow').hover(() => {
    $('#backArrow').css('color', 'blue')
  })

  $('#backArrow').mouseleave(() => {
    $('#backArrow').css('color', 'black')
  })

  $('#backArrow').on('click', () => {
    if ($('#usernameBox').css('display') === 'none') {
      $('#main').addClass('mainCenter')
      $('#currentRoom').hide()
      $('#textBox').hide()
      $('#enter-button').hide()
      $('#usernameBox').fadeIn(500)
      $('#text').val('')
    } else if ($('#createRoom').css('display') === 'none') {
      $('#main').addClass('mainCenter')
      $('#username').val('')
      $('#usernameBox').hide()
      $('#backArrow').hide()
      $('#room').fadeIn(500)
      $('#roomSelect').fadeIn(500)
      $('#createRoom').fadeIn(500)
    }
  })

  $('.coolBounce').click(function () {
    $('#chatterbox').effect('bounce', 'slow')
  })

  $('input').keypress(e => {
    var key = e.which
    if (key === 13) {
      if ($('#roomInput').val() !== '') {
        app.renderRoom()
        $('#roomInput').val('')
      } else if ($('#username').val() !== '') {
        $('#main').removeClass('mainCenter')
        $('#usernameBox').hide()
        $('#textBox').fadeIn(500)
        $('#enter-button').fadeIn(500)
        $('#lobbyName').replaceWith(
          `<h5 id="lobbyName">${$('#roomSelect').val()}</h5>`
        )
        app.fetch()
        $('#currentRoom').slideDown(500)
      }
    }
  })

  $('#text').keypress(e => {
    var keycode = event.keyCode ? event.keyCode : event.which
    if (keycode == '13') {
      if ($('#text').val() !== '') {
        app.handleSubmit()
        var message = {
          username: $('#username').val(),
          text: $('#text').val(),
          roomname: $('#roomSelect').val()
        }
        app.renderMessage(message)
        $('#text').val('')
      }
    }
  })

  $('textarea').keypress(e => {
    var key = e.which
    if (key === 13) {
      if ($('#text').val() !== '') {
        app.handleSubmit()
        var message = {
          username: $('#username').val(),
          text: $('#text').val(),
          roomname: $('#roomSelect').val()
        }
        app.renderMessage(message)
        $('#text').val('')
      }
    }
  })
})
