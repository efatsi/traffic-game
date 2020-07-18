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

const intersectionContainer = new PIXI.Container()
intersectionContainer.sortableChildren = true
app.stage.addChild(intersectionContainer)

const road = new Road(50, 200, 170, 200)
app.stage.addChild(road.graphics)
const intersection = new Road(170, 200, 230, 200, true, true)
intersectionContainer.addChild(intersection.graphics)
const road2 = new Road(230, 200, 350, 200)
app.stage.addChild(road2.graphics)

const road3 = new Road(200, 50, 200, 170)
app.stage.addChild(road3.graphics)
const intersection2 = new Road(200, 170, 200, 230, true, false)
intersectionContainer.addChild(intersection2.graphics)
const road4 = new Road(200, 230, 200, 350)
app.stage.addChild(road4.graphics)

let intersections = [intersection, intersection2]

// Click to add cars
app.stage.interactive = true
app.renderer.plugins.interaction.on('pointerdown', onPointerDown)
let cars = []
function onPointerDown() {
  const car1 = new Car([road, intersection, road2])
  const car2 = new Car([road3, intersection2, road4])
  app.stage.addChild(car1.graphics)
  app.stage.addChild(car2.graphics)
  cars.push(car1, car2)
}

// Make cars move
app.ticker.add(delta => {
  cars.forEach(c => {
    c.tick(delta)
  })

  // Render closed intersections first so the red is on the bottom
  debugger
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
