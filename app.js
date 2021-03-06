"use strict";

let canvas = document.getElementById('flappy_bird');
let canvas_context = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// constants
const GAME_WIDTH =  canvas.width - ((canvas.width > 700) * 250); // should be equal to or less than canvas width in pixels
const GAME_HEIGHT =  canvas.height - Math.max(150, canvas.height * 0.2); // should be equal to or less than canvas height in pixels
const PIPE_WIDTH = 100; // width of the pipes in pixels
const PIPE_SPEED = 250; // the speed that pipes move from right to left at pixels per second
const BACKGROUND_SPEED = PIPE_WIDTH * 0.3; // the background scroll speed in pixels
const MIN_PIPE_GAP = 125; // the minimum pipe gap in pixels
const MAX_PIPE_GAP = 150; // the maximum pipe gap in pixels
const MIN_INTERVAL = 1.5; // the minimum time between pipe spawns in seconds
const MAX_INTERVAL = 2; // the maximum time between pipe spawns in seconds
const BIRD_HEIGHT = 50; // the height of the bird
const BIRD_WIDTH = 70; // the width of the bird
const BIRD_X = GAME_WIDTH * 0.25; // the birds x position
const BIRD_JUMP = -500; // the y speed the bird is set to when jumping
const GRAVITY = 2000; // the gravity strength pulling the bird down

let sprites = [new Image(), new Image(), new Image()];
//sprites.src = "./assets/one_eye_monster.png";
sprites[0].src = "./assets/yellowbird-downflap.png";
sprites[1].src = "./assets/yellowbird-midflap.png";
sprites[2].src = "./assets/yellowbird-upflap.png";
let background = new Image();
background.src = "./assets/background1.png";
let pipe_head = new Image();
pipe_head.src = "./assets/pipe_head.png";
let pipe_body = new Image();
pipe_body.src = "./assets/pipe_body.png";
let top_ground = new Image();
top_ground.src = "./assets/top_ground.png";
let bottom_ground = new Image();
bottom_ground.src = "./assets/bottom_ground.png";
let ground_pos = 0;
let background_pos = 0;

let paused = true; // controls wether the game is paused or not
let lost = true; // indicates wether the user has lost or not starts at true for simplicity
let draw_hitbox = false;
let fps = 120; // the frames per second that the game runs on
let time_step = 10; // the timestep that the game runs on in ms, 4ms is the minimum for set timeout
let ai_timestep_divider_value = 10000; // when in ai mode the timestep is divided by this value
let time_factor = 1; // the factor of game time to real time so 2 means game time is twice as fast as realtime
let game_time = 0; // keeps track of game time in seconds
let real_time = 0; // keeps track of the real life time in seconds
let interval = 2; // time between column spawns in seconds
let last_spwan_time = 0; // the time that the last column was spawned in seconds
let pipes = []; // contains all of the pipes
let bird = new Bird(BIRD_WIDTH, BIRD_HEIGHT, BIRD_X, (GAME_HEIGHT / 2) - (BIRD_HEIGHT / 2), BIRD_JUMP, 0, sprites);
let points = 0;
let high_score = 0;
let ai_mode = 0; // 0 is manual
let hit_sound = new Sound("./assets/sfx_hit.wav");
let point_sound = new Sound("./assets/sfx_point.wav");
let wing_sound = new Sound("./assets/sfx_wing.wav");
let background_music = new Sound("./assets/background_music.mp3");

// intial setup
function setup()
{
    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyUp);

    background_music.loop();
    hit_sound.mute();
    wing_sound.mute();
    background_music.mute();
    point_sound.mute();

    let isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    if (isTouchDevice)
    {
        canvas.addEventListener("touchstart", 
            function(event)
            {
                event.preventDefault();
                jump();
            });
    }
    else
    {
        canvas.addEventListener("mousedown", 
            function(event)
            {
                event.preventDefault();
                jump();
            });
    }
    setTimeout(
        function()
        {
            update(((time_step/1000) * time_factor))
        }, time_step);
    window.requestAnimationFrame(draw);
}

// physics update
function update(delta_time)
{
    if (!lost && !paused)
    {
        let ai_timestep_divider = (ai_timestep_divider_value * (ai_mode !== 0)) + (1 * (ai_mode === 0)); // dividies the timestep if in ai mode to allow the game to run more accuratley
        delta_time /= ai_timestep_divider;
        for (let i = 0; i < ai_timestep_divider; i++)
        {
            game_time += delta_time;
            bird.apply_gravity(GRAVITY, delta_time);
            lost = bird.update_position(GAME_HEIGHT, delta_time); // update position returns wether touching bottom or not

            if (lost)
            {
                hit_sound.play();
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
                if (passed === false && pipes[i].left_x + pipes[i].width <=  bird.left_x)
                {
                    if (ai_mode === 0) // only play hit sound when in player mode (this saves a bit of perfomance)
                    {
                        point_sound.play();
                    }                    
                    points++;
                    high_score = Math.max(high_score, points);
                    // console.log(points);
                }

                // check for pipe collisions
                if (pipes[i].left_x < bird.left_x + bird.width && pipes[i].left_x + pipes[i].width > bird.left_x) // check x
                {
                    if (bird.top_y < pipes[i].top_y || bird.top_y + bird.height > pipes[i].top_y + pipes[i].gap_size) // check y
                    {
                        hit_sound.play();
                        paused = true;
                        lost = true;
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
            if (game_time >= last_spwan_time + interval)
            {
                last_spwan_time = game_time;
                interval = random(MIN_INTERVAL, MAX_INTERVAL);
                let pipe_gap = randomInt(MIN_PIPE_GAP, MAX_PIPE_GAP);
                pipes.push(new Pipe(GAME_WIDTH, randomInt(GAME_HEIGHT * 0.1, (GAME_HEIGHT * 0.9) - pipe_gap), pipe_gap, PIPE_WIDTH, pipe_head, pipe_body));
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

            if (lost)
            {
                break;
            }
        }
    }
    setTimeout(
        function()
        {
            update((time_step/1000) * time_factor)
        }, time_step);
}

// draw update
let old_times_stamp = 0;
function draw(time_stamp)
{
    let delta_time = ((time_stamp - old_times_stamp) / 1000); // time between frames in seconds
    fps = 1/delta_time;
    old_times_stamp = time_stamp;
    if (!lost && !paused)
    {
        real_time += delta_time;
    }

    // draw background
    draw_background(background, background_pos, GAME_WIDTH, GAME_HEIGHT);

    // animate bird
    bird.animate(game_time);
    // draw bird
    bird.draw(canvas_context, draw_hitbox);

    // draw pipes
    for (let i = 0; i < pipes.length; i++)
    {
        pipes[i].draw(canvas_context, GAME_HEIGHT, draw_hitbox);
    }

    // draw ground
    draw_ground(top_ground, bottom_ground, ground_pos, GAME_HEIGHT, GAME_WIDTH, canvas.height);

    // draw stats
    draw_stats(GAME_WIDTH, GAME_HEIGHT, canvas.width, canvas.height, fps, real_time, game_time, points, high_score);

    window.requestAnimationFrame(draw);
}

document.addEventListener('DOMContentLoaded', function(event)
{
    setup();
})


// reseting global variable to start conditions
function start()
{
    pipes = [];
    game_time = 0; // in seconds
    real_time = 0; // in seconds
    interval = 2; // in seconds
    last_spwan_time = 0; // in seconds
    points = 0;
    bird.top_y = (GAME_HEIGHT / 2) - (bird.height / 2);
    bird.current_speed = 0;
    bird.time = 0;
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
                background_music.play();
                paused = false;
                lost = false;
                start();
                enter_key_down = true;
            }
            break;
        case 32:
            if (!space_key_down)
            {  
                jump();
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
            if (!up_key_down)
            {
                hit_sound.unmute();
                wing_sound.unmute();
                background_music.unmute();
                point_sound.unmute();
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
            if (!down_key_down)
            {
                hit_sound.mute();
                wing_sound.mute();
                background_music.mute();
                point_sound.mute();
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

function jump()
{
    background_music.play();
    if (!lost && !paused && ai_mode === 0)
    {  
        // wing_sound.play();
        bird.jump();
    }
    else if (lost)
    {
        paused = false;
        lost = false;
        start();
    }
}