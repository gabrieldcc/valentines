const PORTAL_URL = "./portal-secreto/";

const questions = [
  {
    question: "Quem demora mais para escolher algo para comer?",
    options: ["Gabriel", "Gabriela"],
    feedback: "O castelo anotou: escolher a comida certa também é um gesto de grande sabedoria."
  },
  {
    question: "Quem é mais provável de dormir durante um filme?",
    options: ["Gabriel", "Gabriela"],
    feedback: "As velas encantadas já estão preparando um cobertor cinematográfico."
  },
  {
    question: "Qual a data em que começamos a namorar?",
    options: ["29/06/2013", "29/07/2013", "28/06/2013", "01/07/2013"],
    feedback: "A memória brilhou no salão principal. Essa data merece moldura dourada."
  },
  {
    question: "Quem costuma estar certo nas discussões?",
    options: ["Gabriel", "Gabriela", "Ninguém", "Gabriela (obviamente)"],
    feedback: "⚠️ O castelo informou que esta pergunta já foi revisada por especialistas."
  },
  {
    question: "Onde aconteceu nosso casamento?",
    options: ["Fazenda", "Resort", "Cruzeiro", "Praia"],
    feedback: "🚢 Memória desbloqueada: 15 de dezembro de 2025."
  },
  {
    question: "Quem fala mais durante um filme?",
    options: ["Gabriel", "Gabriela"],
    feedback: "Lumière confirmou que alguns comentários melhoram qualquer cena."
  },
  {
    question: "Quem sempre fala que está com fome primeiro?",
    options: ["Gabriel", "Gabriela"],
    feedback: "🍔 O castelo consegue ouvir o estômago dessa pessoa daqui."
  },
  {
    question: "Quem sempre fica distraído olhando para o teto no meio do filme?",
    options: ["Gabriel", "Gabriela"],
    feedback: "🎬 O Feiticeiro recomenda prestar atenção na história."
  },
  {
    question: "Quem se sente malandra dentro do carro ouvindo funk?",
    options: ["Gabriel", "Gabriela"],
    feedback: "🚗✨ Nível de malandragem detectado com sucesso."
  },
  {
    question: "Quem sempre se empolga ao comer algo muito bom e imediatamente coloca aquela comida no Top 1?",
    options: ["Gabriel", "Gabriela"],
    feedback: "🍝🏆 Novo Top 1 desbloqueado. Até a próxima refeição."
  }
];

const state = {
  currentQuestion: 0,
  petalsRecovered: 0,
  adventureStarted: false,
  audioStarted: false
};

const introCard = document.getElementById("intro-card");
const gameArea = document.getElementById("game-area");
const endingCard = document.getElementById("ending-card");
const startButton = document.getElementById("start-button");
const questionIndex = document.getElementById("question-index");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const feedbackText = document.getElementById("feedback-text");
const nextButton = document.getElementById("next-button");
const progressCount = document.getElementById("progress-count");
const petalMeter = document.getElementById("petal-meter");
const roseStage = document.getElementById("rose-stage");
const questionCard = document.getElementById("question-card");
const portalButton = document.getElementById("portal-button");
const sparklesLayer = document.querySelector(".sparkles");
const petalLayer = document.querySelector(".petal-layer");

portalButton.href = PORTAL_URL;

startButton.addEventListener("click", async () => {
  introCard.classList.add("hidden");
  gameArea.classList.remove("hidden");
  state.adventureStarted = true;
  spawnAmbientDecor();
  renderProgress();
  renderQuestion();

  if (!state.audioStarted) {
    try {
      await startAmbientMusic();
      state.audioStarted = true;
    } catch (error) {
      console.warn("Áudio não iniciado automaticamente.", error);
    }
  }
});

nextButton.addEventListener("click", () => {
  state.currentQuestion += 1;
  feedbackText.textContent = "";
  nextButton.classList.add("hidden");

  if (state.currentQuestion >= questions.length) {
    finishAdventure();
    return;
  }

  renderQuestion();
});

function renderQuestion() {
  const item = questions[state.currentQuestion];
  questionIndex.textContent = `Pergunta ${state.currentQuestion + 1} de ${questions.length}`;
  questionText.textContent = item.question;
  optionsContainer.innerHTML = "";
  questionCard.classList.remove("pulse");

  item.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.textContent = option;
    button.addEventListener("click", () => handleAnswer(button, item.feedback));
    optionsContainer.appendChild(button);
  });
}

function handleAnswer(selectedButton, feedback) {
  const optionButtons = Array.from(optionsContainer.querySelectorAll(".option-button"));
  optionButtons.forEach((button) => {
    button.disabled = true;
    button.classList.toggle("selected", button === selectedButton);
  });

  state.petalsRecovered += 1;
  renderProgress();
  feedbackText.textContent = feedback;
  nextButton.classList.remove("hidden");

  questionCard.classList.remove("pulse");
  void questionCard.offsetWidth;
  questionCard.classList.add("pulse");

  burstMagic();
}

function renderProgress() {
  const recovered = state.petalsRecovered;
  petalMeter.textContent = `${"🌹".repeat(recovered)}${"⚫".repeat(questions.length - recovered)}`;
  progressCount.textContent = String(recovered);
  roseStage.className = `rose-stage stage-${recovered}`;
}

function finishAdventure() {
  gameArea.classList.add("hidden");
  endingCard.classList.remove("hidden");
  burstMagic(true);
}

function spawnAmbientDecor() {
  if (sparklesLayer.childElementCount > 0 || petalLayer.childElementCount > 0) {
    return;
  }

  for (let index = 0; index < 18; index += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${10 + Math.random() * 85}%`;
    sparkle.style.animationDuration = `${3.6 + Math.random() * 4}s`;
    sparkle.style.animationDelay = `${Math.random() * 4}s`;
    sparklesLayer.appendChild(sparkle);
  }

  for (let index = 0; index < 10; index += 1) {
    const petal = document.createElement("span");
    petal.className = "floating-petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${9 + Math.random() * 7}s`;
    petal.style.animationDelay = `${Math.random() * 8}s`;
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;
    petalLayer.appendChild(petal);
  }
}

function burstMagic(isEnding = false) {
  const count = isEnding ? 18 : 8;

  for (let index = 0; index < count; index += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = `${35 + Math.random() * 30}%`;
    sparkle.style.top = `${35 + Math.random() * 20}%`;
    sparkle.style.animationDuration = `${1.8 + Math.random() * 1.6}s`;
    sparkle.style.width = `${4 + Math.random() * 6}px`;
    sparkle.style.height = sparkle.style.width;
    sparklesLayer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 2800);
  }
}

async function startAmbientMusic() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const audioContext = new AudioContextClass();

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  const masterGain = audioContext.createGain();
  masterGain.gain.value = 0.045;
  masterGain.connect(audioContext.destination);

  playPad(audioContext, masterGain, 220, 0);
  playPad(audioContext, masterGain, 293.66, 1.6);
  playPad(audioContext, masterGain, 246.94, 3.2);

  setInterval(() => {
    const now = audioContext.currentTime;
    playPad(audioContext, masterGain, 220, now);
    playPad(audioContext, masterGain, 293.66, now + 1.6);
    playPad(audioContext, masterGain, 246.94, now + 3.2);
  }, 4800);
}

function playPad(audioContext, destination, frequency, startTimeOffset) {
  const startAt =
    typeof startTimeOffset === "number" && startTimeOffset > audioContext.currentTime
      ? startTimeOffset
      : audioContext.currentTime + startTimeOffset;

  const oscillator = audioContext.createOscillator();
  const harmonic = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  oscillator.type = "sine";
  harmonic.type = "triangle";
  oscillator.frequency.value = frequency;
  harmonic.frequency.value = frequency * 1.5;

  filter.type = "lowpass";
  filter.frequency.value = 850;

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.linearRampToValueAtTime(0.075, startAt + 1.1);
  gain.gain.linearRampToValueAtTime(0.0001, startAt + 3.8);

  oscillator.connect(gain);
  harmonic.connect(gain);
  gain.connect(filter);
  filter.connect(destination);

  oscillator.start(startAt);
  harmonic.start(startAt);
  oscillator.stop(startAt + 4);
  harmonic.stop(startAt + 4);
}
