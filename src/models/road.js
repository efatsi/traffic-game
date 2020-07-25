import * as PIXI from 'pixi.js'

export default class Road {
  cars = []
  graphics = new PIXI.Graphics()

  constructor(startX, startY, endX, endY, intersection, open) {
    this.startX = startX
    this.startY = startY
    this.endX = endX
    this.endY = endY
    this.intersection = intersection
    if (this.intersection) {
      this.open = open

      setInterval(() => {
        this.open = !this.open
      }, 3000)
    }

    this.render()
  }

  render() {
    if (this.intersection) {
      if (this.open) {
        this.graphics.lineStyle(4, 0x49a43e)
        this.graphics.zIndex = 1
      } else {
        this.graphics.lineStyle(4, 0xd43b3b)
        this.graphics.zIndex = -1
      }
    } else {
      this.graphics.lineStyle(8, 0x348aba)
    }

    this.graphics.moveTo(this.startX, this.startY)
    this.graphics.lineTo(this.endX, this.endY)
  }

  redLight() {
    return this.intersection && !this.open
  }

  // intersections only
  // optimization available by not repainting every tick
  tick() {
    this.graphics.clear()
    this.render()
  }
}
