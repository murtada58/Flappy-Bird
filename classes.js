class Pipe
{
    constructor (left_x, top_y, gap_size, width)
    {
        this.left_x = left_x;
        this.top_y = top_y;
        this.gap_size = gap_size;
        this.width = width;
    }
}

class Bird
{
    constructor (width, height, left_x, top_y, jump_speed, current_speed)
    {
        this.width = width;
        this.height = height;
        this.left_x = left_x;
        this.top_y = top_y;
        this.jump_speed = jump_speed;
        this.current_speed = current_speed;  
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
            return true; // returns true if touched the bottom (lost the game)
        }

        return false; // returns false if not touching the bottom
    }
}