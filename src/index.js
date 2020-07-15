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

// Add one road
const road = new Road(100, 200, 300, 200)
app.stage.addChild(road.graphics)

// Click to add cars
app.stage.interactive = true
app.renderer.plugins.interaction.on('pointerdown', onPointerDown)
let cars = []
function onPointerDown() {
  const car = new Car(100, 200, 300, 200)
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
    if (c.atDestination()) {
      app.stage.removeChild(c.graphics)
    }

    return !c.atDestination()
  })
})
