var Server = require('socket.io')
var io = new Server()

var STATUS = {
	IDLE: -1,
	WAIT1: 0,
	WAIT2: 1,
	START: 2,
	END: 3
}

var ROLE = {
	FINDER: 1,
	ESCAPER: 2
}

var users = []

io.on('connection', function (socket) {
	console.log('New user connected.')
	let status = STATUS.IDLE

	socket.on('JOIN_ROOM', function() {
		if(status !== STATUS.IDLE && status !== STATUS.WAIT1){
			console.log('Room is not empty.')
			socket.emit('USER_DISCONNECTED', {msg: "Room is not empty."})
			socket.disconnect()
			return;
		}
		console.log('Join Room')

		if(status === STATUS.IDLE){
			let isFind = (Math.random() > 0.5)
			users[0] = socket
			users[0].role = isFind ? ROLE.FINDER : ROLE.ESCAPER
			status = STATUS.WAIT1
		} else {
			users[1] = socket
			users[1].role = (users[0].role === ROLE.FINDER) ? ROLE.ESCAPER : ROLE.FINDER
			status = STATUS.WAIT2
		}
		let role = (users[status].role === ROLE.FINDER) ? 'finder' : 'escaper'
		socket.emit('USER_ROLE', {role: role})
	})

	socket.on('disconnect', function() {
		console.log('User disconnected.')
	})
})

io.listen(8000)
