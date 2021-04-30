"use strict";

let canvas = document.getElementById('flappy_bird');
let canvas_context = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// constants
const GAME_WIDTH =  960; // should be equal to or less than canvas width in pixels
const GAME_HEIGHT =  500; // should be equal to or less than canvas height in pixels
const PIPE_WIDTH = 100; // width of the pipes in pixels
const PIPE_SPEED = 250; // the speed that pipes move from right to left at pixels per second
const BACKGROUND_SPEED = PIPE_WIDTH * 0.3; // the background scroll speed in pixels
const MIN_PIPE_GAP = 125; // the minimum pipe gap in pixels
const MAX_PIPE_GAP = 150; // the maximum pipe gap in pixels
const MIN_INTERVAL = 1.25; // the minimum time between pipe spawns in seconds
const MAX_INTERVAL = 2; // the maximum time between pipe spawns in seconds
const BIRD_HEIGHT = 50; // the height of the bird
const BIRD_WIDTH = 70; // the width of the bird
const BIRD_X = 240; // the birds x position
const BIRD_JUMP = -500; // the y speed the bird is set to when jumping
const GRAVITY = 2000; // the gravity strength pulling the bird down

let sprite = new Image();
sprite.src = "./assets/one_eye_monster.png";
//sprite.src = "./assets/bird.png";
let background = new Image();
background.src = "./assets/background1.png";
let pipe_head = new Image();
pipe_head.src = "./assets/pipe_head.png";
let pipe_body = new Image();
pipe_body.src = "./assets/pipe_body.png";
let ground = new Image();
ground.src = "./assets/ground.png";
let ground_pos = 0;
let background_pos = 0;

let paused = true; // controls wether the game is paused or not
let timer = 0; // keeps track of time in seconds
let interval = 2; // time between column spawns in seconds
let last_spwan_time = 0; // the time that the last column was spawned in seconds
let pipes = []; // contains all of the pipes
let bird = new Bird(BIRD_WIDTH, BIRD_HEIGHT, BIRD_X, (GAME_HEIGHT / 2) - (BIRD_HEIGHT / 2), BIRD_JUMP, 0, sprite);
let points = 0;
let ai_mode = 0; // 0 is manual

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
        pipes.push(new Pipe(GAME_WIDTH, randomInt(GAME_HEIGHT * 0.1, (GAME_HEIGHT * 0.9) - pipe_gap), pipe_gap, PIPE_WIDTH));
    }

    // ground scroll
    if (!isNaN(delta_time)) 
    {
        ground_pos -= delta_time * PIPE_SPEED;
        ground_pos %= GAME_WIDTH;
        background_pos -= (delta_time * BACKGROUND_SPEED);
        background_pos %= GAME_WIDTH;
    }

    if (ai_mode === 1)
    {
        ai1();
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
    //colorRect(0, 0, GAME_WIDTH , GAME_HEIGHT, "#4287f5");
    draw_background(background, background_pos, GAME_WIDTH, GAME_HEIGHT);

    // draw bird
    draw_bird(bird, "#FF0000");

    // draw pipes
    for (let i = 0; i < pipes.length; i++)
    {
        draw_pipe(pipes[i], GAME_HEIGHT, "#000000", pipe_head, pipe_body);
    }

    // draw ground
    draw_ground(ground, ground_pos, GAME_HEIGHT, GAME_WIDTH, canvas.height);

    window.requestAnimationFrame(draw);
}

setup();

// reseting global variable to start conditions
function start()
{
    pipes = [];
    timer = 0; // in seconds
    interval = 2; // in seconds
    last_spwan_time = 0; // in seconds
    points = 0;
    bird.top_y = (GAME_HEIGHT / 2) - (bird.height / 2);
    bird.current_speed = 0;
}

// simple flappy bird ai
function ai1()
{
    let current_pipe_found = false;
    for (let i = 0; i < pipes.length; i++)
    {
        if (pipes[i].left_x + pipes[i].width >= bird.left_x && !current_pipe_found)
        {
            current_pipe_found = true;
            if (bird.top_y >= pipes[i].top_y + pipes[i].gap_size - (bird.height + 10))
            {
                bird.jump();
            }
        }
    }

    if (bird.top_y >= GAME_HEIGHT / 2 && !current_pipe_found)
    {
        bird.jump();
    }
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
            if (!space_key_down && !paused && ai_mode === 0)
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
            if (!zero_key_down)
            {
                ai_mode = 0;
                zero_key_down = true;
            }
            break;
        case 49:
            if (!one_key_down)
            {
                ai_mode = 1;
                one_key_down = true;
            }
            break;
    }
}