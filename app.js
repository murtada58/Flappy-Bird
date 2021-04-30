"use strict";

let canvas = document.getElementById('flappy_bird');
let canvas_context = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// constants
const GAME_WIDTH =  960; // should be equal to or less than canvas width in pixels
const GAME_HEIGHT =  600; // should be equal to or less than canvas height in pixels
const PIPE_WIDTH = 100; // width of the pipes in pixels
const PIPE_SPEED = 250; // the speed that pipes move from right to left at pixels per second
const MIN_PIPE_GAP = 100; // the minimum pipe gap in pixels
const MAX_PIPE_GAP = 150; // the maximum pipe gap in pixels
const MIN_INTERVAL = 1; // the minimum time between pipe spawns in seconds
const MAX_INTERVAL = 1.5; // the maximum time between pipe spawns in seconds
const BIRD_HEIGHT = 25; // the height of the bird
const BIRD_WIDTH = 30; // the width of the bird
const BIRD_X = 240; // the birds x position
const BIRD_JUMP = -500; // the y speed the bird is set to when jumping
const GRAVITY = 2000; // the gravity strength pulling the bird down

let paused = true; // controls wether the game is paused or not
let timer = 0; // keeps track of time in seconds
let interval = 0; // time between column spawns in seconds
let last_spwan_time = 0; // the time that the last column was spawned in seconds
let pipes = []; // contains all of the pipes
let bird = new Bird(BIRD_WIDTH, BIRD_HEIGHT, BIRD_X, (canvas.height / 2) - (BIRD_HEIGHT / 2), BIRD_JUMP, 0);
let points = 0;

// intial setup
function setup()
{
    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyUp);

    draw();
}

// physics update
function update(delta_time)
{
    bird.apply_gravity(GRAVITY, delta_time);
    let lost = bird.update_position(GAME_HEIGHT, delta_time); // update position returns wether touching bottom or not

    if (lost)
    {
        paused = true;
        console.log("Lost");
    }

    for (let i = 0; i < pipes.length; i++)
    {
        let passed = true; // used to check for transition out of pipe to add a point
        // checking if current pipe has not been passed yet (to the right of the bird)
        if (pipes[i].left_x + pipes[i].width > bird.left_x)
        {
            passed = false
        }

        // move pipe (checking delta_time to avoid errors)
        if (!isNaN(delta_time)) 
        {
            pipes[i].left_x -= delta_time * PIPE_SPEED;
        }

        // check if after update pipe has now been passed (to the left of the bird) if it was not passed before the update
        if (passed === false && pipes[i].left_x + pipes[i].width <  bird.left_x)
        {
            points++;
            console.log(points);
        }

        // check for pipe collisions
        if (pipes[i].left_x < bird.left_x + bird.width && pipes[i].left_x + pipes[i].width > bird.left_x) // check x
        {
            if (bird.top_y < pipes[i].top_y || bird.top_y + bird.height > pipes[i].top_y + pipes[i].gap_size) // check y
            {
                paused = true;
                console.log("Lost");
            }
        }

        // check if pipe is off screen if so remove it
        if (pipes[i].left_x <= -PIPE_WIDTH)
        {
            pipes.shift();
        }
    }

    // spawn new pipe after interval time
    if (timer >= last_spwan_time + interval)
    {
        last_spwan_time = timer;
        interval = random(MIN_INTERVAL, MAX_INTERVAL);
        let pipe_gap = randomInt(MIN_PIPE_GAP, MAX_PIPE_GAP);
        pipes.push(new Pipe(GAME_WIDTH, randomInt(canvas.height * 0.1, (canvas.height * 0.9) - pipe_gap), pipe_gap, PIPE_WIDTH));
    }
}

// draw update
let old_times_stamp = 0;
function draw(time_stamp)
{
    let delta_time = (time_stamp - old_times_stamp) / 1000; // time between frames in seconds
    old_times_stamp = time_stamp;

    if (!paused && !isNaN(delta_time))
    {
        timer += delta_time;
        update(delta_time);
    }

    // draw background
    colorRect(0, 0, canvas.width ,canvas.height, "#000000");

    // draw bird
    draw_bird(bird, "#FF0000");

    // draw pipes
    for (let i = 0; i < pipes.length; i++)
    {
        draw_pipe(pipes[i], GAME_HEIGHT, "#FFFFFF");
    }

    window.requestAnimationFrame(draw);
}

setup();

// reseting global variable to start conditions
function start()
{
    pipes = [];
    timer = 0; // in seconds
    interval = 0; // in seconds
    last_spwan_time = 0; // in seconds
    points = 0;
    bird.top_y = (canvas.height / 2) - (BIRD_HEIGHT / 2);
    bird.current_speed = 0;
}

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
                start();
                enter_key_down = true;
            }
            break;
        case 32:
            if (!space_key_down && !paused)
            {  
                bird.jump();
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