class Person{
    constructor(username, age, score){
        this.username = username,
        this.age = age,
        this.score = score,
        this.calculate()
    }
    calculate(){
        return `this is your new score ${this.age + this.score}`
    }
}

// const john = new Person('cyebrgate', 23, 56)
module.exports = Person