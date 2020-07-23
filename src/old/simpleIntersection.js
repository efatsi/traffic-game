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
