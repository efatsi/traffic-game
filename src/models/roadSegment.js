import * as PIXI from 'pixi.js'

export default class RoadSegment {
  cars = []
  graphics = new PIXI.Graphics()

  constructor(startX, startY, endX, endY) {
    this.startX = startX
    this.startY = startY
    this.endX = endX
    this.endY = endY

    this.render()
  }

  isIntersection() {
    return false
  }

  render() {
    this.graphics.lineStyle(8, 0x348aba)
    this.drawSegment()
  }

  drawSegment() {
    this.graphics.moveTo(this.startX, this.startY)
    this.graphics.lineTo(this.endX, this.endY)
  }
}
