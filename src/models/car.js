import * as PIXI from 'pixi.js'

class Obstacle {
  constructor(object) {
    this.object = object

    console.log(object.constructor.name)
    if (object.constructor.name == 'Car') {
      this.leftX = object.currentX - object.radius
      this.velocity = object.velocity
      this.y = object.currentY
    } else if (object.constructor.name == 'IntersectionSegment') {
      this.leftX = object.startX
      this.velocity = 0
      this.y = object.startY
    }
  }
}

export default class Car {
  graphics = new PIXI.Graphics()
  radius = 8
  stopBuffer = 10

  maxAccel = 0.035
  maxVelocity = 2

  constructor(roads) {
    this.roads = roads
    this.setCurrentRoad(roads[0])
    this.madeIt = false

    this.currentX = roads[0].startX
    this.currentY = roads[0].startY
    // TODO: if car close, come in at same speed as car
    this.velocity = this.maxVelocity

    this.render()
  }

  render() {
    this.graphics.lineStyle(0.75, 0xffffff)
    this.graphics.beginFill(0xde3249, 1)
    this.graphics.drawCircle(this.currentX, this.currentY, this.radius)
    this.graphics.endFill()
  }

  determineObstacle() {
    const currentRoadIndex = this.currentRoad.cars.indexOf(this)
    let obstacle = this.currentRoad.cars[currentRoadIndex + 1]

    if (!obstacle) {
      const futureRoads = this.roads.slice(
        this.roads.indexOf(this.currentRoad) + 1,
        this.roads.length
      )

      futureRoads.forEach(r => {
        if (obstacle) return

        if (r.isIntersection() && !r.open) {
          obstacle = r
        } else {
          obstacle = r.cars[0]
        }
      })
    }

    if (obstacle) {
      this.nextObstacle = new Obstacle(obstacle)
    } else {
      this.nextObstacle = null
    }
  }

  adjustVelocity() {
    // if close to nextObstacle and it's stopped and you're stopped
    //  - stop
    // if shouldSlowDown()
    //  - slowDown
    // else
    //  - speedUp

    if (this.basicallyStopped() && this.shouldStop()) {
      this.velocity = 0
    } else if (this.shouldSlowDown()) {
      this.velocity -= this.maxAccel

      if (this.velocity < this.maxAccel) {
        this.velocity = 0
      }
    } else {
      this.velocity += this.maxAccel

      if (this.velocity > this.maxVelocity) {
        this.velocity = this.maxVelocity
      }
    }
  }

  shouldStop() {
    if (this.nextObstacle) {
      let distanceToObstacle = this.nextObstacle.leftX - this.currentX
      return distanceToObstacle < this.stopBuffer
    }
  }

  shouldSlowDown() {
    if (this.nextObstacle) {
      let distanceToObstacle = this.nextObstacle.leftX - this.currentX
      let distanceToZero =
        (Math.pow(this.velocity, 2) - Math.pow(this.nextObstacle.velocity, 2)) /
        (2 * this.maxAccel)

      if (
        this.velocity > 0 &&
        distanceToObstacle - this.stopBuffer <= distanceToZero
      ) {
        return true
      }
    }

    return false
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

  verifyDirection() {
    if (this.atRoadEnd()) {
      if (
        this.nextRoad() &&
        this.nextRoad().isIntersection() &&
        this.nextRoad().redLight() &&
        this.basicallyStopped()
      ) {
        // do nothing, wait at end of current road
      } else {
        this.moveToNextRoad()
      }
    }
  }

  atRoadEnd() {
    const xGap = this.currentX - this.currentRoad.endX
    const yGap = this.currentY - this.currentRoad.endY

    return Math.abs(xGap) + Math.abs(yGap) < this.velocity
  }

  moveToNextRoad() {
    this.currentRoad.cars = this.currentRoad.cars.filter(c => {
      return c != this
    })

    if (this.onLastRoad()) {
      this.madeIt = true
    } else {
      this.setCurrentRoad(this.nextRoad())
    }
  }

  setCurrentRoad(road) {
    this.currentRoad = road
    road.cars.unshift(this)
  }

  onLastRoad() {
    return this.roads.indexOf(this.currentRoad) == this.roads.length - 1
  }

  nextRoad() {
    const currentIndex = this.roads.indexOf(this.currentRoad)
    return this.roads[currentIndex + 1]
  }

  basicallyStopped() {
    return this.velocity < this.maxAccel * 2
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
