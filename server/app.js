var Server = require('socket.io')
var io = new Server()

var Room = require('./room')

var MAX_PLAYER = 2

var rooms = {}
var users = {}

var cRoom

var GAME_STATUS = {
	LOADING: 1,
	READY: 2,
	PLAYING: 3,
	ON_DOOR: 4
}

io.sockets.on('connection', function (client) {
	console.log(client.id + ' connected.')

	client.on('JOIN_ROOM', function() {
		// Create New Room if the room is not empty or undefined.
		if(!cRoom){
			console.log("cRoom is undefined.")
			cRoom = new Room(MAX_PLAYER)
		} else if(!cRoom.isEmpty()){
			console.log("Room no." + cRoom.getRoomNo() + " is not empty.")
			cRoom = new Room(MAX_PLAYER)
		}
		client.room = cRoom
		client.join(cRoom.getRoomNo())
		client.items = cRoom.generateItem()
		client.map = cRoom.getMapProperty()
		client.level = cRoom.getLevel()
		client.status = GAME_STATUS.LOADING
		cRoom.joinRoom()
		console.log(client.id + ' join room no.' + cRoom.getRoomNo())

		client.emit('JOIN_RESPONSE', {roomInfo: cRoom.getRoomInfo()})
		if(cRoom.currentPlayer === MAX_PLAYER){
			console.log('Room no.' + cRoom.getRoomNo() + ' game is starting.')
			let members = io.sockets.in(cRoom.getRoomNo()).adapter.rooms[cRoom.getRoomNo()].sockets
			for(let member in members){
				let attr = {}
				attr.items = io.sockets.connected[member].items
				attr.map = io.sockets.connected[member].map
				attr.level = io.sockets.connected[member].level
				console.log(attr)
				io.sockets.connected[member].emit('START_GAME', {data: attr})
			}
		}
	})

	client.on('DEAD', function() {
		io.sockets.in(client.room .getRoomNo()).emit('DEAD')
	})

	client.on('GAME_STATUS_READY', function() {
		client.status = GAME_STATUS.READY
		let _room = client.room
		let play = true
		let members = io.sockets.in(_room.getRoomNo()).adapter.rooms[_room.getRoomNo()].sockets
		for(let member in members){
			play = (play && (io.sockets.connected[member].status === GAME_STATUS.READY))
		}
		if(play){
			setTimeout(function () {
				io.sockets.in(_room.getRoomNo()).emit('PLAY_GAME')
			}, 5000);
		}
	})

	client.on('PLAYER_ENTER_DOOR', function() {
		client.status = GAME_STATUS.ON_DOOR
		let _room = client.room
		let nextMap = true && _room.takeKey
		console.log('Key: ' + _room.takeKey)
		let members = io.sockets.in(_room.getRoomNo()).adapter.rooms[_room.getRoomNo()].sockets
		for(let member in members){
			nextMap = (nextMap && (io.sockets.connected[member].status === GAME_STATUS.ON_DOOR))
		}
		if(nextMap){
			_room.nextLevel()
			client.items = _room.generateItem()
			client.map = _room.getMapProperty()
			client.level = _room.getLevel()
			let attr = {items: client.items, map: client.map, level: client.level}
			io.sockets.in(_room.getRoomNo()).emit('NEXT_MATCH', {data: attr})
		}
	})

	client.on('PLAYER_EXIT_DOOR', function() {
		client.status = GAME_STATUS.PLAYING
	})

	client.on('FOUND_KEY', function() {
		let _room = client.room
		_room.takeKey = true
		if(client.isKeyer){
			client.emit('EVENT', {name: 'ADD_MONSTERS', num: 20})
		} else {
			client.emit('EVENT', {name: 'ADD_MONSTERS', num: 15})
		}
		io.sockets.in(_room.getRoomNo()).emit('EVENT', {
			name: 'ENABLE_DOOR'
		})
	})

	client.on('disconnect', function() {
		client.room.leaveRoom()
		console.log(client.id + ' leave room no.' + client.room.getRoomNo())
		if (client.room.currentPlayer <= 0){
			delete client.room
			cRoom = undefined
		}
		console.log(client.id + ' disconnected')
		delete users[client.id]
	})
})

io.listen(8000)
