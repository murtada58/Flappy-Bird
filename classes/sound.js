"use strict";

class Sound
{
    constructor (src)
    {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play()
    {
        this.sound.play();
    }

    stop()
    {
        this.sound.pause();
    }
    
    loop()
    {
        this.sound.loop = true;
    }

    mute()
    {
        this.sound.muted = true;
    }

    unmute()
    {
        this.sound.muted = false;
    }

}