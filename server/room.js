module.exports = Room

var STATUS = {
	WAITING: 0,
	START: 1,
	END: 2
}

var ROLE = {
	FINDER: 1,
	ESCAPER: 2
}

var currentRoom = 0

function Room(maxPlayer){
	this.roomNo = ++currentRoom
	this.maxPlayer = maxPlayer
	this.currentPlayer = 0
	this.status = STATUS.WAITING
	this.level = 1

	this.getRoomNo = function() {
		return this.roomNo
	}

	this.getLevel = function() {
		return this.level
	}

	this.nextLevel = function() {
		this.level++
	}

	this.getRoomInfo = function() {
		let info = {
			no: this.roomNo,
			level: this.level,
			status: this.status
		}
		return info
	}

	this.leaveRoom = function(){
		this.currentPlayer--
		if(this.currentPlayer <= 0){
			currentRoom--
		}
	}

	this.joinRoom = function(){
		if(this.isEmpty()){
			this.currentPlayer++

			// Random role for player
			// if(room.status === STATUS.IDLE){
			// 	let role = (Math.random() > 0.5)
			// 	users[0] = socket
			// 	users[0].role = isFind ? ROLE.FINDER : ROLE.ESCAPER
			// } else {
			// 	users[1] = socket
			// 	users[1].role = (users[0].role === ROLE.FINDER) ? ROLE.ESCAPER : ROLE.FINDER
			// }

			// let role = (users[status].role === ROLE.FINDER) ? 'finder' : 'escaper'
		} else {
			return false
		}
	}

	this.isEmpty = function () {
		return (this.maxPlayer > this.currentPlayer)
	}
}