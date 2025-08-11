console.log("welcome to spotify");
let songindex = 0;
let audioElement = new Audio("songs/1.mp3");
let masterPlay = document.getElementById("masterPlay");

let myProgressBar = document.getElementById("myProgressBar");

let gif = document.getElementById("gif");
let masterSongName = document.getElementById("masterSongName");

let songItem = Array.from(document.getElementsByClassName("songItem"));

let songs = [
  {
    songName: "Warriyo - Mortals [NCS Release]",
    filepath: "songs/1.mp3",
    coverpath: "covers/1.jpg",
  },
  {
    songName: "Cielo - Huma-Huma",
    filepath: "songs/2.mp3",
    coverpath: "covers/2.jpg",
  },
  {
    songName: "DEAF KEV - Invincible [NCS Release]-320k",
    filepath: "songs/3.mp3",
    coverpath: "covers/3.jpg",
  },
  {
    songName: "Different Heaven & EH!DE - My Heart [NCS Release]",
    filepath: "songs/4.mp3",
    coverpath: "covers/4.jpg",
  },
  {
    songName: "Janji-Heroes-Tonight-feat-Johnning-NCS-Release",
    filepath: "songs/5.mp3",
    coverpath: "covers/5.jpg",
  },
  {
    songName: "Rabba - Salam-e-Ishq",
    filepath: "songs/6.mp3",
    coverpath: "covers/6.jpg",
  },
  {
    songName: "Sakhiyaan - Salam-e-Ishq",
    filepath: "songs/7.mp3",
    coverpath: "covers/7.jpg",
  },
  {
    songName: "Bhula Dena - Salam-e-Ishq",
    filepath: "songs/8.mp3",
    coverpath: "covers/8.jpg",
  },
  {
    songName: "Tumhari Kasam - Salam-e-Ishq",
    filepath: "songs/9.mp3",
    coverpath: "covers/9.jpg",
  },
  {
    songName: "Na Jaana - Salam-e-Ishq",
    filepath: "songs/10.mp3",
    coverpath: "covers/10.jpg",
  },
];

songItem.forEach((element, i) => {
  // console.log(element.i);

  element.getElementsByTagName("img")[0].src = songs[i].coverpath;
  element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

// audioElement.play();

// handle play/pause click
masterPlay.addEventListener("click", () => {
  if (audioElement.paused || audioElement.currentTime <= 0) {
    audioElement.play();
    masterPlay.classList.remove("fa-circle-play");
    masterPlay.classList.add("fa-circle-pause");
    gif.style.opacity = 1;
  } else {
    audioElement.pause();
    masterPlay.classList.remove("fa-circle-pause");
    masterPlay.classList.add("fa-circle-play");
    gif.style.opacity = 0;
  }
});
// listen to events
audioElement.addEventListener("timeupdate", () => {
  // update the progress bar value
  progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
  console.log(progress);
  myProgressBar.value = progress;
});

myProgressBar.addEventListener("change", () => {
  audioElement.currentTime =
    (myProgressBar.value * audioElement.duration) / 100;
});

const makeAllPlays = () => {
  Array.from(document.getElementsByClassName("songItemPlay")).forEach(
    (element) => {
      element.classList.remove("fa-circle-pause");
      element.classList.add("fa-circle-play");
    }
  );
};
Array.from(document.getElementsByClassName("songItemPlay")).forEach(
  (element) => {
    element.addEventListener("click", (e) => {
      makeAllPlays();
      songindex = parseInt(e.target.id);
      masterSongName.innerText = songs[songindex-1].songName;
      e.target.classList.remove("fa-circle-play");
      e.target.classList.add("fa-circle-pause");
      audioElement.src = `songs/${songindex}.mp3`;
      audioElement.currentTime = 0;
      audioElement.play();
       gif.style.opacity = 1;
      masterPlay.classList.remove("fa-circle-play");
      masterPlay.classList.add("fa-circle-pause");
    });
  }
);

document.getElementById("next").addEventListener("click", () => {
  if (songindex >= 9) {
    songindex += 0;
  } else {
    songindex += 1;
  }

  audioElement.src = `songs/${songindex}.mp3`;
  masterSongName.innerText = songs[songindex].songName
  audioElement.currentTime = 0;
  audioElement.play();
  masterPlay.classList.remove("fa-circle-play");
  masterPlay.classList.add("fa-circle-pause");
});
document.getElementById("previous").addEventListener("click", () => {
  if (songindex <= 0) {
    songindex = 0;
  } else {
    songindex -= 1;
  }

  audioElement.src = `songs/${songindex}.mp3`;
  masterSongName.innerText = songs[songindex].songName
  audioElement.currentTime = 0;
  audioElement.play();
  masterPlay.classList.remove("fa-circle-play");
  masterPlay.classList.add("fa-circle-pause");
});
