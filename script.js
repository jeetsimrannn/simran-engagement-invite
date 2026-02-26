const inviteIntro = document.getElementById("inviteIntro");
const envelopeMedia = document.getElementById("envelopeMedia");
const introVideo = document.getElementById("introVideo");
const heroBgVideo = document.getElementById("heroBgVideo");
const INTRO_VISIBLE_MS = 2500;
const HERO_VIDEO_START_DELAY_MS = 2900;
let introTimeoutId = null;
let heroVideoPrimed = false;

function hideIntro() {
  if (!inviteIntro || inviteIntro.hidden) return;
  if (introTimeoutId) {
    clearTimeout(introTimeoutId);
    introTimeoutId = null;
  }
  inviteIntro.classList.add("is-hidden");
  document.body.classList.remove("intro-active");
  document.body.classList.add("intro-complete");
  setTimeout(() => {
    startHeroBgVideo();
  }, HERO_VIDEO_START_DELAY_MS);
  setTimeout(() => {
    inviteIntro.hidden = true;
  }, 760);
}

async function startHeroBgVideo() {
  if (!heroBgVideo) return;
  heroBgVideo.muted = true;
  heroBgVideo.playsInline = true;
  if (!heroVideoPrimed) {
    heroBgVideo.currentTime = 0;
  }
  document.body.classList.add("hero-video-visible");
  try {
    await heroBgVideo.play();
  } catch {
    // Ignore playback blocking and keep the hero visible.
  }
}

async function primeHeroBgVideoFromGesture() {
  if (!heroBgVideo || heroVideoPrimed) return;
  heroBgVideo.muted = true;
  heroBgVideo.playsInline = true;
  heroBgVideo.currentTime = 0;
  try {
    await heroBgVideo.play();
    heroBgVideo.pause();
    heroBgVideo.currentTime = 0;
    heroVideoPrimed = true;
  } catch {
    // If priming fails, startHeroBgVideo will retry later.
  }
}

if (inviteIntro) {
  document.body.classList.remove("intro-complete");
  document.body.classList.add("intro-active");
  envelopeMedia?.addEventListener("click", async () => {
    if (inviteIntro.classList.contains("is-opening")) return;
    inviteIntro.classList.add("is-opening");
    await primeHeroBgVideoFromGesture();
    if (introVideo) {
      introVideo.currentTime = 0;
      try {
        await introVideo.play();
      } catch {
        // If intro video cannot autoplay, continue anyway.
      }
    }
    introTimeoutId = setTimeout(hideIntro, INTRO_VISIBLE_MS);
  });

  envelopeMedia?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      envelopeMedia.click();
    }
  });
}

if (!inviteIntro) {
  document.body.classList.remove("intro-active");
  document.body.classList.add("intro-complete");
  document.body.classList.add("hero-video-visible");
  startHeroBgVideo();
}

if (!envelopeMedia && inviteIntro) {
  setTimeout(() => {
    hideIntro();
  }, 2000);
}

if (introVideo) {
  introVideo.addEventListener("ended", hideIntro);
  introVideo.addEventListener("error", () => {
    setTimeout(hideIntro, 1800);
  });
  setTimeout(() => {
    if (inviteIntro?.classList.contains("is-opening") && !inviteIntro.hidden) {
      hideIntro();
    }
  }, 4500);
}
