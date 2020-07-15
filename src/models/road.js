import * as PIXI from 'pixi.js'

export default class Road {
  constructor(startX, startY, endX, endY) {
    this.startX = startX
    this.startY = startY
    this.endX = endX
    this.endY = endY

    this.graphics = new PIXI.Graphics()
    this.render()
  }

  render() {
    this.graphics.lineStyle(20, 0x348aba)
    this.graphics.moveTo(this.startX, this.startY)
    this.graphics.lineTo(this.endX, this.endY)
  }
}
