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
                <video controls autoplay inline>
                    <source src="` + src + `" type="video/webm">
                </video>`;
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
    modalContent.innerHTML = "";
    modal.classList.remove("open");
}