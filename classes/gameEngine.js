"use strict";

class GameEngine
{
  constructor(setup)
  {
    this.setup = setup;
    this.setup();

    this.gameObjects = [];
    this.oldTimeStamp = 0;
    this.paused = true;
    this.lost = false;
    window.requestAnimationFrame(this.loop);
  }

  attachSingle(gameObject){
    this.gameObjects.push(gameObject);
  }

  attachMultiple(gameObjects){
    gameObjects.foreach(gameObject => this.attachSingle(gameObject));
  }

  update(deltaTime)
  { 
    this.gameObjects.foreach(gameObject => gameObject.update(deltaTime));
  }

  draw(deltaTime)
  {
    this.gameObjects.foreach(gameObject => gameObject.draw(canvasContext, deltaTime));
  }

  loop()
  {
    const deltaTime = ((timeStamp - this.oldTimeStamp) / 1000); // time between frames in seconds
    this.fps = 1 / deltaTime;
    this.oldTimeStamp = timeStamp;
    if (!this.lost && !this.paused)
    {
        real_time += deltaTime;
    }
    this.update(deltaTime);
    this.draw(deltaTime);
    window.requestAnimationFrame(this.loop);
  }
}
