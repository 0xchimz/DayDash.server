var Server = require('socket.io')
var io = new Server()

var STATUS = {
	IDLE: -1,
	WAIT1: 0,
	WAIT2: 1,
	START: 2,
	END: 3
}

io.on('connection', function (socket) {
	console.log('New user connected.')
	let status = STATUS.IDLE

	socket.on('JOIN_ROOM', function() {
		if(status !== STATUS.IDLE || status !== STATUS.WAIT1){
			console.log('Room is not empty.')
			socket.emit('USER_DISCONNECTED', {msg: "Room is not empty."})
			socket.disconnect()
			return;
		}
		console.log('Join Room')
	})

	socket.on('disconnect', function() {
		console.log('User disconnected.')
	})
})

io.listen(8000)
