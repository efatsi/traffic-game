import './style.css'
import * as PIXI from 'pixi.js'
import Road from './models/road'
import Car from './models/car'

// Set up main canvas
const app = new PIXI.Application({
  width: 400,
  height: 400,
  backgroundColor: 0x12232f,
  resolution: window.devicePixelRatio || 1
})
document.body.appendChild(app.view)

// Set up intersection and car tracking variables
let intersections = []
let cars = []
const intersectionContainer = new PIXI.Container()
intersectionContainer.sortableChildren = true
app.stage.addChild(intersectionContainer)

// Build the scene
const road = new Road(25, 200, 170, 200)
app.stage.addChild(road.graphics)
const intersection = new Road(170, 200, 230, 200, true, true)
intersectionContainer.addChild(intersection.graphics)
intersections.push(intersection)
const road2 = new Road(230, 200, 375, 200)
app.stage.addChild(road2.graphics)

// Click to add cars
app.stage.interactive = true
app.renderer.plugins.interaction.on('pointerdown', onPointerDown)
function onPointerDown() {
  const car1 = new Car([road, intersection, road2])
  app.stage.addChild(car1.graphics)
  cars.push(car1)
}

// Make cars move
app.ticker.add(delta => {
  cars.forEach(c => {
    c.tick(delta, cars)
  })

  // Render closed intersections first so the red is on the bottom
  intersections.forEach(i => {
    i.tick()
  })

  // Remove cars that have made it to their destination
  cars = cars.filter(c => {
    if (c.madeIt) {
      app.stage.removeChild(c.graphics)
    }

    return !c.madeIt
  })
})

// setInterval(() => {
//   console.log([road.cars.length, intersection.cars.length, road2.cars.length])
// }, 250)
