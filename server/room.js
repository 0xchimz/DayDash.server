module.exports = Room

var STATUS = {
	WAITING: 0,
	START: 1,
	END: 2
}

// var ROLE = ['FINDER', 'ESCAPER']
// var ROLE = ['FINDER']
var ITEM = ['KEY']

var currentRoom = 0

var levelKey = [
	[1],
	[1, 2],
	[1, 2, 3]
]

function Room(maxPlayer){
	this.roomNo = ++currentRoom
	this.maxPlayer = maxPlayer
	this.currentPlayer = 0
	this.status = STATUS.WAITING
	this.level = 0
	this.item = []
	for (var k = ITEM.length - 1; k >= 0; k--) {
		this.item.push(ITEM[k])
	}

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
			currentLevel: this.level,
			keyNo: keyRandom(),
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
		} else {
			return false
		}
	}

	this.isEmpty = function () {
		return (this.maxPlayer > this.currentPlayer)
	}

	this.generateItem = function (){
		let i = 0
		let item = []
		if(this.item.length !== 0){
			i = Math.floor(Math.random() * this.item.length)
			item.push(this.item.splice(i, 1)[0])
		}
		item.push('DOOR')
		// if(this.item.length === 0){
		// 	for (var j = ITEM.length - 1; j >= 0; j--) {
		// 		this.item.push(ITEM[j])
		// 	}
		// }
		return item
	}
}

function keyRandom() {
	let tmp = []
	for(var i = 0; i < levelKey.length; i++){
		let map = Math.floor(Math.random() * levelKey[i].length)
		tmp.push(levelKey[i][map])
	}
	return tmp
}
