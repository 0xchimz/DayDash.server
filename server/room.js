module.exports = Room

var STATUS = {
	WAITING: 0,
	START: 1,
	END: 2
}

// var ROLE = ['FINDER', 'ESCAPER']
// var ROLE = ['FINDER']
var U_ITEM = ['KEY', 'MONSTER']
var S_ITEM = ['DOOR']

var MAP = {MAX_SIZE: 128, MIN_SIZE: 64}

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
	this.isKeyer = false
	this.level = 0
	this.uitem = []
	this.sitem = []
	for (var k = U_ITEM.length - 1; k >= 0; k--) {
		this.uitem.push(U_ITEM[k])
	}
	for (var k = S_ITEM.length - 1; k >= 0; k--) {
		this.sitem.push(S_ITEM[k])
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

	this.getMapProperty = function (){
		let map = {
			size: [127, 72]
		}
		if(this.isKeyer) {
			map.fill = getRandomInt(50, 55)
		} else {
			map.fill = getRandomInt(48, 52)
		}
		return map
	}

	this.generateItem = function (){
		let i = 0
		let item = []
		if(this.uitem.length !== 0){
			i = Math.floor(Math.random() * this.uitem.length)
			let tmp = this.uitem.splice(i, 1)[0]
			if(tmp === 'KEY'){
				this.isKeyer = true
			} else {
				this.isKeyer = false
			}
			item.push(tmp)
		}
		for(let k = 0; k < this.sitem.length; k++){
			item.push(this.sitem[i])
		}
		if(this.uitem.length === 0){
			for(let k = 0; k < U_ITEM.length; k++){
				this.uitem.push(U_ITEM[i])
			}
		}
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
