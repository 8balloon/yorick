class Application {
  constructor() {
    this.run = () => {
      console.log("Hello world!")
      console.log("args are: ", JSON.stringify(process.argv))
    }
  }
}

module.exports = Application
