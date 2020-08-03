import * as PIXI from 'pixi.js'
import RoadSegment from './roadSegment'

export default class IntersectionSegment extends RoadSegment {
  constructor(startX, startY, endX, endY, open) {
    super(startX, startY, endX, endY)

    this.open = open
    setInterval(() => {
      this.open = !this.open
    }, 2000)
  }

  render() {
    if (this.open) {
      this.graphics.lineStyle(4, 0x49a43e)
      this.graphics.zIndex = 1
    } else {
      this.graphics.lineStyle(4, 0xd43b3b)
      this.graphics.zIndex = -1
    }

    this.drawSegment()
  }

  isIntersection() {
    return true
  }

  redLight() {
    return !this.open
  }

  // optimization available by not repainting every tick
  tick() {
    this.graphics.clear()
    this.render()
  }
}
