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
const road = new Road(50, 200, 170, 200)
app.stage.addChild(road.graphics)
const road2 = new Road(230, 200, 350, 200)
app.stage.addChild(road2.graphics)

const intersection = new Road(170, 200, 230, 200, true)
app.stage.addChild(intersection.graphics)

let intersections = [intersection]

// Click to add cars
app.stage.interactive = true
app.renderer.plugins.interaction.on('pointerdown', onPointerDown)
let cars = []
function onPointerDown() {
  const car = new Car([road, intersection, road2])
  app.stage.addChild(car.graphics)
  cars.push(car)
}

// Make cars move
app.ticker.add(delta => {
  cars.forEach(c => {
    c.tick(delta)
  })
  intersections.forEach(i => {
    i.tick(delta)
  })

  // Remove cars that have made it to their destination
  cars = cars.filter(c => {
    if (c.madeIt) {
      app.stage.removeChild(c.graphics)
    }

    return !c.madeIt
  })
})
