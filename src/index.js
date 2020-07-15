import './style.css'
import * as PIXI from 'pixi.js'
import Road from './models/road'

// import { getUsers } from "./api/users";
// getUsers().then(json => console.log(json))

const app = new PIXI.Application({
  width: 400,
  height: 350,
  backgroundColor: 0x12232f,
  resolution: window.devicePixelRatio || 1
})
document.body.appendChild(app.view)

const road = new Road(100, 200, 300, 200)
app.stage.addChild(road.graphics)
