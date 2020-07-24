import * as PIXI from 'pixi.js'

export default class Car {
  graphics = new PIXI.Graphics()

  maxAccel = 0.035
  maxVelocity = 2

  constructor(roads) {
    this.roads = roads
    this.currentRoad = roads[0]
    this.madeIt = false

    this.currentX = roads[0].startX
    this.currentY = roads[0].startY
    this.initialVelocity = this.velocity = this.maxVelocity
    this.nextObstacle = roads[1]

    this.render()
  }

  render() {
    this.graphics.lineStyle(0.75, 0xffffff)
    this.graphics.beginFill(0xde3249, 1)
    this.graphics.drawCircle(this.currentX, this.currentY, 8)
    this.graphics.endFill()
    debugger
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

  determineObstacle() {
    // todo, only look forward
    // todo, count in cars
    const intersections = this.roads.filter(r => {
      return r.intersection && !r.open
    })

    this.nextObstacle = intersections[0]
  }

  adjustVelocity() {
    if (this.nextObstacle) {
      let distanceToObstacle = this.nextObstacle.startX - 10 - this.currentX
      let distanceToZero = Math.pow(this.velocity, 2) / (2 * this.maxAccel)

      if (this.velocity > 0 && distanceToObstacle <= distanceToZero) {
        this.velocity -= this.maxAccel

        if (this.velocity < this.maxAccel) {
          console.log('Stopped at:', this.currentX)
          this.velocity = 0
        }
      }
    } else {
      this.velocity += this.maxAccel

      if (this.velocity > this.maxVelocity) {
        this.velocity = this.maxVelocity
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

    return [x, y]
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

  tick(delta) {
    this.graphics.clear()

    this.determineObstacle()
    this.adjustVelocity()
    const [x, y] = this.getMovement(delta)
    this.currentX += x
    this.currentY += y
    this.render()

    this.verifyDirection()
  }
}
