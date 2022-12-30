import birdsDataEn from "./en.js";
import birdsData from "./ru.js";
import langBirds from "./lang.js";

document.addEventListener("DOMContentLoaded", () => {
  //page-nav
  const start = document.querySelector(".nav__start_btn");
  const game = document.querySelectorAll(".nav__game_btn");

  let langChange = document.querySelector(".lang");
  let qurLang = localStorage.getItem("qurLang")
    ? JSON.parse(localStorage.getItem("qurLang"))
    : "en";
  langChange.innerHTML = localStorage.getItem("langChange")
    ? JSON.parse(localStorage.getItem("langChange"))
    : `Ru`;
  let birds = localStorage.getItem("lang")
    ? JSON.parse(localStorage.getItem("lang"))
    : birdsDataEn;

  getTranslate(qurLang);

  function toStart() {
    document.querySelector(".quiz").classList.add("hidden");
    document.querySelector(".finish").classList.add("hidden");
    document.querySelector(".start").classList.remove("hidden");
    game.forEach((btn) => btn.classList.remove("active-btn"));
    start.classList.add("active-btn");
  }

  function toPlay() {
    document.querySelector(".finish").classList.add("hidden");
    document.querySelector(".quiz").classList.remove("hidden");
    document.querySelector(".start").classList.add("hidden");
    game.forEach((btn) => btn.classList.add("active-btn"));
    start.classList.remove("active-btn");
    birdsNames();
    qurAnswer();
    nextNotEnable();
    document.querySelector(".quiz__score_qurrent").innerHTML = resScore;
    document.querySelector(".what-bird-description").classList.add("hidden");
  }

  function finish() {
    audioFinPlay();
    document.querySelector(".quiz").classList.add("hidden");
    document.querySelector(".finish").classList.remove("hidden");
    start.classList.add("btn-not-active");
    game.forEach((btn) => btn.classList.add("btn-not-active"));
    document.querySelector(".score").innerHTML = resScore;
    audioBtn.classList.add("btn-not-active");
    langChange.classList.add("btn-not-active");
  }

  start.addEventListener("click", function () {
    toStart();
  });

  game.forEach((btn) =>
    btn.addEventListener("click", function () {
      toPlay();
    })
  );

  //new game button
  document.querySelector(".again").addEventListener("click", function () {
    //audioFinStop();
    start.classList.remove("btn-not-active");
    game.forEach((btn) => btn.classList.remove("btn-not-active"));
    audioBtn.classList.remove("btn-not-active");
    langChange.classList.remove("btn-not-active");
    questions[0].classList.add("quiz__link-active");
    startScore = 5;
    resScore = 0;
    enable = 0;
    if (qurLang == "en") {
      nextBtn.innerHTML = "Next question";
    } else if (qurLang == "ru") {
      nextBtn.innerHTML = "Следующий вопрос";
    }
    toPlay();
  });

  //question randomizer
  function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  //enabling next question
  function nextNotEnable() {
    nextBtn.classList.add("btn-not-active");
  }
  function nextEnable() {
    nextBtn.classList.remove("btn-not-active");
  }

  //coloring answer dots
  let qurBird;
  let enableColor = 0;

  function qurAnswer() {
    if (enable < 6) {
      let qurBirdIndex = getRandom(0, 5);
      qurBird = birds[enable][qurBirdIndex];
      audioQur.load();
      audioQur.innerHTML = `<source src=${qurBird.audio} type="audio/mp3"/>`;
    }
  }

  const pressedAnswer = document.querySelectorAll(".item-btn");

  function colorBtnYes() {
    pressedAnswer[targetBird.id - 1].classList.add("item-btn-yes");
    nextEnable();
  }

  function colorBtnNo() {
    pressedAnswer[targetBird.id - 1].classList.add("item-btn-no");
  }

  function deleteColors() {
    pressedAnswer.forEach((item) => item.classList.remove("item-btn-no"));
    pressedAnswer.forEach((item) => item.classList.remove("item-btn-yes"));
    enableColor = 0;
    nextNotEnable();
  }

  //sounds on btn clicks
  const audioNo = new Audio("./src/assets/audio/wrongClick1.mp3");
  const audioYes = new Audio("./src/assets/audio/winClick.mp3");
  const audioFin = new Audio("./src/assets/audio/finish.mp3");

  //volume of the game
  const audioBtn = document.querySelector(".volume");
  let audioOn = localStorage.getItem("sound")
    ? JSON.parse(localStorage.getItem("sound"))
    : true;
  audioBtn.innerHTML = localStorage.getItem("soundBtn")
    ? JSON.parse(localStorage.getItem("soundBtn"))
    : `<img src="./src/assets/icons/volume_on.svg" alt="">`;

  function audioYesPlay() {
    if (audioOn) {
      audioYes.play();
    }
  }

  function audioNoPlay() {
    if (audioOn) {
      audioNo.play();
    }
  }

  function audioFinPlay() {
    if (audioOn) {
      audioFin.play();
    }
  }

  //function audioFinStop() {audioFin.pause();};
  audioBtn.addEventListener("click", () => {
    if (audioOn) {
      audioBtn.innerHTML = `<img src="./src/assets/icons/volume_off.svg" alt="">`;
      audioOn = false;
    } else {
      audioBtn.innerHTML = `<img src="./src/assets/icons/volume_on.svg" alt="">`;
      audioOn = true;
    }
    localStorage.setItem("sound", JSON.stringify(audioOn));
    localStorage.setItem("soundBtn", JSON.stringify(audioBtn.innerHTML));
  });

  //fill the answer field
  function rightBirdPush() {
    document.querySelector(
      ".qur-bird__img"
    ).innerHTML = `<img src='${targetBird.image}'>`;
    document.querySelector(".qur-bird__name").innerHTML = targetBird.name;
    document.querySelector(".quiz__score_qurrent").innerHTML = resScore;
  }

  //score variables
  let startScore = 5;
  let resScore = 0;
  let wrongAnswer = [];

  function rightBird() {
    if (enableColor == 0) {
      if (targetBird.id == qurBird.id) {
        rightBirdPush();
        colorBtnYes();
        enableColor++;
        audioYesPlay();
        playSoundOff();
        resScore += startScore;
        document.querySelector(".quiz__score_qurrent").innerHTML = resScore;
        if (enable == 5) {
          if (qurLang == "en") {
            nextBtn.innerHTML = "Go To Results!";
          } else if (qurLang == "ru") {
            nextBtn.innerHTML = "Перейти к результату!";
          }
        }
      } else {
        audioNoPlay();
        if (!wrongAnswer.includes(targetBird.id)) {
          startScore--;
        }
        //console.log(startScore);
        wrongAnswer.push(targetBird.id);
        colorBtnNo();
      }
    }
  }

  //change questions links
  const questions = document.querySelectorAll(".quiz__link");
  const answers = document.querySelectorAll(".answer__item");

  let enable = 0;

  let nextBtn = document.querySelector(".btn");

  function nextQuestion() {
    while (enable < 6) {
      questions[enable].classList.remove("quiz__link-active");
      enable++;
      birdsNames();
      qurAnswer();
      if (enable != 6) {
        questions[enable].classList.add("quiz__link-active");
      }
      break;
    }
  }

  nextBtn.addEventListener("click", function () {
    wrongAnswer = [];
    playAnswerSoundOff();
    playSoundOff();
    firstAnswer = false;
    startScore = 5;
    deleteColors();
    document.querySelector(".instruction").classList.remove("hidden");
    document.querySelector(".what-bird-description").classList.add("hidden");
    document.querySelector(
      ".qur-bird__img"
    ).innerHTML = `<img src="./src/assets/images/question__bird.jpg">`;
    document.querySelector(".qur-bird__name").innerHTML = `<h3>*******</h3>`;
    if (
      nextBtn.innerHTML == "Go To Results!" ||
      nextBtn.innerHTML == "Перейти к результату!"
    ) {
      finish();
    }
    nextQuestion();
  });

  //filling answers fields
  function birdsNames() {
    if (enable < 6) {
      for (let i = 0; i < answers.length; i++) {
        answers[i].innerHTML = birds[enable][i].name;
      }
    }
  }

  //filling what-about field
  let targetBird;
  //let answerSound;
  let audioAnswer = document.querySelector(".what-sound__audio-track");
  let playAnswerBtn = document.querySelector(".what-sound__play-button");
  let firstAnswer = false;

  answers.forEach((item) =>
    item.addEventListener("click", function () {
      firstAnswer = true;
      if (audioAnswer.paused) {
        playAnswerSoundOff();
      }
      document.querySelector(".instruction").classList.add("hidden");
      document
        .querySelector(".what-bird-description")
        .classList.remove("hidden");
      let target = this.innerHTML;
      let targetBirdIndex;

      for (let i = 0; i < birds[enable].length; i++) {
        if (birds[enable][i].name == target) {
          targetBirdIndex = Number(birds[enable][i].id) - 1;
        }
      }

      targetBird = birds[enable][targetBirdIndex];

      document.querySelector(
        ".what-bird__img"
      ).innerHTML = `<img src='${targetBird.image}'>`;
      document.querySelector(".what-bird__name").innerHTML = targetBird.name;
      document.querySelector(".what-bird__species").innerHTML =
        targetBird.species;
      document.querySelector(".what-about").innerHTML = targetBird.description;
      playAnswerBtn.classList.remove("what-sound__play-button-pause");
      //answerSound = new Audio(`${targetBird.audio}`);
      audioAnswer.load();
      audioAnswer.innerHTML = `<source src=${targetBird.audio} type="audio/mp3"/>`;
      rightBird();
    })
  );

  //audio player
  let audioQur = document.querySelector(".qur-audio-track");
  let muteBtn = document.querySelector(".qur-audio-mute");
  const playBtn = document.querySelector(".play-button");

  function playSoundOn() {
    playBtn.classList.add("play-button-pause");
    audioQur.play();
  }

  function playSoundOff() {
    playBtn.classList.remove("play-button-pause");
    audioQur.pause();
  }

  playBtn.addEventListener("click", () => {
    if (!audioQur.paused) {
      playSoundOff();
    } else if (!audioQur.paused && !audioQur.ended) {
      window.clearInterval(updateTime);
      playSoundOff();
    } else {
      playSoundOn();
      playAnswerSoundOff();
      updateTime();
    }
  });

  function muteIsOn() {
    if (audioQur.muted == true) {
      audioQur.muted = false;
      volumeNow.style.backgroundColor = "#141427";
    } else {
      audioQur.muted = true;
      volumeNow.style.backgroundColor = "#ecbf08";
    }
  }

  muteBtn.addEventListener("click", () => {
    muteIsOn();
    if (muteBtn.classList.contains("muted")) {
      muteBtn.classList.remove("muted");
    } else {
      muteBtn.classList.add("muted");
    }
  });

  let timeNow = document.querySelector(".qur-time__now");
  let timeEnd = document.querySelector(".qur-time__end");
  let timeBar = document.querySelector(".qur-audio-time");
  let songWidth = document.querySelector(".qur-audio-timebar");
  let songLength = 0;

  audioQur.onloadedmetadata = () => {
    songLength = audioQur.duration;
    let minutes = parseInt(songLength / 60);
    let seconds = parseInt(songLength % 60);

    if (seconds < 10) {
      timeEnd.innerHTML = `${minutes}:0${seconds}`;
    } else {
      timeEnd.innerHTML = `${minutes}:${seconds}`;
    }
  };

  const birdSongTime = () => {
    if (!audioQur.ended) {
      let minutesNow = parseInt(audioQur.currentTime / 60);
      let secondsNow = parseInt(audioQur.currentTime % 60);

      if (secondsNow < 10) {
        timeNow.innerHTML = minutesNow + ":" + 0 + secondsNow;
      } else {
        timeNow.innerHTML = minutesNow + ":" + secondsNow;
      }

      let timeQurSong = parseInt(
        (audioQur.currentTime / songLength) * songWidth.clientWidth
      );

      timeBar.style.width = timeQurSong + "px";
    } else {
      window.clearInterval(updateTime);
      timeNow.innerHTML = "0:00";
      playBtn.classList.remove("play-button-pause");
      timeBar.style.width = "0px";
    }
  };

  const updateTime = () => {
    setInterval(birdSongTime, 10);
  };

  function pointedBar(e) {
    if (!audioQur.ended) {
      let mouseX = 0;
      let trackRect = songWidth.getBoundingClientRect();
      let offset = trackRect.left;
      mouseX = e.pageX - offset;
      let newTime = (mouseX * songLength) / songWidth.clientWidth;
      audioQur.currentTime = newTime;
      timeBar.style.width = mouseX + "px";
      birdSongTime();
    }
  }

  songWidth.addEventListener("click", pointedBar, false);

  let volume = document.querySelector(".sound-control");
  let volumeNow = document.querySelector(".sound-control__value");

  const pointedVolume = (e) => {
    let mouseX = 0;
    let trackRect = volume.getBoundingClientRect();
    let offset = trackRect.left;
    mouseX = e.pageX - offset;
    audioQur.volume = (mouseX / volume.clientWidth) * 1;
    volumeNow.style.width = mouseX + "px";
  };

  volume.addEventListener("click", pointedVolume, false);

  //audio player for all answers
  let answerMuteBtn = document.querySelector(".what-sound__audio-mute");

  function playAnswerSoundOn() {
    if (firstAnswer) {
      playAnswerBtn.classList.add("what-sound__play-button-pause");
      audioAnswer.play();
    }
  }

  function playAnswerSoundOff() {
    if (firstAnswer) {
      playAnswerBtn.classList.remove("what-sound__play-button-pause");
      audioAnswer.pause();
    }
  }

  playAnswerBtn.addEventListener("click", () => {
    if (!audioAnswer.paused) {
      playAnswerSoundOff();
    } else if (!audioAnswer.paused && !audioAnswer.ended) {
      window.clearInterval(updateAnswerTime);
      playAnswerSoundOff();
    } else {
      playAnswerSoundOn();
      playSoundOff();
      updateAnswerTime();
    }
  });

  function answerMuteIsOn() {
    if (audioAnswer.muted == true) {
      audioAnswer.muted = false;
      answerVolumeNow.style.backgroundColor = "#141427";
    } else {
      audioAnswer.muted = true;
      answerVolumeNow.style.backgroundColor = "#ecbf08";
    }
  }

  answerMuteBtn.addEventListener("click", () => {
    answerMuteIsOn();
    if (answerMuteBtn.classList.contains("what-sound__muted")) {
      answerMuteBtn.classList.remove("what-sound__muted");
    } else {
      answerMuteBtn.classList.add("what-sound__muted");
    }
  });

  let answerTimeNow = document.querySelector(".what-sound__time__now");
  let answerTimeEnd = document.querySelector(".what-sound__time__end");
  let answerTimeBar = document.querySelector(".what-sound__audio-time");
  let answerSongWidth = document.querySelector(".what-sound__audio-timebar");
  let answerSongLength = 0;

  audioAnswer.onloadedmetadata = () => {
    answerSongLength = audioAnswer.duration;
    let minutes = parseInt(answerSongLength / 60);
    let seconds = parseInt(answerSongLength % 60);

    if (seconds < 10) {
      answerTimeEnd.innerHTML = `${minutes}:0${seconds}`;
    } else {
      answerTimeEnd.innerHTML = `${minutes}:${seconds}`;
    }
  };

  const answerBirdSongTime = () => {
    if (!audioAnswer.ended) {
      let minutesNow = parseInt(audioAnswer.currentTime / 60);
      let secondsNow = parseInt(audioAnswer.currentTime % 60);

      if (secondsNow < 10) {
        answerTimeNow.innerHTML = minutesNow + ":" + 0 + secondsNow;
      } else {
        answerTimeNow.innerHTML = minutesNow + ":" + secondsNow;
      }

      let answerTimeQurSong = parseInt(
        (audioAnswer.currentTime / answerSongLength) *
          answerSongWidth.clientWidth
      );

      answerTimeBar.style.width = answerTimeQurSong + "px";
    } else {
      window.clearInterval(updateAnswerTime);
      answerTimeNow.innerHTML = "0:00";
      playAnswerBtn.classList.remove("what-sound__play-button-pause");
      answerTimeBar.style.width = "0px";
    }
  };

  const updateAnswerTime = () => {
    setInterval(answerBirdSongTime, 10);
  };

  function answerPointedBar(e) {
    if (!audioAnswer.ended) {
      let mouseX = 0;
      let trackRect = answerSongWidth.getBoundingClientRect();
      let offset = trackRect.left;
      mouseX = e.pageX - offset;
      let newTime = (mouseX * answerSongLength) / answerSongWidth.clientWidth;
      audioAnswer.currentTime = newTime;
      answerTimeBar.style.width = mouseX + "px";
      answerBirdSongTime();
    }
  }

  answerSongWidth.addEventListener("click", answerPointedBar, false);

  let answerVolume = document.querySelector(".what-sound__sound-control");
  let answerVolumeNow = document.querySelector(
    ".what-sound__sound-control__value"
  );

  const answerPointedVolume = (e) => {
    let mouseX = 0;
    let trackRect = answerVolume.getBoundingClientRect();
    let offset = trackRect.left;
    mouseX = e.pageX - offset;
    audioAnswer.volume = (mouseX / answerVolume.clientWidth) * 1;
    answerVolumeNow.style.width = mouseX + "px";
  };

  answerVolume.addEventListener("click", answerPointedVolume, false);

  //language change
  function getTranslate(qurLang) {
    const text = document.querySelectorAll("[data-lang]");
    text.forEach((elem) => {
      elem.textContent = langBirds[qurLang][elem.dataset.lang];
    });
  }

  langChange.addEventListener("click", () => {
    getTranslate(qurLang);

    if (qurLang == "en") {
      langChange.innerHTML = `Англ`;
      birds = birdsData;
      qurLang = "ru";
    } else if (qurLang == "ru") {
      langChange.innerHTML = `Ru`;
      birds = birdsDataEn;
      qurLang = "en";
    }
    localStorage.setItem("qurLang", JSON.stringify(qurLang));
    localStorage.setItem("lang", JSON.stringify(birds));
    localStorage.setItem("langChange", JSON.stringify(langChange.innerHTML));
    location.reload();
  });

  //fill the gallery
  let gallery = document.querySelector(".gallery");
  let gallSong = [];

  function itemMaker(arr, item) {
    let gallItem = document.createElement("div");
    let gallTitle = document.createElement("div");
    let gallSound = document.createElement("div");
    let gallInfo = document.createElement("div");
    let gallImg = document.createElement("img");
    let gallBird = document.createElement("div");
    let gallName = document.createElement("div");
    let gallSpecies = document.createElement("div");

    gallItem.className = "gallery__item";
    gallTitle.className = "gallery__title";
    gallSound.className = "gallery__sound";
    gallInfo.className = "gallery__info";
    gallImg.className = "gallery__img";
    gallBird.className = "gallery__bird";
    gallName.className = "gallery__name";
    gallSpecies.className = "gallery__species";

    gallery.append(gallItem);
    gallItem.append(gallTitle);
    gallItem.append(gallInfo);
    gallTitle.append(gallImg);
    gallTitle.append(gallBird);
    gallBird.append(gallName);
    gallBird.append(gallSpecies);
    gallBird.append(gallSound);

    gallImg.src = birds[arr][item].image;
    gallName.innerHTML = birds[arr][item].name;
    gallSpecies.innerHTML = birds[arr][item].species;
    gallSound.innerHTML = `<audio src="${birds[arr][item].audio}" width=240 controls></audio>`;

    gallSong.push([birds[arr][item].name, birds[arr][item].audio]);

    gallInfo.innerHTML = birds[arr][item].description;
  }
  //console.log(gallSong)

  function mkGallery() {
    for (let arr = 0; arr < birds.length; arr++) {
      for (let item = 0; item < birds[arr].length; item++) {
        itemMaker(arr, item);
      }
    }
  }

  mkGallery();

  let gallOn = localStorage.getItem("gallery")
    ? JSON.parse(localStorage.getItem("gallery"))
    : false;
  isGalleryOn(gallOn);

  function isGalleryOn() {
    if (gallOn) {
      gallery.classList.remove("hidden");
      document.querySelector(".quiz").classList.add("hide");
      document.querySelector(".finish").classList.add("hide");
      document.querySelector(".start").classList.add("hide");

      start.classList.add("btn-not-active-gallOn");
      game.forEach((btn) => btn.classList.add("btn-not-active-gallOn"));
      audioBtn.classList.add("btn-not-active-gallOn");

      document
        .querySelector(".gallery__link")
        .classList.add("gallery__link-active");
    } else {
      gallery.classList.add("hidden");
      document.querySelector(".quiz").classList.remove("hide");
      document.querySelector(".finish").classList.remove("hide");
      document.querySelector(".start").classList.remove("hide");

      start.classList.remove("btn-not-active-gallOn");
      game.forEach((btn) => btn.classList.remove("btn-not-active-gallOn"));
      audioBtn.classList.remove("btn-not-active-gallOn");

      document
        .querySelector(".gallery__link")
        .classList.remove("gallery__link-active");
    }
  }

  document.querySelector(".gallery__link").addEventListener("click", () => {
    if (gallOn) {
      gallOn = false;
      isGalleryOn();
    } else {
      gallOn = true;
      isGalleryOn();
    }

    localStorage.setItem("gallery", JSON.stringify(gallOn));
  });
});
