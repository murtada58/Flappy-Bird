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
}