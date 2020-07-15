import * as PIXI from 'pixi.js'

export default class Car {
  constructor(startX, startY, endX, endY) {
    this.currentX = startX
    this.currentY = startY
    this.endX = endX
    this.endY = endY

    this.graphics = new PIXI.Graphics()
    this.render()
  }

  render() {
    this.graphics.lineStyle(0.75, 0xffffff)
    this.graphics.beginFill(0xde3249, 1)
    this.graphics.drawCircle(this.currentX, this.currentY, 8)
    this.graphics.endFill()
  }

  tick(delta) {
    this.graphics.clear()
    this.currentX += delta
    this.render()
  }

  atDestination() {
    return this.currentX > this.endX
  }
}
