"use strict";

class Pipe extends Sprite
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

    draw(canvasContext, game_height, draw_hitbox = false, hitbox_color = "#0000FF")
    {
        // top pipe
        canvasContext.drawImage(this.body, this.left_x, 0, this.width, this.top_y);
        canvasContext.drawImage(this.head, this.left_x - 10, this.top_y - 40, this.width+20, 40);

        // bottom pipe
        canvasContext.drawImage(this.body, this.left_x, this.top_y + this.gap_size + 5, this.width, game_height - (this.top_y + this.gap_size)-8);
        canvasContext.drawImage(this.head, this.left_x - 10, this.top_y + this.gap_size, this.width+20, 40);

        if (draw_hitbox)
        {
            colorRect(this.left_x, 0, this.width, this.top_y, hitbox_color, 0.5); // top pipe
            colorRect(this.left_x, this.top_y + this.gap_size, this.width , game_height - (this.top_y + this.gap_size), hitbox_color, 0.5); // bottom pipe
        }
    }
}