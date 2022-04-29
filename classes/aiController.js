
class AiController {
    // simple flappy bird ai
    update(bird, pipes)
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
}