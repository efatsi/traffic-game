import "./style.css"
import * as PIXI from 'pixi.js'
import bunnyUrl from './assets/bunny.png'

// import { getUsers } from "./api/users";
// getUsers().then(json => console.log(json))

const app = new PIXI.Application({
  width: 400, height: 300, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const container = new PIXI.Container();

app.stage.addChild(container);

// Create a new texture
const texture = PIXI.Texture.from(bunnyUrl);

// Create a 5x5 grid of bunnies
for (let i = 0; i < 25; i++) {
  const bunny = new PIXI.Sprite(texture);
  bunny.anchor.set(0.5);
  bunny.x = (i % 5) * 40;
  bunny.y = Math.floor(i / 5) * 40;

  bunny.scale.x = 0.35
  bunny.scale.y = 0.25

  bunny.interactive = true;
  bunny.buttonMode = true;
  bunny.on('pointertap', (event) => {
    console.log(event)
    bunny.scale.x = 0.55 - bunny.scale.x
    bunny.scale.y = 0.45 - bunny.scale.y
  });

  container.addChild(bunny);
}

// Move container to the center
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

// Center bunny sprite in local container coordinates
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

// Listen for animate update
app.ticker.add((delta) => {
  // rotate the container!
  // use delta to create frame-independent transform
  container.rotation -= 0.01 * delta;
});
