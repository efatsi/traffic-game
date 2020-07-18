import * as PIXI from 'pixi.js'

export default class Road {
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
      }, 2000)
    }

    this.graphics = new PIXI.Graphics()
    this.initializeGraphics()
  }

  initializeGraphics() {
    if (this.intersection) {
      this.graphics.lineStyle(2, 0x49a43e)
    } else {
      this.graphics.lineStyle(8, 0x348aba)
    }
    this.render()
  }

  render() {
    this.graphics.moveTo(this.startX, this.startY)
    this.graphics.lineTo(this.endX, this.endY)
  }

  redLight() {
    return this.intersection && !this.open
  }

  // intersections only
  // optimization available by not repainint every tick
  tick() {
    this.graphics.clear()

    if (this.open) {
      this.graphics.lineStyle(4, 0x49a43e)
      this.graphics.zIndex = 1
    } else {
      this.graphics.lineStyle(4, 0xd43b3b)
      this.graphics.zIndex = -1
    }

    this.render()
  }
}
