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