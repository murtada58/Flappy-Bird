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


function draw_pipe(pipe, game_height, color)
{
    colorRect(pipe.left_x, 0, pipe.width, pipe.top_y, color); // top pipe
    colorRect(pipe.left_x, pipe.top_y + pipe.gap_size, pipe.width , game_height - (pipe.top_y + pipe.gap_size), color); // bottom pipe
}

function draw_bird(bird, color)
{
    colorRect(bird.left_x, bird.top_y, bird.width, bird.height, color);
}