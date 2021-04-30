"use strict";

function colorRect(leftX, topY, width, height, color)
{
    canvas_context.fillStyle = color;
    canvas_context.fillRect(leftX, topY, width, height);
}


function randomInt(min, max)
{
    return Math.floor(min + (Math.random() * (max - min)));
}


function random(min, max)
{
    return min + (Math.random() * (max - min));
}


function draw_pipe(pipe, game_height, color, head, body)
{
    //colorRect(pipe.left_x, 0, pipe.width, pipe.top_y, color); // top pipe
    canvas_context.drawImage(body, pipe.left_x, 0, pipe.width, pipe.top_y);
    canvas_context.drawImage(head, pipe.left_x - 10, pipe.top_y - 40, pipe.width+20, 40);
    

    //colorRect(pipe.left_x, pipe.top_y + pipe.gap_size, pipe.width , game_height - (pipe.top_y + pipe.gap_size), color); // bottom pipe
    canvas_context.drawImage(body, pipe.left_x, pipe.top_y + pipe.gap_size + 5, pipe.width, game_height - (pipe.top_y + pipe.gap_size));
    canvas_context.drawImage(head, pipe.left_x - 10, pipe.top_y + pipe.gap_size, pipe.width+20, 40);
    //colorRect(pipe.left_x, pipe.top_y + pipe.gap_size, pipe.width , game_height - (pipe.top_y + pipe.gap_size), color); // bottom pipe
}

function draw_bird(bird, color)
{
    //colorRect(bird.left_x, bird.top_y, bird.width, bird.height, color);
    canvas_context.drawImage(bird.sprite, bird.left_x, bird.top_y, bird.width, bird.height);
    //colorRect(bird.left_x, bird.top_y, bird.width, bird.height, color);
}

function draw_background(background, game_width, game_height)
{
    canvas_context.drawImage(background, 0, 0, game_width, game_height);
}