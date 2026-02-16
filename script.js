document.addEventListener('DOMContentLoaded', () => {
    // ==================
    // DOM REFERENCES
    // ==================
    const toggleBtn = document.getElementById('toggle-sapa-btn');
    const systemStatusText = document.getElementById('system-status-text');
    const startSimBtn = document.getElementById('start-simulation-btn');
    const simulationSection = document.getElementById('simulasi');
    const insightText = document.getElementById('simulation-insight');
    const toggleLabel = document.querySelector('.toggle-label');
    const povScene = document.getElementById('pov-scene');
    const glassesOverlay = document.getElementById('glasses-overlay');
    const hudText = document.getElementById('glasses-hud-text');
    const povMessageOff = document.getElementById('pov-message-off');
    const povMessageOn = document.getElementById('pov-message-on');

    let isSapaActive = false;

    // ============================
    // POV SIMULATION (unchanged)
    // ============================
    const conversations = [
        { person: 1, text: "Permisi, kursi ini kosong?" },
        { person: 2, text: "Oh iya, silakan duduk." },
        { person: 1, text: "Terima kasih. Cuacanya panas ya." },
        { person: 3, text: "Iya, katanya 34 derajat hari ini." },
        { person: 2, text: "Mau pesan minum apa?" },
        { person: 1, text: "Es teh manis saja." },
        { person: 3, text: "Saya kopi hitam tanpa gula." },
        { person: 2, text: "Baik, tunggu sebentar ya." },
    ];

    const garbledTexts = ["···???···", "???···???", "··!!··??··", "???!!!???", "···!!···", "??···!!", "···???!!", "!!···???"];
    let currentConvIndex = 0;

    function setPersonTalking(personNum, isTalking) {
        const mouth = document.getElementById(`mouth-${personNum}`);
        const speech = document.getElementById(`speech-${personNum}`);
        if (isTalking) { mouth.classList.add('talking'); speech.classList.add('active'); }
        else { mouth.classList.remove('talking'); speech.classList.remove('active'); }
    }

    function resetAllPersons() {
        for (let i = 1; i <= 3; i++) {
            setPersonTalking(i, false);
            document.getElementById(`garbled-${i}`).classList.remove('active');
            document.getElementById(`clear-${i}`).classList.remove('active');
            document.getElementById(`clear-${i}`).classList.add('hidden');
        }
    }

    function playConversation() {
        const conv = conversations[currentConvIndex];
        resetAllPersons();
        setPersonTalking(conv.person, true);

        if (!isSapaActive) {
            const garbled = document.getElementById(`garbled-${conv.person}`);
            garbled.textContent = garbledTexts[currentConvIndex % garbledTexts.length];
            garbled.classList.add('active');
        } else {
            const clear = document.getElementById(`clear-${conv.person}`);
            clear.textContent = conv.text;
            clear.classList.remove('hidden');
            clear.classList.add('active');
            hudText.textContent = `"${conv.text}"`;
        }
        currentConvIndex = (currentConvIndex + 1) % conversations.length;
    }

    setInterval(playConversation, 3500);
    playConversation();

    setInterval(() => {
        document.querySelectorAll('.person-mouth.talking').forEach(mouth => {
            const isOpen = Math.random() > 0.4;
            mouth.style.height = isOpen ? '10px' : '4px';
            mouth.style.borderRadius = isOpen ? '50%' : '2px';
        });
    }, 200);

    // Toggle SAPA
    startSimBtn.addEventListener('click', () => simulationSection.scrollIntoView({ behavior: 'smooth' }));
    toggleBtn.addEventListener('click', () => toggleSapa(!isSapaActive));

    function toggleSapa(state) {
        isSapaActive = state;
        toggleBtn.setAttribute('aria-pressed', state);
        if (isSapaActive) {
            toggleLabel.textContent = "ON";
            povScene.classList.add('sapa-active');
            glassesOverlay.classList.remove('hidden');
            povMessageOff.classList.add('hidden');
            povMessageOn.classList.remove('hidden');
            systemStatusText.textContent = "👓 Kacamata SAPA Aktif";
            systemStatusText.style.color = "#105332";
            insightText.innerHTML = "✨ <strong>Dengan SAPA</strong>, setiap percakapan langsung diterjemahkan menjadi teks.";
            insightText.style.color = "#105332";
            for (let i = 1; i <= 3; i++) document.getElementById(`garbled-${i}`).classList.remove('active');
        } else {
            toggleLabel.textContent = "OFF";
            povScene.classList.remove('sapa-active');
            glassesOverlay.classList.add('hidden');
            povMessageOff.classList.remove('hidden');
            povMessageOn.classList.add('hidden');
            systemStatusText.textContent = "Mode: Tanpa Alat Bantu";
            systemStatusText.style.color = "#64748B";
            insightText.textContent = "Ini adalah pengalaman sehari-hari penyandang tunarungu. Aktifkan SAPA untuk melihat perbedaannya.";
            insightText.style.color = "#64748B";
            for (let i = 1; i <= 3; i++) {
                document.getElementById(`clear-${i}`).classList.add('hidden');
                document.getElementById(`clear-${i}`).classList.remove('active');
            }
            hudText.textContent = "Mendeteksi percakapan...";
        }
    }

    // ============================
    // LIP READING CHALLENGE
    // ============================
    const lipMouth = document.getElementById('lip-mouth');
    const speakingLabel = document.getElementById('speaking-label');
    const challengeOptions = document.getElementById('challenge-options');
    const challengeProgress = document.getElementById('challenge-progress');
    const challengeScore = document.getElementById('challenge-score');
    const challengeMessage = document.getElementById('challenge-message');
    const challengeQuestion = document.getElementById('challenge-question');
    const nextChallengeBtn = document.getElementById('next-challenge-btn');
    const replayBtn = document.getElementById('replay-btn');
    const vcSpeakerName = document.getElementById('vc-speaker-name');

    const challenges = [
        {
            word: "Halo",
            speaker: "Andi",
            options: ["Halo", "Bisa", "Mana", "Siapa"],
            // Mouth animation: H-a-l-o (open wide for 'a', narrow for 'l', round for 'o')
            mouthFrames: [
                { rx: 8, ry: 2 },   // H - slightly open
                { rx: 14, ry: 10 }, // a - wide open
                { rx: 10, ry: 4 },  // l - medium
                { rx: 12, ry: 9 },  // o - round
                { rx: 12, ry: 3 },  // closing
            ]
        },
        {
            word: "Terima kasih",
            speaker: "Budi",
            options: ["Terima kasih", "Selamat pagi", "Permisi ya", "Boleh minta"],
            mouthFrames: [
                { rx: 8, ry: 2 },   // T
                { rx: 12, ry: 6 },  // e
                { rx: 10, ry: 4 },  // ri
                { rx: 14, ry: 8 },  // ma
                { rx: 8, ry: 3 },   // (pause)
                { rx: 10, ry: 5 },  // ka
                { rx: 8, ry: 3 },   // si
                { rx: 14, ry: 7 },  // h
                { rx: 12, ry: 3 },  // closing
            ]
        },
        {
            word: "Apa kabar",
            speaker: "Citra",
            options: ["Apa kabar", "Ada apa", "Ayo pergi", "Aku lapar"],
            mouthFrames: [
                { rx: 14, ry: 10 }, // A - wide
                { rx: 8, ry: 3 },   // p
                { rx: 14, ry: 8 },  // a
                { rx: 8, ry: 2 },   // (pause)
                { rx: 10, ry: 5 },  // ka
                { rx: 8, ry: 3 },   // b
                { rx: 14, ry: 9 },  // a
                { rx: 10, ry: 4 },  // r
                { rx: 12, ry: 3 },  // closing
            ]
        },
        {
            word: "Tolong",
            speaker: "Dewi",
            options: ["Tolong", "Datang", "Pulang", "Duduk"],
            mouthFrames: [
                { rx: 8, ry: 2 },   // T
                { rx: 12, ry: 10 }, // o - round
                { rx: 10, ry: 4 },  // l
                { rx: 12, ry: 9 },  // o - round
                { rx: 8, ry: 4 },   // ng
                { rx: 12, ry: 3 },  // closing
            ]
        },
        {
            word: "Saya tidak mengerti",
            speaker: "Eko",
            options: ["Saya tidak mengerti", "Saya mau pergi", "Bisa bantu saya", "Dimana tempatnya"],
            mouthFrames: [
                { rx: 8, ry: 3 },   // Sa
                { rx: 14, ry: 8 },  // ya
                { rx: 8, ry: 2 },   // (pause)
                { rx: 8, ry: 3 },   // ti
                { rx: 10, ry: 5 },  // dak
                { rx: 8, ry: 2 },   // (pause)
                { rx: 10, ry: 5 },  // me
                { rx: 8, ry: 4 },   // nge
                { rx: 10, ry: 4 },  // r
                { rx: 8, ry: 3 },   // ti
                { rx: 12, ry: 3 },  // closing
            ]
        }
    ];

    let currentChallengeIdx = 0;
    let score = 0;
    let totalAnswered = 0;
    let mouthAnimTimer = null;
    let isAnimating = false;

    function animateMouth(frames, onComplete) {
        let frameIdx = 0;
        isAnimating = true;
        speakingLabel.textContent = "Sedang berbicara...";
        speakingLabel.classList.add('active');

        function nextFrame() {
            if (frameIdx >= frames.length) {
                // Reset mouth
                lipMouth.setAttribute('rx', '12');
                lipMouth.setAttribute('ry', '3');
                speakingLabel.textContent = "Selesai berbicara";
                speakingLabel.classList.remove('active');
                isAnimating = false;
                if (onComplete) onComplete();
                return;
            }

            const frame = frames[frameIdx];
            lipMouth.setAttribute('rx', frame.rx);
            lipMouth.setAttribute('ry', frame.ry);
            frameIdx++;

            mouthAnimTimer = setTimeout(nextFrame, 280);
        }

        nextFrame();
    }

    function loadChallenge(index) {
        const ch = challenges[index];

        // Reset UI
        challengeProgress.textContent = `Soal ${index + 1} dari ${challenges.length}`;
        challengeScore.textContent = `Skor: ${score} / ${totalAnswered}`;
        challengeMessage.textContent = "Perhatikan gerakan bibir, lalu tebak kata yang diucapkan.";
        challengeMessage.className = 'challenge-message';
        challengeQuestion.textContent = "Apa yang dia katakan?";
        nextChallengeBtn.classList.add('hidden');
        vcSpeakerName.textContent = ch.speaker;

        // Remove any SAPA reveal
        const existingReveal = document.querySelector('.sapa-reveal');
        if (existingReveal) existingReveal.remove();

        // Build options (shuffled)
        const shuffled = [...ch.options].sort(() => Math.random() - 0.5);
        challengeOptions.innerHTML = '';
        shuffled.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.addEventListener('click', () => handleAnswer(btn, option, ch));
            challengeOptions.appendChild(btn);
        });

        // Play mouth animation
        setTimeout(() => {
            animateMouth(ch.mouthFrames);
        }, 500);
    }

    function handleAnswer(btn, selected, challenge) {
        if (isAnimating) return; // Don't allow answering while animating

        // Disable all buttons
        challengeOptions.querySelectorAll('.option-btn').forEach(b => b.classList.add('disabled'));
        totalAnswered++;

        if (selected === challenge.word) {
            btn.classList.add('correct');
            score++;
            challengeMessage.textContent = `✅ Benar! Tapi ini sangat sulit tanpa suara, bukan?`;
            challengeMessage.className = 'challenge-message success';
        } else {
            btn.classList.add('wrong');
            // Highlight correct answer
            challengeOptions.querySelectorAll('.option-btn').forEach(b => {
                if (b.textContent === challenge.word) b.classList.add('correct');
            });
            challengeMessage.textContent = `❌ Salah! Membaca bibir memang sangat sulit — inilah mengapa SAPA dibutuhkan.`;
            challengeMessage.className = 'challenge-message fail';
        }

        challengeScore.textContent = `Skor: ${score} / ${totalAnswered}`;

        // Show SAPA reveal
        const reveal = document.createElement('div');
        reveal.className = 'sapa-reveal';
        reveal.innerHTML = `👓 SAPA: "${challenge.word}"`;
        challengeOptions.after(reveal);

        // Show next button
        if (currentChallengeIdx < challenges.length - 1) {
            nextChallengeBtn.classList.remove('hidden');
        } else {
            // Final message
            setTimeout(() => {
                challengeMessage.innerHTML = `🏆 Selesai! Skor: <strong>${score}/${challenges.length}</strong>.<br>Membaca bibir hanya menangkap ~30% informasi. SAPA mengisi sisanya secara real-time.`;
                challengeMessage.className = 'challenge-message success';
            }, 500);
        }
    }

    replayBtn.addEventListener('click', () => {
        if (isAnimating) return;
        const ch = challenges[currentChallengeIdx];
        animateMouth(ch.mouthFrames);
    });

    nextChallengeBtn.addEventListener('click', () => {
        currentChallengeIdx++;
        if (currentChallengeIdx < challenges.length) {
            loadChallenge(currentChallengeIdx);
        }
    });

    // Initialize first challenge
    loadChallenge(0);
});
