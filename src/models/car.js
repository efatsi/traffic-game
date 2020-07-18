import * as PIXI from 'pixi.js'

export default class Car {
  constructor(roads) {
    this.allCars = []

    this.roads = roads
    this.currentRoad = roads[0]
    this.madeIt = false

    this.currentX = roads[0].startX
    this.currentY = roads[0].startY
    this.velocity = 2

    this.graphics = new PIXI.Graphics()
    this.render()
  }

  render() {
    this.graphics.lineStyle(0.75, 0xffffff)
    this.graphics.beginFill(0xde3249, 1)
    this.graphics.drawCircle(this.currentX, this.currentY, 8)
    this.graphics.endFill()
  }

  verifyDirection() {
    if (this.atRoadEnd()) {
      if (this.onLastRoad()) {
        this.madeIt = true
      } else {
        if (this.nextRoad() && this.nextRoad().redLight()) {
          // do nothing, wait at end of current road
        } else {
          this.moveToNextRoad()
        }
      }
    }
  }

  getMovement(delta) {
    const xGap = this.currentX - this.currentRoad.endX
    const yGap = this.currentY - this.currentRoad.endY
    const angle = Math.atan(yGap / xGap)

    const xDistance = Math.cos(angle) * this.velocity
    const yDistance = Math.sin(angle) * this.velocity

    const xDirection = this.currentX >= this.currentRoad.endX ? -1 : 1
    const yDirection = this.currentY >= this.currentRoad.endY ? -1 : 1

    const x = Math.abs(xDistance) * xDirection * delta
    const y = Math.abs(yDistance) * yDirection * delta

    return this.shouldStop(x, y) ? [0, 0] : [x, y]
  }

  // takes intended direction, checks if should stop
  shouldStop(x, y) {
    let stop = false

    // waiting for the light to turn green
    if (this.atRoadEnd() && this.nextRoad().redLight()) {
      stop = true
    }

    // check if there's a car where you want to go
    this.allCars.forEach(otherCar => {
      if (otherCar != this && this.distanceTo(x, y, otherCar) < 8 * 2) {
        stop = true
      }
    })

    return stop
  }

  onLastRoad() {
    return this.roads.indexOf(this.currentRoad) == this.roads.length - 1
  }

  moveToNextRoad() {
    this.currentRoad = this.nextRoad()
  }

  atRoadEnd() {
    const xGap = this.currentX - this.currentRoad.endX
    const yGap = this.currentY - this.currentRoad.endY

    return Math.abs(xGap) + Math.abs(yGap) < this.velocity
  }

  nextRoad() {
    const currentIndex = this.roads.indexOf(this.currentRoad)
    return this.roads[currentIndex + 1]
  }

  distanceTo(x, y, otherCar) {
    const sum =
      Math.pow(this.currentX + x - otherCar.currentX, 2) +
      Math.pow(this.currentY + y - otherCar.currentY, 2)

    return Math.sqrt(sum)
  }

  tick(delta, cars) {
    // Update reference of all cars
    this.allCars = cars

    this.graphics.clear()

    const [x, y] = this.getMovement(delta)
    this.currentX += x
    this.currentY += y
    this.render()

    this.verifyDirection()
  }
}
