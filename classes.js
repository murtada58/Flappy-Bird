"use strict";

class Pipe
{
    constructor (left_x, top_y, gap_size, width, head, body)
    {
        this.left_x = left_x;
        this.top_y = top_y;
        this.gap_size = gap_size;
        this.width = width;
        this.head = head;
        this.body = body;
    }

    draw(canvas_context, game_height, draw_hitbox = false, hitbox_color = "#0000FF")
    {
        // top pipe
        canvas_context.drawImage(this.body, this.left_x, 0, this.width, this.top_y);
        canvas_context.drawImage(this.head, this.left_x - 10, this.top_y - 40, this.width+20, 40);

        // bottom pipe
        canvas_context.drawImage(this.body, this.left_x, this.top_y + this.gap_size + 5, this.width, game_height - (this.top_y + this.gap_size)-8);
        canvas_context.drawImage(this.head, this.left_x - 10, this.top_y + this.gap_size, this.width+20, 40);

        if (draw_hitbox)
        {
            color_rect(this.left_x, 0, this.width, this.top_y, hitbox_color, 0.5); // top pipe
            color_rect(this.left_x, this.top_y + this.gap_size, this.width , game_height - (this.top_y + this.gap_size), hitbox_color, 0.5); // bottom pipe
        }
    }
}

class Bird
{
    constructor (width, height, left_x, top_y, jump_speed, current_speed, sprites)
    {
        this.width = width;
        this.height = height;
        this.left_x = left_x;
        this.top_y = top_y;
        this.jump_speed = jump_speed;
        this.current_speed = current_speed;
        this.sprites = sprites;
        this.sprite = sprites[0];
        this.current_sprite = 0;
        this.sprite_interval = 0.1; // in seconds
        this.time = 0;
        this.lost = false;
    }

    animate(time)
    {
        if (this.time + this.sprite_interval <= time && !paused)
        {
            this.current_sprite += 1;
            this.current_sprite %= this.sprites.length;
            this.sprite = this.sprites[this.current_sprite];
            this.time = time;
        }
    }

    jump()
    {
        this.current_speed = this.jump_speed;
    }

    apply_gravity(gravity, delta_time)
    {
        this.current_speed += GRAVITY * delta_time;
    }

    // updates position and returns wether touching the bottom or not
    update_position(game_height, delta_time)
    {
        this.top_y += this.current_speed * delta_time;
        this.top_y = Math.max(this.top_y, 0);
        
        if (this.top_y + this.height > game_height)
        {
            this.top_y = Math.min(this.top_y, game_height - this.height);
            this.lost = true;
            return true; // returns true if touched the bottom (lost the game)
        }

        return false; // returns false if not touching the bottom
    }

    draw(canvas_context, draw_hitbox = false, hitbox_color = "#FF0000")
    {
        canvas_context.save();
        canvas_context.translate(this.left_x + (this.width/2), this.top_y + (this.height/2));
        let degrees = Math.max((this.current_speed / 20) - 30, -15);
        canvas_context.rotate( degrees*Math.PI/180);
        canvas_context.translate(-(this.left_x + (this.width/2)), -(this.top_y + (this.height/2)));
        canvas_context.drawImage(this.sprite, this.left_x, this.top_y, this.width, this.height);
        canvas_context.restore();
        
        if (draw_hitbox)
        {
            color_rect(bird.left_x, bird.top_y, bird.width, bird.height, hitbox_color, 0.2);
        }
    }
}

class Sound
{
    constructor (src)
    {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play()
    {
        this.sound.play();
    }

    stop()
    {
        this.sound.pause();
    }
    
    loop()
    {
        this.sound.loop = true;
    }

    mute()
    {
        this.sound.muted = true;
    }

    unmute()
    {
        this.sound.muted = false;
    }

}