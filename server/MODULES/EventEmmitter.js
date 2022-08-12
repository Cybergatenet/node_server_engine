const EventEmmiter = require('events') // Module
const eventEmitter = new EventEmmiter() // class

// eventEmitter.on('nelson', (data) => {
//     console.log(`Nelson is here now ${data}`)
// })
// eventEmitter.emit('nelson', 'Hello')
class Person extends EventEmmiter{
    constructor(user_id, username){
        super()
        this.user_id = user_id
        this.username = username
    }
    get name() {
        return this.name
    }
}

let cybergate = new Person(5, "Cybergate")
// console.log(cybergate.username)
cybergate.on('username', () => {
    console.log(`My name is ${cybergate.username}`)
})

cybergate.emit('username')

module.exports.eventEmitter