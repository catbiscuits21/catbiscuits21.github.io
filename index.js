const projectMediaContainers = document.querySelectorAll(".project-media-container");

projectMediaContainers.forEach((container) => {
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

//opens the modal for previewing media. Makes the modal's content include the src and creates html for the given type of media
//valid type parameters: video, image
function openMediaPreview(src, type){
    if (type !== "video" && type !== "image") { return; }
    var modal = document.querySelector("#preview-modal");
    var modalContent = document.querySelector("#preview-content");

    switch (type){
        case "video":{
            modalContent.innerHTML = `
                <video controls autoplay>
                    <source src="` + src + `" type="video/mp4">
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