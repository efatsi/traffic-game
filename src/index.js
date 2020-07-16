import './style.css'
import * as PIXI from 'pixi.js'
import Road from './models/road'
import Car from './models/car'

// Set up main canvas
const app = new PIXI.Application({
  width: 400,
  height: 350,
  backgroundColor: 0x12232f,
  resolution: window.devicePixelRatio || 1
})
document.body.appendChild(app.view)

// Add a fork of roads
const road = new Road(50, 200, 200, 200)
app.stage.addChild(road.graphics)
const road2 = new Road(200, 200, 275, 100)
app.stage.addChild(road2.graphics)
const road3 = new Road(200, 200, 350, 200)
app.stage.addChild(road3.graphics)
const road4 = new Road(200, 200, 300, 300)
app.stage.addChild(road4.graphics)

// Click to add cars
app.stage.interactive = true
app.renderer.plugins.interaction.on('pointerdown', onPointerDown)
let cars = []
function onPointerDown() {
  const endRoad = [road2, road3, road4][Math.floor(Math.random() * 3)]
  const car = new Car([road, endRoad])
  app.stage.addChild(car.graphics)
  cars.push(car)
}

// Make cars move
app.ticker.add(delta => {
  cars.forEach(c => {
    c.tick(delta)
  })

  // Remove cars that have made it to their destination
  cars = cars.filter(c => {
    if (c.madeIt) {
      app.stage.removeChild(c.graphics)
    }

    return !c.madeIt
  })
})
