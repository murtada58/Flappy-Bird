"use strict";

function colorRect(leftX, topY, width, height, color, alpha=1)
{
    canvasContext.globalAlpha = alpha;
    canvasContext.fillStyle = color;
    canvasContext.fillRect(leftX, topY, width, height);
    canvasContext.globalAlpha = 1;
}


function randomInt(min, max)
{
    return Math.floor(min + (Math.random() * (max - min)));
}


function random(min, max)
{
    return min + (Math.random() * (max - min));
}

function draw_background(background, background_pos, game_width, game_height)
{
    canvasContext.drawImage(background, background_pos, 0, game_width, game_height);
    canvasContext.drawImage(background, background_pos + game_width, 0, game_width, game_height);
}

function draw_ground(top_ground, bottom_ground, position, game_height, game_width, canvas_height)
{
    canvasContext.drawImage(bottom_ground, position, game_height - 2, game_width, canvas_height - game_height);
    canvasContext.drawImage(bottom_ground, position+game_width, game_height - 2, game_width, canvas_height - game_height);

    canvasContext.drawImage(top_ground, position, game_height - 2, game_width, 50);
    canvasContext.drawImage(top_ground, position+game_width, game_height - 2, game_width, 50);
}

function draw_stats(game_width, game_height, canvas_width, canvas_height, fps, real_time, game_time, points, high_score)
{
    if (canvas_width >= 700)
    {
        colorRect(game_width, 0, canvas_width - game_width, canvas_height, "#ffc229")

        canvasContext.fillStyle = "#000000";
        canvasContext.font = '25px roboto condensed';
        canvasContext.fillText("FPS: " + Math.round(fps), game_width + 12.5, 25 + (35*0));
        canvasContext.fillText("Real Time: " + (Math.round(real_time * 100) / 100).toFixed(2) + "s", game_width + 12.5, 25 + (35*1));
        canvasContext.fillText("Game Time: " + (Math.round(game_time * 100) / 100).toFixed(2) + "s", game_width + 12.5, 25 + (35*2));
        canvasContext.fillText("Points: " + points, game_width + 12.5, 25 + (35*3));
        canvasContext.fillText("High Score: " + high_score, game_width + 12.5, 25 + (35*4));
    }
    else
    {
        canvasContext.fillStyle = "#000000";
        canvasContext.font = '25px roboto condensed';
        canvasContext.fillText("Game Time: " + (Math.round(game_time * 100) / 100).toFixed(2) + "s", 12.5, game_height + 65);
        canvasContext.fillText("Points: " + points, 12.5, game_height + 100);
        canvasContext.fillText("High Score: " + high_score, 12.5, game_height + 135);
    }
}