
class Sprite {
    constructor(width, height, left_x, top_y, image) {
        this.width = width;
        this.height = height;
        this.left_x = left_x;
        this.top_y = top_y;
        this.image = image;
    }
    
    draw(canvasContext, deltaTime) {
        canvasContext.drawImage(this.image, this.left_x, this.top_y, this.width, this.height);
    }
}

class AnimatedSprite extends Sprite {
  constructor(width, height, left_x, top_y, frames) {
    super(width, height, left_x, top_y, frames[0]);

    this.currentFrame = 0;
    this.spriteInterval = 0.1; // in seconds
    this.timeSinceLastAnimated = 0;
  }

  draw(canvasContext, deltaTime)
  {
    this.timeSinceLastAnimated += deltaTime
    if (this.timeSinceLastAnimated <= this.spriteInterval)
    {
      this.currentFrame += 1;
      this.currentFrame %= this.frames.length;
      this.image = this.frames[this.currentFrame];
    }

    this.image = frames[this.currentFrame];
    super.draw(canvasContext, deltaTime);
  }
}
