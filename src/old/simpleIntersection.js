const road = new Road(25, 200, 170, 200)
app.stage.addChild(road.graphics)
const intersection = new Road(170, 200, 230, 200, true, true)
intersectionContainer.addChild(intersection.graphics)
intersections.push(intersection)
const road2 = new Road(230, 200, 375, 200)
app.stage.addChild(road2.graphics)

const road3 = new Road(200, 25, 200, 170)
app.stage.addChild(road3.graphics)
const intersection2 = new Road(200, 170, 200, 230, true, false)
intersectionContainer.addChild(intersection2.graphics)
intersections.push(intersection2)
const road4 = new Road(200, 230, 200, 375)
app.stage.addChild(road4.graphics)


// Click to add cars
app.stage.interactive = true
app.renderer.plugins.interaction.on('pointerdown', onPointerDown)
function onPointerDown() {
  const car1 = new Car([road, intersection, road2])
  const car2 = new Car([road3, intersection2, road4])
  app.stage.addChild(car1.graphics)
  app.stage.addChild(car2.graphics)
  cars.push(car1, car2)
}
