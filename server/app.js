var Server = require('socket.io')
var io = new Server()

io.on('connection', function (socket) {
	console.log('New user connected.')
})

io.listen(8000)
