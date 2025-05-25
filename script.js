document.addEventListener('DOMContentLoaded', function() {
    // ===== GLOBAL VARIABLES =====
    const audioPlayers = {};
    const waveforms = {};
    let currentSection = 'intro';
    let currentUser = '1';

    // ===== AUDIO FILES CONFIGURATION =====
    const audioFiles = {
        // Original humming samples
        'humming1': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'humming2': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'user1': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'user2': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'user3': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        
        // Conversion results
        'midi1': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'midi2': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'user1-midi': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'user2-midi': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'user3-midi': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        
        // Ground truth MIDI files
        'ground-truth1': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'ground-truth2': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'user1-ground-truth': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'user2-ground-truth': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'user3-ground-truth': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3'
    };

    // ===== MIDI DATA FOR VISUALIZATION =====
    const midiData = {
        // Basic system demo
        'piano-roll-1': [
            { note: 60, start: 0, duration: 0.5, velocity: 80 },
            { note: 62, start: 0.5, duration: 0.5, velocity: 75 },
            { note: 64, start: 1, duration: 0.5, velocity: 85 },
            { note: 65, start: 1.5, duration: 0.5, velocity: 78 },
            { note: 67, start: 2, duration: 1, velocity: 90 },
            { note: 69, start: 3, duration: 1, velocity: 82 },
            { note: 71, start: 4, duration: 0.5, velocity: 88 },
            { note: 72, start: 4.5, duration: 1.5, velocity: 95 }
        ],
        'ground-truth-roll-1': [
            { note: 60, start: 0, duration: 0.5, velocity: 80 },
            { note: 62, start: 0.5, duration: 0.5, velocity: 80 },
            { note: 64, start: 1, duration: 0.5, velocity: 80 },
            { note: 65, start: 1.5, duration: 0.5, velocity: 80 },
            { note: 67, start: 2, duration: 1, velocity: 80 },
            { note: 69, start: 3, duration: 1, velocity: 80 },
            { note: 71, start: 4, duration: 0.5, velocity: 80 },
            { note: 72, start: 4.5, duration: 1.5, velocity: 80 }
        ],
        
        // Noisy environment demo
        'piano-roll-2': [
            { note: 62, start: 0, duration: 0.5, velocity: 70 },
            { note: 64, start: 0.5, duration: 0.5, velocity: 68 },
            { note: 65, start: 1, duration: 1, velocity: 75 },
            { note: 67, start: 2, duration: 0.5, velocity: 72 },
            { note: 69, start: 2.5, duration: 0.5, velocity: 78 },
            { note: 67, start: 3, duration: 1, velocity: 74 },
            { note: 65, start: 4, duration: 0.5, velocity: 71 },
            { note: 64, start: 4.5, duration: 0.5, velocity: 69 },
            { note: 62, start: 5, duration: 1, velocity: 73 }
        ],
        'ground-truth-roll-2': [
            { note: 62, start: 0, duration: 0.5, velocity: 80 },
            { note: 64, start: 0.5, duration: 0.5, velocity: 80 },
            { note: 65, start: 1, duration: 1, velocity: 80 },
            { note: 67, start: 2, duration: 0.5, velocity: 80 },
            { note: 69, start: 2.5, duration: 0.5, velocity: 80 },
            { note: 67, start: 3, duration: 1, velocity: 80 },
            { note: 65, start: 4, duration: 0.5, velocity: 80 },
            { note: 64, start: 4.5, duration: 0.5, velocity: 80 },
            { note: 62, start: 5, duration: 1, velocity: 80 }
        ],
        
        // User consistency tests
        'user1-piano-roll': [
            { note: 60, start: 0, duration: 0.5, velocity: 82 },
            { note: 62, start: 0.5, duration: 0.5, velocity: 79 },
            { note: 64, start: 1, duration: 0.5, velocity: 85 },
            { note: 65, start: 1.5, duration: 0.5, velocity: 81 },
            { note: 67, start: 2, duration: 1, velocity: 88 },
            { note: 69, start: 3, duration: 1, velocity: 84 }
        ],
        'user1-ground-truth-roll': [
            { note: 60, start: 0, duration: 0.5, velocity: 80 },
            { note: 62, start: 0.5, duration: 0.5, velocity: 80 },
            { note: 64, start: 1, duration: 0.5, velocity: 80 },
            { note: 65, start: 1.5, duration: 0.5, velocity: 80 },
            { note: 67, start: 2, duration: 1, velocity: 80 },
            { note: 69, start: 3, duration: 1, velocity: 80 }
        ],
        
        'user2-piano-roll': [
            { note: 60, start: 0, duration: 0.5, velocity: 76 },
            { note: 64, start: 0.5, duration: 0.5, velocity: 73 },
            { note: 67, start: 1, duration: 1, velocity: 79 },
            { note: 72, start: 2, duration: 1, velocity: 81 },
            { note: 71, start: 3, duration: 0.5, velocity: 77 }
        ],
        'user2-ground-truth-roll': [
            { note: 60, start: 0, duration: 0.5, velocity: 80 },
            { note: 64, start: 0.5, duration: 0.5, velocity: 80 },
            { note: 67, start: 1, duration: 1, velocity: 80 },
            { note: 72, start: 2, duration: 1, velocity: 80 },
            { note: 71, start: 3, duration: 0.5, velocity: 80 }
        ],
        
        'user3-piano-roll': [
            { note: 62, start: 0, duration: 0.5, velocity: 78 },
            { note: 65, start: 0.5, duration: 0.5, velocity: 75 },
            { note: 67, start: 1, duration: 1, velocity: 83 },
            { note: 69, start: 2, duration: 0.5, velocity: 80 },
            { note: 71, start: 2.5, duration: 0.5, velocity: 86 },
            { note: 72, start: 3, duration: 1, velocity: 89 }
        ],
        'user3-ground-truth-roll': [
            { note: 62, start: 0, duration: 0.5, velocity: 80 },
            { note: 65, start: 0.5, duration: 0.5, velocity: 80 },
            { note: 67, start: 1, duration: 1, velocity: 80 },
            { note: 69, start: 2, duration: 0.5, velocity: 80 },
            { note: 71, start: 2.5, duration: 0.5, velocity: 80 },
            { note: 72, start: 3, duration: 1, velocity: 80 }
        ]
    };

    // ===== INITIALIZATION =====
    init();

    function init() {
        setupNavigation();
        setupUserTabs();
        setupAudioPlayers();
        setupWaveforms();
        setupPianoRolls();
        setupAnimations();
        preloadAudio();
        
        console.log('🎵 Humming Sketch initialized successfully!');
    }

    // ===== NAVIGATION SYSTEM =====
    function setupNavigation() {
        const journeySteps = document.querySelectorAll('.journey-step');
        const contentSections = document.querySelectorAll('.content-section');
        const journeyNav = document.querySelector('.journey-nav');

        journeySteps.forEach(step => {
            step.addEventListener('click', () => {
                const targetStep = step.getAttribute('data-step');
                navigateToSection(targetStep);
            });
        });

        // Setup scroll indicator for mobile
        if (journeyNav) {
            setupScrollIndicator(journeyNav);
        }
    }

    function setupScrollIndicator(journeyNav) {
        function updateScrollIndicator() {
            const scrollLeft = journeyNav.scrollLeft;
            const scrollWidth = journeyNav.scrollWidth;
            const clientWidth = journeyNav.clientWidth;
            const maxScroll = scrollWidth - clientWidth;
            const isScrollable = scrollWidth > clientWidth;
            const isAtEnd = !isScrollable || scrollLeft >= maxScroll - 10; // 10px tolerance
            
            // Debug logging
            console.log('Scroll Debug:', {
                scrollLeft,
                scrollWidth,
                clientWidth,
                maxScroll,
                isScrollable,
                isAtEnd
            });
            
            if (isScrollable) {
                journeyNav.classList.add('scrollable');
                if (isAtEnd) {
                    journeyNav.classList.add('scroll-end');
                } else {
                    journeyNav.classList.remove('scroll-end');
                }
            } else {
                journeyNav.classList.remove('scrollable');
                journeyNav.classList.remove('scroll-end');
            }
        }

        // Check on scroll
        journeyNav.addEventListener('scroll', updateScrollIndicator);
        
        // Check on resize
        window.addEventListener('resize', () => {
            setTimeout(updateScrollIndicator, 200);
        });
        
        // Check when content loads
        window.addEventListener('load', () => {
            setTimeout(updateScrollIndicator, 500);
        });
        
        // Initial check with multiple attempts
        setTimeout(updateScrollIndicator, 100);
        setTimeout(updateScrollIndicator, 500);
        setTimeout(updateScrollIndicator, 1000);
    }

    function navigateToSection(sectionName) {
        // Update active step
        document.querySelectorAll('.journey-step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`[data-step="${sectionName}"]`).classList.add('active');

        // Update active section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');

        currentSection = sectionName;

        // Trigger section-specific animations
        triggerSectionAnimations(sectionName);
    }



    // ===== USER TABS SYSTEM =====
    function setupUserTabs() {
        const userTabs = document.querySelectorAll('.user-tab');
        const userContents = document.querySelectorAll('.user-content');

        userTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const userId = tab.getAttribute('data-user');
                switchUser(userId);
            });
        });
    }

    function switchUser(userId) {
        // Update active tab
        document.querySelectorAll('.user-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-user="${userId}"]`).classList.add('active');

        // Update active content
        document.querySelectorAll('.user-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`user-${userId}`).classList.add('active');

        currentUser = userId;

        // Reinitialize visualizations for the new user
        setTimeout(() => {
            initializeUserVisualizations(userId);
        }, 100);
    }

    // ===== AUDIO PLAYER SYSTEM =====
    function setupAudioPlayers() {
        const playButtons = document.querySelectorAll('.play-btn');
        
        playButtons.forEach(button => {
            button.addEventListener('click', function() {
                const audioId = this.getAttribute('data-audio');
                togglePlayPause(audioId, this);
            });
        });
    }

    function preloadAudio() {
        Object.keys(audioFiles).forEach(id => {
            const audio = new Audio();
            audio.src = audioFiles[id];
            audio.preload = 'metadata';
            audioPlayers[id] = audio;
            
            // Setup event listeners
            audio.addEventListener('ended', () => {
                resetButton(getButtonForAudio(id));
            });

            audio.addEventListener('timeupdate', () => {
                updateWaveformProgress(id, audio.currentTime / audio.duration);
            });
        });
        
        console.log('🎵 Audio files preloaded');
    }

    function togglePlayPause(audioId, button) {
        const audio = audioPlayers[audioId];
        if (!audio) return;

        if (audio.paused) {
            // Stop all other audio first
            stopAllOtherAudio(audioId);
            
            audio.play();
            button.classList.add('playing');
            button.innerHTML = '<i class="fas fa-pause"></i>';
            
            // Add visual feedback
            addPlayingEffect(button);
        } else {
            audio.pause();
            button.classList.remove('playing');
            button.innerHTML = '<i class="fas fa-play"></i>';
            removePlayingEffect(button);
        }
    }

    function stopAllOtherAudio(currentAudioId) {
        Object.keys(audioPlayers).forEach(audioId => {
            if (audioId !== currentAudioId) {
                const audio = audioPlayers[audioId];
                if (!audio.paused) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            }
        });

        // Reset all other buttons
        document.querySelectorAll('.play-btn').forEach(button => {
            const buttonAudioId = button.getAttribute('data-audio');
            if (buttonAudioId !== currentAudioId) {
                resetButton(button);
            }
        });
    }

    function stopAllAudio() {
        Object.values(audioPlayers).forEach(audio => {
            if (!audio.paused) {
                audio.pause();
                audio.currentTime = 0;
            }
        });

        // Reset all buttons
        document.querySelectorAll('.play-btn').forEach(button => {
            resetButton(button);
        });
    }

    function resetButton(button) {
        if (!button) return;
        
        button.classList.remove('playing');
        button.innerHTML = '<i class="fas fa-play"></i>';
        removePlayingEffect(button);
    }

    function getButtonForAudio(audioId) {
        return document.querySelector(`[data-audio="${audioId}"]`);
    }

    function addPlayingEffect(button) {
        button.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
    }

    function removePlayingEffect(button) {
        button.style.boxShadow = '';
    }

    // ===== WAVEFORM VISUALIZATION =====
    function setupWaveforms() {
        const waveformContainers = [
            'humming-wave-1', 'humming-wave-2',
            'user-wave-1', 'user-wave-2', 'user-wave-3'
        ];

        waveformContainers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                initWaveform(containerId);
            }
        });
    }

    function initWaveform(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create mock waveform visualization
        createMockWaveform(container);
    }

    function createMockWaveform(container) {
        container.innerHTML = '';
        
        const waveformData = generateWaveformData(100);
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth || 300;
        canvas.height = container.offsetHeight || 60;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        const ctx = canvas.getContext('2d');
        drawWaveform(ctx, waveformData, canvas.width, canvas.height);
        
        container.appendChild(canvas);
    }

    function generateWaveformData(points) {
        const data = [];
        for (let i = 0; i < points; i++) {
            const amplitude = Math.sin(i * 0.1) * Math.random() * 0.8 + 0.2;
            data.push(amplitude);
        }
        return data;
    }

    function drawWaveform(ctx, data, width, height) {
        const barWidth = width / data.length;
        const centerY = height / 2;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#00d4ff');
        gradient.addColorStop(0.5, '#8b5cf6');
        gradient.addColorStop(1, '#f472b6');
        
        ctx.fillStyle = gradient;
        
        data.forEach((amplitude, index) => {
            const barHeight = amplitude * centerY;
            const x = index * barWidth;
            
            // Draw bar
            ctx.fillRect(x, centerY - barHeight, barWidth - 1, barHeight * 2);
        });
    }

    function updateWaveformProgress(audioId, progress) {
        // Update waveform progress visualization
        const containerId = getWaveformContainerForAudio(audioId);
        if (containerId) {
            updateWaveformProgressBar(containerId, progress);
        }
    }

    function getWaveformContainerForAudio(audioId) {
        const mapping = {
            'humming1': 'humming-wave-1',
            'humming2': 'humming-wave-2',
            'user1': 'user-wave-1',
            'user2': 'user-wave-2',
            'user3': 'user-wave-3'
        };
        return mapping[audioId];
    }

    function updateWaveformProgressBar(containerId, progress) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Add progress overlay
        let progressBar = container.querySelector('.progress-overlay');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'progress-overlay';
            progressBar.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                background: rgba(0, 212, 255, 0.3);
                pointer-events: none;
                transition: width 0.1s ease;
            `;
            container.appendChild(progressBar);
        }
        
        progressBar.style.width = `${progress * 100}%`;
    }

    // ===== PIANO ROLL VISUALIZATION =====
    function setupPianoRolls() {
        Object.keys(midiData).forEach(rollId => {
            const container = document.getElementById(rollId);
            if (container) {
                renderPianoRoll(rollId, midiData[rollId]);
            }
        });
    }

    function renderPianoRoll(containerId, notes) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth || 300;
        canvas.height = container.offsetHeight || 60;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        const ctx = canvas.getContext('2d');
        drawPianoRoll(ctx, notes, canvas.width, canvas.height);
        
        container.appendChild(canvas);
    }

    function drawPianoRoll(ctx, notes, width, height) {
        if (!notes || notes.length === 0) return;
        
        // Find note range
        const minNote = Math.min(...notes.map(n => n.note));
        const maxNote = Math.max(...notes.map(n => n.note));
        const noteRange = maxNote - minNote + 1;
        
        // Find time range
        const maxTime = Math.max(...notes.map(n => n.start + n.duration));
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#00d4ff');
        gradient.addColorStop(0.5, '#8b5cf6');
        gradient.addColorStop(1, '#f472b6');
        
        notes.forEach(note => {
            const x = (note.start / maxTime) * width;
            const noteWidth = (note.duration / maxTime) * width;
            const y = ((maxNote - note.note) / noteRange) * height;
            const noteHeight = height / noteRange;
            
            // Set opacity based on velocity
            const opacity = (note.velocity || 80) / 127;
            ctx.globalAlpha = opacity;
            ctx.fillStyle = gradient;
            
            // Draw note rectangle
            ctx.fillRect(x, y, noteWidth, noteHeight);
            
            // Add border
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, noteWidth, noteHeight);
        });
    }

    function initializeUserVisualizations(userId) {
        // Reinitialize waveforms and piano rolls for the selected user
        const waveformId = `user-wave-${userId}`;
        const pianoRollId = `user${userId}-piano-roll`;
        const groundTruthId = `user${userId}-ground-truth-roll`;
        
        if (document.getElementById(waveformId)) {
            initWaveform(waveformId);
        }
        
        if (midiData[pianoRollId]) {
            renderPianoRoll(pianoRollId, midiData[pianoRollId]);
        }
        
        if (midiData[groundTruthId]) {
            renderPianoRoll(groundTruthId, midiData[groundTruthId]);
        }
    }

    // ===== ANIMATIONS AND EFFECTS =====
    function setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe animated elements
        document.querySelectorAll('.neon-card, .demo-card, .process-step').forEach(el => {
            observer.observe(el);
        });

        // Add CSS for animations
        addAnimationStyles();
    }

    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                animation: slideInUp 0.6s ease forwards;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .progress-overlay {
                z-index: 10;
            }
        `;
        document.head.appendChild(style);
    }

    function triggerSectionAnimations(sectionName) {
        const section = document.getElementById(`${sectionName}-section`);
        if (!section) return;

        // Trigger specific animations based on section
        switch (sectionName) {
            case 'intro':
                animateFeatureCards();
                break;
            case 'process':
                animateProcessSteps();
                break;
            case 'demo':
                animateDemoCards();
                break;
            case 'accuracy':
                animateCharts();
                break;
        }
    }

    function animateFeatureCards() {
        const cards = document.querySelectorAll('.neon-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'slideInUp 0.6s ease forwards';
            }, index * 200);
        });
    }

    function animateProcessSteps() {
        const steps = document.querySelectorAll('.process-step');
        steps.forEach((step, index) => {
            setTimeout(() => {
                step.style.animation = 'slideInUp 0.6s ease forwards';
            }, index * 300);
        });
    }

    function animateDemoCards() {
        const cards = document.querySelectorAll('.demo-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'slideInUp 0.6s ease forwards';
            }, index * 400);
        });
    }

    function animateCharts() {
        const chartFills = document.querySelectorAll('.chart-fill, .metric-fill');
        chartFills.forEach((fill, index) => {
            setTimeout(() => {
                const width = fill.style.width;
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = width;
                }, 100);
            }, index * 200);
        });
    }

    // ===== ACCURACY COMPARISON SYSTEM =====
    function calculateAccuracy(convertedNotes, groundTruthNotes) {
        if (!convertedNotes || !groundTruthNotes) return { pitch: 0, timing: 0, duration: 0 };

        let pitchMatches = 0;
        let timingMatches = 0;
        let durationMatches = 0;
        const tolerance = 0.1; // 100ms tolerance

        convertedNotes.forEach(convertedNote => {
            const matchingNote = groundTruthNotes.find(gtNote => 
                Math.abs(gtNote.start - convertedNote.start) <= tolerance
            );

            if (matchingNote) {
                // Check pitch accuracy
                if (matchingNote.note === convertedNote.note) {
                    pitchMatches++;
                }

                // Check timing accuracy
                if (Math.abs(matchingNote.start - convertedNote.start) <= tolerance) {
                    timingMatches++;
                }

                // Check duration accuracy
                if (Math.abs(matchingNote.duration - convertedNote.duration) <= tolerance) {
                    durationMatches++;
                }
            }
        });

        const totalNotes = Math.max(convertedNotes.length, groundTruthNotes.length);
        
        return {
            pitch: Math.round((pitchMatches / totalNotes) * 100),
            timing: Math.round((timingMatches / totalNotes) * 100),
            duration: Math.round((durationMatches / totalNotes) * 100)
        };
    }

    function updateAccuracyDisplay(containerId, accuracy) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const pitchBar = container.querySelector('.metric-fill[data-metric="pitch"]');
        const timingBar = container.querySelector('.metric-fill[data-metric="timing"]');
        const durationBar = container.querySelector('.metric-fill[data-metric="duration"]');

        if (pitchBar) {
            pitchBar.style.width = `${accuracy.pitch}%`;
            pitchBar.nextElementSibling.textContent = `${accuracy.pitch}%`;
        }

        if (timingBar) {
            timingBar.style.width = `${accuracy.timing}%`;
            timingBar.nextElementSibling.textContent = `${accuracy.timing}%`;
        }

        if (durationBar) {
            durationBar.style.width = `${accuracy.duration}%`;
            durationBar.nextElementSibling.textContent = `${accuracy.duration}%`;
        }
    }

    // ===== RESPONSIVE UTILITIES =====
    function handleResize() {
        // Redraw visualizations on resize
        setTimeout(() => {
            setupWaveforms();
            setupPianoRolls();
        }, 100);
    }

    // ===== EMAIL FUNCTIONALITY =====
    function setupEmailLink() {
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (emailLink) {
            emailLink.addEventListener('click', function(e) {
                const email = 'pillaret20@ajou.ac.kr';
                const subject = 'Humming Sketch 문의';
                const body = '안녕하세요,\n\nHumming Sketch 프로젝트에 대해 문의드립니다.\n\n';
                
                // Try mailto first
                const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                // Fallback: copy email to clipboard if mailto fails
                setTimeout(() => {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(email).then(() => {
                            showEmailNotification('이메일 주소가 클립보드에 복사되었습니다: ' + email);
                        }).catch(() => {
                            showEmailNotification('이메일 주소: ' + email);
                        });
                    } else {
                        showEmailNotification('이메일 주소: ' + email);
                    }
                }, 100);
            });
        }
    }

    function showEmailNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'email-notification';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            background: var(--bg-card);
            color: var(--text-primary);
            padding: 1.5rem 2rem;
            border-radius: var(--radius-lg);
            border: 1px solid var(--neon-blue);
            box-shadow: var(--shadow-neon), 0 20px 40px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-size: 1rem;
            max-width: 400px;
            backdrop-filter: var(--blur-glass);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            text-align: center;
            font-weight: 500;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Remove after 3 seconds with animation
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // ===== EVENT LISTENERS =====
    window.addEventListener('resize', handleResize);
    
    // Setup email functionality
    setupEmailLink();

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const steps = ['intro', 'process', 'demo', 'accuracy'];
            const currentIndex = steps.indexOf(currentSection);
            
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                navigateToSection(steps[currentIndex - 1]);
            } else if (e.key === 'ArrowRight' && currentIndex < steps.length - 1) {
                navigateToSection(steps[currentIndex + 1]);
            }
        }
        
        // Space bar to play/pause
        if (e.code === 'Space') {
            e.preventDefault();
            const playingButton = document.querySelector('.play-btn.playing');
            if (playingButton) {
                playingButton.click();
            }
        }
    });

    // ===== UTILITY FUNCTIONS =====
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===== PERFORMANCE MONITORING =====
    function logPerformance() {
        if (performance.mark) {
            performance.mark('humming-sketch-loaded');
            console.log('🎵 Performance: App loaded in', performance.now(), 'ms');
        }
    }

    // Call performance logging
    logPerformance();

    // ===== EXPORT FOR DEBUGGING =====
    window.HummingSketch = {
        navigateToSection,
        switchUser,
        togglePlayPause,
        calculateAccuracy,
        audioPlayers,
        midiData,
        currentSection,
        currentUser
    };
}); 