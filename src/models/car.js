import * as PIXI from 'pixi.js'

export default class Car {
  constructor(roads) {
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
    // things that make you stop
    if (this.atRoadEnd() && this.nextRoad().redLight()) {
      return [0, 0]
    }

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

  tick(delta) {
    this.graphics.clear()

    const [x, y] = this.getMovement(delta)
    this.currentX += x
    this.currentY += y
    this.render()

    this.verifyDirection()
  }
}
