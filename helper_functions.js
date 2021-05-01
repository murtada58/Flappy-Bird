"use strict";

function color_rect(leftX, topY, width, height, color)
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
    //color_rect(pipe.left_x, 0, pipe.width, pipe.top_y, color); // top pipe
    canvas_context.drawImage(body, pipe.left_x, 0, pipe.width, pipe.top_y);
    canvas_context.drawImage(head, pipe.left_x - 10, pipe.top_y - 40, pipe.width+20, 40);
    

    //color_rect(pipe.left_x, pipe.top_y + pipe.gap_size, pipe.width , game_height - (pipe.top_y + pipe.gap_size), color); // bottom pipe
    canvas_context.drawImage(body, pipe.left_x, pipe.top_y + pipe.gap_size + 5, pipe.width, game_height - (pipe.top_y + pipe.gap_size)-8);
    canvas_context.drawImage(head, pipe.left_x - 10, pipe.top_y + pipe.gap_size, pipe.width+20, 40);
    //color_rect(pipe.left_x, pipe.top_y + pipe.gap_size, pipe.width , game_height - (pipe.top_y + pipe.gap_size), color); // bottom pipe
}

function draw_bird(bird, color)
{
    //color_rect(bird.left_x, bird.top_y, bird.width, bird.height, color);
    canvas_context.save();
    //canvas_context.setTransform(1, 0, 0, 1, bird.left_x + (bird.width/2), bird.top_y + (bird.height/2)); // sets scale and origin
    canvas_context.translate(bird.left_x + (bird.width/2), bird.top_y + (bird.height/2));
    let degrees = Math.max((bird.current_speed / 20) - 30, -15);
    canvas_context.rotate( degrees*Math.PI/180);
    canvas_context.translate(-(bird.left_x + (bird.width/2)), -(bird.top_y + (bird.height/2)));
    canvas_context.drawImage(bird.sprite, bird.left_x, bird.top_y, bird.width, bird.height);
    canvas_context.restore();
    //color_rect(bird.left_x, bird.top_y, bird.width, bird.height, color);
}

function draw_background(background, background_pos, game_width, game_height)
{
    canvas_context.drawImage(background, background_pos, 0, game_width, game_height);
    canvas_context.drawImage(background, background_pos + game_width, 0, game_width, game_height);
}

function draw_ground(ground, position, game_height, game_width, canvas_height)
{
    canvas_context.drawImage(ground, position, game_height - 2, game_width, Math.max(canvas_height - game_height, 200));
    canvas_context.drawImage(ground, position+game_width, game_height - 2, game_width, Math.max(canvas_height - game_height, 200));
}

function draw_stats(game_width, canvas_width, canvas_height, timer, points, high_score)
{
    color_rect(game_width, 0, canvas_width - game_width, canvas_height, "#ffc229")

    canvas_context.fillStyle = "#000000";
    canvas_context.font = '25px roboto condensed';
    canvas_context.fillText("Timer: " + (Math.round(timer * 100) / 100).toFixed(2) + "s", game_width + 12.5, 25);
    canvas_context.fillText("Points: " + points, game_width + 12.5, 60);
    canvas_context.fillText("High Score: " + high_score, game_width + 12.5, 95);
}