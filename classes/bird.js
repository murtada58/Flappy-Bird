"use strict";

class Bird extends AnimatedSprite
{
    constructor (width, height, left_x, top_y, jump_speed, current_speed, sprites, gameHeight)
    {
        super(width, height, left_x, top_y, sprites);

        this.jump_speed = jump_speed;
        this.current_speed = current_speed;
        this.time = 0;
        this.lost = false;
        this.gameHeight = gameHeight;
    }

    jump()
    {
        this.current_speed = this.jump_speed;
    }

    applyGravity(deltaTime)
    {
        this.current_speed += GRAVITY * deltaTime;
    }

    // updates position and returns wether touching the bottom or not
    updatePosition(deltaTime)
    {
        this.top_y += this.current_speed * deltaTime;
        this.top_y = Math.max(this.top_y, 0);
        
        if (this.top_y + this.height > this.gameHeight)
        {
            this.top_y = Math.min(this.top_y, this.gameHeight - this.height);
            this.lost = true;
            return true; // returns true if touched the bottom (lost the game)
        }

        return false; // returns false if not touching the bottom
    }

    update(deltaTime) {
        this.applyGravity(deltaTime);
        this.updatePosition(deltaTime);
        super.update(deltaTime);
    }

    draw(canvasContext)
    {
        canvasContext.save();
        canvasContext.translate(this.left_x + (this.width/2), this.top_y + (this.height/2));
        let degrees = Math.max((this.current_speed / 20) - 30, -15);
        canvasContext.rotate( degrees*Math.PI/180);
        canvasContext.translate(-(this.left_x + (this.width/2)), -(this.top_y + (this.height/2)));

        super.draw();

        canvasContext.restore();
    }
}