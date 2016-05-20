var Server = require('socket.io')
var io = new Server()

var Room = require('./room')

var MAX_PLAYER = 2

var rooms = {}
var users = {}

var cRoom

io.sockets.on('connection', function (socket) {
	console.log(socket.id + ' connected.')
	users[socket.id] = socket

	socket.on('JOIN_ROOM', function() {
		// Create New Room if the room is not empty or undefined.
		if(!cRoom){
			console.log("cRoom is undefined.")
			cRoom = new Room(MAX_PLAYER)
		} else if(!cRoom.isEmpty()){
			console.log("Room no." + cRoom.getRoomNo() + " is not empty.")
			cRoom = new Room(MAX_PLAYER)
		}

		socket.join(cRoom.getRoomNo())
		socket.map = cRoom.generateMap()
		socket.room = cRoom
		cRoom.joinRoom()
		console.log(socket.id + ' join room no.' + cRoom.getRoomNo())

		socket.emit('JOIN_RESPONSE', {roomInfo: cRoom.getRoomInfo()})
		if(cRoom.currentPlayer === MAX_PLAYER){
			console.log('Room no.' + cRoom.getRoomNo() + ' game is starting.')
			let members = io.sockets.in(cRoom.getRoomNo()).adapter.rooms[cRoom.getRoomNo()].sockets
			for(let member in members){
				let mapType = io.sockets.connected[member].map
				io.sockets.connected[member].emit('MAP_INFO', {data: mapType})
			}
			io.sockets.in(cRoom.getRoomNo()).emit('START_GAME')
		}
	})

	socket.on('disconnect', function() {
		let room = socket.room
		room.leaveRoom()
		console.log(socket.id + ' leave room no.' + room.getRoomNo())
		if (room.currentPlayer <= 0){
			delete socket.room
			cRoom = undefined
		}
		console.log(socket.id + ' disconnected')
		delete users[socket.id]
	})
})

io.listen(8000)