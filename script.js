const relationshipStart = new Date(2013, 5, 29, 0, 0, 0);
const storySection = document.getElementById("historia");
const startStoryButton = document.getElementById("start-story");
const openLetterButton = document.getElementById("open-letter");
const letterContent = document.getElementById("letter-content");
const petalLayer = document.querySelector(".petal-layer");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");
const backgroundAudio = document.getElementById("background-audio");
const revealItems = document.querySelectorAll(".reveal");
const photoCards = document.querySelectorAll(".photo-card");

let petalIntervalId = null;
let audioUnlocked = false;

function pad(value) {
  return String(value).padStart(2, "0");
}

function addMonths(date, months) {
  const result = new Date(date);
  const originalDay = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDayOfMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();
  result.setDate(Math.min(originalDay, lastDayOfMonth));
  return result;
}

function updateCounter() {
  const now = new Date();
  const elapsedMs = now.getTime() - relationshipStart.getTime();

  let cursor = new Date(relationshipStart);
  let years = now.getFullYear() - cursor.getFullYear();

  if (
    now.getMonth() < cursor.getMonth() ||
    (now.getMonth() === cursor.getMonth() && now.getDate() < cursor.getDate())
  ) {
    years -= 1;
  }

  cursor = addMonths(cursor, years * 12);

  let months =
    now.getMonth() -
    cursor.getMonth() +
    (now.getFullYear() - cursor.getFullYear()) * 12;

  if (now.getDate() < cursor.getDate()) {
    months -= 1;
  }

  cursor = addMonths(cursor, months);

  let remainder = now.getTime() - cursor.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const hourMs = 60 * 60 * 1000;
  const minuteMs = 60 * 1000;
  const totalDays = Math.floor(elapsedMs / dayMs);
  const totalMinutes = Math.floor(elapsedMs / minuteMs);
  const totalSeconds = Math.floor(elapsedMs / 1000);

  const days = Math.floor(remainder / dayMs);
  remainder -= days * dayMs;

  const hours = Math.floor(remainder / hourMs);
  remainder -= hours * hourMs;

  const minutes = Math.floor(remainder / minuteMs);
  remainder -= minutes * minuteMs;

  const seconds = Math.floor(remainder / 1000);

  document.getElementById("years").textContent = pad(years);
  document.getElementById("months").textContent = pad(months);
  document.getElementById("days").textContent = pad(days);
  document.getElementById("hours").textContent = pad(hours);
  document.getElementById("minutes").textContent = pad(minutes);
  document.getElementById("seconds").textContent = pad(seconds);
  document.getElementById("total-days").textContent =
    totalDays.toLocaleString("pt-BR");
  document.getElementById("total-minutes").textContent =
    totalMinutes.toLocaleString("pt-BR");
  document.getElementById("total-seconds").textContent =
    totalSeconds.toLocaleString("pt-BR");
}

function handleReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function createPetal() {
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.animationDuration = `${7 + Math.random() * 6}s`;
  petal.style.opacity = `${0.35 + Math.random() * 0.5}`;
  petal.style.setProperty("--drift", `${-40 + Math.random() * 80}px`);
  petal.style.transform = `scale(${0.7 + Math.random() * 0.8})`;
  petalLayer.appendChild(petal);

  petal.addEventListener("animationend", () => {
    petal.remove();
  });
}

function startPetals() {
  for (let i = 0; i < 14; i += 1) {
    window.setTimeout(createPetal, i * 260);
  }

  petalIntervalId = window.setInterval(createPetal, 900);
}

function stopPetals() {
  if (petalIntervalId) {
    window.clearInterval(petalIntervalId);
  }
}

function openLightbox(imageSrc, altText, caption) {
  lightboxImage.src = imageSrc;
  lightboxImage.alt = altText;
  lightboxCaption.textContent = caption;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

function attachGalleryEvents() {
  photoCards.forEach((card) => {
    card.addEventListener("click", () => {
      const image = card.dataset.image;
      const caption = card.dataset.caption || "";
      const altText = card.querySelector("img")?.alt || "Foto do casal";
      openLightbox(image, altText, caption);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-close-lightbox")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

function revealLetter() {
  const isHidden = letterContent.hasAttribute("hidden");

  if (isHidden) {
    letterContent.removeAttribute("hidden");
    openLetterButton.textContent = "Fechar minha carta";
    letterContent.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  letterContent.setAttribute("hidden", "");
  openLetterButton.textContent = "Abrir minha carta para voce";
}

function updateMusicStatus(message) {
  const musicStatus = document.getElementById("music-status");
  if (musicStatus) {
    musicStatus.textContent = message;
  }
}

async function tryPlayAudio() {
  if (!backgroundAudio) {
    return false;
  }

  try {
    await backgroundAudio.play();
    audioUnlocked = true;
    updateMusicStatus("Tocando agora");
    return true;
  } catch {
    updateMusicStatus("Toque em qualquer lugar para iniciar a musica");
    return false;
  }
}

function setupAudioAutoplayFallback() {
  const unlockAudio = async () => {
    if (audioUnlocked) {
      return;
    }

    const started = await tryPlayAudio();

    if (started) {
      document.removeEventListener("pointerdown", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    }
  };

  document.addEventListener("pointerdown", unlockAudio);
  document.addEventListener("keydown", unlockAudio);
}

function setupEvents() {
  startStoryButton.addEventListener("click", () => {
    storySection.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  openLetterButton.addEventListener("click", revealLetter);
}

function setupMusic() {
  if (!backgroundAudio) {
    return;
  }

  backgroundAudio.volume = 0.85;
  backgroundAudio.addEventListener("playing", () => {
    audioUnlocked = true;
    updateMusicStatus("Tocando agora");
  });
  backgroundAudio.addEventListener("pause", () => {
    if (!backgroundAudio.ended) {
      updateMusicStatus("Musica pausada");
    }
  });
  backgroundAudio.addEventListener("ended", () => {
    updateMusicStatus("Reiniciando nossa musica...");
  });

  tryPlayAudio();
  setupAudioAutoplayFallback();
}

updateCounter();
window.setInterval(updateCounter, 1000);
handleReveal();
startPetals();
attachGalleryEvents();
setupEvents();
setupMusic();

window.addEventListener("beforeunload", stopPetals);
