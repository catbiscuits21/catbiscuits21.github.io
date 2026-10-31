playInViewport();

//this enables the feature where videos in project media containers play when they are hovered
function playOnHover(){
    const containers = document.querySelectorAll(".project-media-container");
    containers.forEach((container) => {
    const video = container.querySelector("video");

    if (video != null) {
        container.addEventListener("mouseenter", () => 
            {
                video.play(); 
            });

        container.addEventListener("mouseleave", () => 
            {
                video.pause();
                video.currentTime = 0;
            });
    }
    });
}

//this enables the feature where videos in project media containers autoplay when they are in the viewport
function playInViewport(){
    const containers = document.querySelectorAll(".project-media-container");
    const videos = [];

    containers.forEach((container) => {
        const video = container.querySelector("video");

        if (video != null) {
            videos.push(video);
        }
    })

    const observerOptions = {
        threshold: 0.5 //this determines how much of the element must be seen before it can be determined as fully observed
    };

    //add a event listener for an observer invoke
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting){
                video.play();
                //console.log("Playing video");
            }
            else{
                //console.log("Pausing video");
                video.pause();
                video.currentTime = 0;
            }
        })
    }, observerOptions); 

    //invoke observation for every project media container
    videos.forEach((video) => {
        observer.observe(video);
    }); 
}

//opens the modal for previewing media. Makes the modal's content include the src and creates html for the given type of media
//valid type parameters: video, image
function openMediaPreview(src, type){
    if (type !== "video" && type !== "image") { return; }
    var modal = document.querySelector("#preview-modal");
    var modalContent = document.querySelector("#preview-content");

    switch (type){
        case "video":{
            modalContent.innerHTML = `
                <div class="video-player">
                    <video autoplay playsinline>
                        <source src="` + src + `" type="video/webm">
                    </video>
                    <div class="video-controls">
                        <button class="video-button video-play-button">` + videoIcons.pause + `</button>
                        <div class="video-progress">
                            <div class="video-progress-fill"></div>
                        </div>
                        <p class="video-time">0:00 / 0:00</p>
                        <button class="video-button video-mute-button">` + videoIcons.volume + `</button>
                        <button class="video-button video-fullscreen-button">` + videoIcons.fullscreen + `</button>
                    </div>
                </div>`;
            setupVideoPlayer(modalContent.querySelector(".video-player"));
            break;
        }
        case "image":{
            modalContent.innerHTML = `<img src="` + src + `">`;
            break;
        }
    }

    modal.classList.add("open");
}

function closeMediaPreview(){
    var modal = document.querySelector("#preview-modal");
    var modalContent = document.querySelector("#preview-content");

    if (document.fullscreenElement != null) {
        document.exitFullscreen();
    }

    modalContent.innerHTML = "";
    modal.classList.remove("open");
}

//icons used by the custom video player buttons (google material symbols, rounded style)
const videoIcons = {
    play: `<img src="assets/imgs/play-icon.svg">`,
    pause: `<img src="assets/imgs/pause-icon.svg">`,
    volume: `<img src="assets/imgs/volume-icon.svg">`,
    muted: `<img src="assets/imgs/muted-icon.svg">`,
    fullscreen: `<img src="assets/imgs/fullscreen-icon.svg">`,
    exitFullscreen: `<img src="assets/imgs/exit-fullscreen-icon.svg">`
};

//hooks up the custom controls (play/pause, progress bar, time, mute, fullscreen) for a video player in the preview modal
function setupVideoPlayer(player){
    const video = player.querySelector("video");
    const playButton = player.querySelector(".video-play-button");
    const muteButton = player.querySelector(".video-mute-button");
    const fullscreenButton = player.querySelector(".video-fullscreen-button");
    const progress = player.querySelector(".video-progress");
    const progressFill = player.querySelector(".video-progress-fill");
    const time = player.querySelector(".video-time");

    const togglePlay = () => {
        if (video.paused) {
            video.play();
        }
        else{
            video.pause();
        }
    };

    playButton.addEventListener("click", togglePlay);
    video.addEventListener("click", togglePlay);

    //swap the play/pause icon and let css know if the video is playing so it can hide the controls
    video.addEventListener("play", () => {
        playButton.innerHTML = videoIcons.pause;
        player.classList.add("playing");
    });

    video.addEventListener("pause", () => {
        playButton.innerHTML = videoIcons.play;
        player.classList.remove("playing");
    });

    muteButton.addEventListener("click", () => {
        video.muted = !video.muted;
        muteButton.innerHTML = video.muted ? videoIcons.muted : videoIcons.volume;
    });

    fullscreenButton.addEventListener("click", () => {
        if (document.fullscreenElement != null) {
            document.exitFullscreen();
        }
        else{
            player.requestFullscreen();
        }
    });

    //swap the fullscreen icon when entering or leaving fullscreen
    player.addEventListener("fullscreenchange", () => {
        fullscreenButton.innerHTML = document.fullscreenElement != null ? videoIcons.exitFullscreen : videoIcons.fullscreen;
    });

    //clicking or dragging on the progress bar seeks the video to that point
    const seek = (event) => {
        const rect = progress.getBoundingClientRect();
        const percent = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
        if (!isNaN(video.duration)) {
            video.currentTime = percent * video.duration;
        }
    };

    progress.addEventListener("pointerdown", (event) => {
        progress.setPointerCapture(event.pointerId);
        seek(event);
    });

    progress.addEventListener("pointermove", (event) => {
        if (progress.hasPointerCapture(event.pointerId)) {
            seek(event);
        }
    });

    //update the progress bar and time every frame so it moves smoothly, stops once the player is removed from the page
    const updateProgress = () => {
        if (!player.isConnected) { return; }

        if (!isNaN(video.duration)) {
            progressFill.style.width = (video.currentTime / video.duration * 100) + "%";
            time.textContent = formatVideoTime(video.currentTime) + " / " + formatVideoTime(video.duration);
        }

        requestAnimationFrame(updateProgress);
    };

    requestAnimationFrame(updateProgress);
}

//turns a number of seconds into a m:ss string
function formatVideoTime(seconds){
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return minutes + ":" + String(remainingSeconds).padStart(2, "0");
}