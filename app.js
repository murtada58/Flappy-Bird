canvas = document.getElementById('flappy_bird');
canvas_context = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// constants
GAME_WIDTH =  960; // should be equal to or less than canvas width
GAME_HEIGHT =  540; // should be equal to or less than canvas height


// intial setup
function setup()
{
    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyUp);
    
    draw();
}

// physics update
function update()
{

}

// draw update
let old_times_stamp = 0;
function draw(time_stamp)
{
    delta_time = (time_stamp - old_times_stamp) / 1000;
    old_times_stamp = time_stamp;
    if (!isNaN(delta_time))
    {
        timer += delta_time;
    }

    if (!paused)
    {
        update();
    }

    window.requestAnimationFrame(draw);
}

setup();

// keyboard input
let up_key_down = false;
let down_key_down = false;
let right_key_down = false;
let left_key_down = false;
let space_key_down = false;
let enter_key_down = false;
let zero_key_down = false;
let one_key_down = false;

function keyUp(evt)
{
    switch(evt.keyCode)
    {
        case 13:
            enter_key_down = false;
            break;
        case 32:
            space_key_down = false;
            break;
        case 37:
            left_key_down = false;
            break;
        case 38:
            up_key_down = false;
            break;
        case 39:
            right_key_down = false;
            break;
        case 40:
            down_key_down = false;
            break;
        case 48:
            zero_key_down = false;
            break;
        case 49:
            one_key_down = false;
            break;
    }
    
}

function keyPressed(evt)
{   

    switch(evt.keyCode)
    {
        case 13:
            if (!enter_key_down)
            {  
                paused = false;
                enter_key_down = true;
            }
            break;
        case 32:
            if (!space_key_down && !paused)
            {  
                space_key_down = true;
            }
            break;
        case 37:
            if (!left_key_down && !paused)
            {  
                left_key_down = true;
            }
            break;
        case 38:
            if (!up_key_down && !paused)
            {
                up_key_down = true;
            }
            break;
        case 39:
            if (!right_key_down && !paused)
            {             
                right_key_down = true;
            }
            break;
        case 40:
            if (!down_key_down && !paused)
            {
                down_key_down = true;
            }
            break;
        case 48:
            if (!zero_key_down && !paused)
            {
                zero_key_down = true;
            }
            break;
        case 49:
            if (!one_key_down && !paused)
            {
                one_key_down = true;
            }
            break;
    }
}