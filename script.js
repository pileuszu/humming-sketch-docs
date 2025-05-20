document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Audio file paths - these are sample paths, replace with actual files
    const audioFiles = {
        // Sample humming files
        'humming1': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'humming2': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'user1': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'user2': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'user3': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        
        // Sample MIDI results
        'midi1': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',   
        'midi2': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'user1-midi': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'user2-midi': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3',
        'user3-midi': 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3?filename=piano-moment-9835.mp3'
    };

    // MIDI data for visualization - these would be the actual MIDI note data from your system
    const midiData = {
        'piano-roll-1': [
            { note: 60, start: 0, duration: 0.5 },   // C4
            { note: 62, start: 0.5, duration: 0.5 },  // D4
            { note: 64, start: 1, duration: 0.5 },    // E4
            { note: 65, start: 1.5, duration: 0.5 },  // F4
            { note: 67, start: 2, duration: 1 },      // G4
            { note: 69, start: 3, duration: 1 },      // A4
            { note: 71, start: 4, duration: 0.5 },    // B4
            { note: 72, start: 4.5, duration: 1.5 }   // C5
        ],
        'piano-roll-2': [
            { note: 62, start: 0, duration: 0.5 },    // D4
            { note: 64, start: 0.5, duration: 0.5 },  // E4
            { note: 65, start: 1, duration: 1 },      // F4
            { note: 67, start: 2, duration: 0.5 },    // G4
            { note: 69, start: 2.5, duration: 0.5 },  // A4
            { note: 67, start: 3, duration: 1 },      // G4
            { note: 65, start: 4, duration: 0.5 },    // F4
            { note: 64, start: 4.5, duration: 0.5 },  // E4
            { note: 62, start: 5, duration: 1 }       // D4
        ],
        'user1-piano-roll': [
            { note: 60, start: 0, duration: 0.5 },    // C4
            { note: 62, start: 0.5, duration: 0.5 },  // D4
            { note: 64, start: 1, duration: 0.5 },    // E4
            { note: 65, start: 1.5, duration: 0.5 },  // F4
            { note: 67, start: 2, duration: 1 },      // G4
            { note: 69, start: 3, duration: 1 },      // A4
        ],
        'user2-piano-roll': [
            { note: 60, start: 0, duration: 0.5 },    // C4
            { note: 64, start: 0.5, duration: 0.5 },  // E4
            { note: 67, start: 1, duration: 1 },      // G4
            { note: 72, start: 2, duration: 1 },      // C5
            { note: 71, start: 3, duration: 0.5 },    // B4
        ],
        'user3-piano-roll': [
            { note: 62, start: 0, duration: 0.5 },    // D4
            { note: 65, start: 0.5, duration: 0.5 },  // F4
            { note: 67, start: 1, duration: 1 },      // G4
            { note: 69, start: 2, duration: 0.5 },    // A4
            { note: 71, start: 2.5, duration: 0.5 },  // B4
            { note: 72, start: 3, duration: 1 },      // C5
        ]
    };
    
    // Audio players for each audio
    const audioPlayers = {};

    // Initialize wavesurfer instances for audio visualization
    const waveforms = {};
    
    // Create waveform for each humming audio
    initWaveform('humming-waveform-1', audioFiles.humming1);
    initWaveform('humming-waveform-2', audioFiles.humming2);
    initWaveform('user-waveform-1', audioFiles.user1);
    initWaveform('user-waveform-2', audioFiles.user2);
    initWaveform('user-waveform-3', audioFiles.user3);

    // Initialize piano rolls for MIDI visualization
    renderPianoRoll('piano-roll-1', midiData['piano-roll-1']);
    renderPianoRoll('piano-roll-2', midiData['piano-roll-2']);
    renderPianoRoll('user1-piano-roll', midiData['user1-piano-roll']);
    renderPianoRoll('user2-piano-roll', midiData['user2-piano-roll']);
    renderPianoRoll('user3-piano-roll', midiData['user3-piano-roll']);

    // Set up play buttons
    const playButtons = document.querySelectorAll('.play-button');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const audioId = this.getAttribute('data-audio');
            togglePlayPause(audioId, this);
        });
    });

    // Preload audio files
    function preloadAudio() {
        Object.keys(audioFiles).forEach(id => {
            const audio = new Audio();
            audio.src = audioFiles[id];
            audioPlayers[id] = audio;
            
            // When audio ends, reset button
            audio.onended = function() {
                playButtons.forEach(btn => {
                    if (btn.getAttribute('data-audio') === id) {
                        resetButton(btn);
                    }
                });
            };
        });
        console.log('Audio files preloaded');
    }
    
    // Call preload function
    preloadAudio();

    // Function to initialize waveform visualization
    function initWaveform(id, audioSrc) {
        const container = document.getElementById(id);
        
        if (!container) return;

        // Add grid lines first
        addGridLinesToWaveform(id);
        
        waveforms[id] = WaveSurfer.create({
            container: '#' + id,
            waveColor: 'rgba(66, 133, 244, 0.8)',
            progressColor: 'rgba(30, 64, 175, 0.9)',
            cursorColor: '#4285f4',
            barWidth: 1.5,
            barRadius: 2,
            cursorWidth: 0,
            height: 60,
            barGap: 1,
            responsive: true,
            normalize: true,
            fillParent: true,
            minPxPerSec: 25,  // Reduced to make the waveform more compact
            align: 'center',
            mediaControls: false,
            backend: 'WebAudio',
            interact: false,
            autoCenter: true,
            partialRender: true,
            scrollParent: false,  // Prevent scrolling
            pixelRatio: 1,  // Optimize rendering
        });
        
        waveforms[id].load(audioSrc);

        // Ensure waveform container is above grid and fits within box
        const waveformWrapper = container.querySelector('wave');
        if (waveformWrapper) {
            waveformWrapper.style.position = 'relative';
            waveformWrapper.style.zIndex = '20';
            waveformWrapper.style.width = '100%';
            waveformWrapper.style.overflow = 'hidden';
        }

        // Also ensure the canvas is above grid and fits
        const canvas = container.querySelector('canvas');
        if (canvas) {
            canvas.style.position = 'relative';
            canvas.style.zIndex = '20';
            canvas.style.width = '100%';
            canvas.style.maxWidth = '100%';
        }
        
        // Add waveform progress update to match audio player
        const relatedAudioId = getAudioIdFromWaveformId(id);
        if (relatedAudioId && audioPlayers[relatedAudioId]) {
            const audioPlayer = audioPlayers[relatedAudioId];
            
            audioPlayer.addEventListener('timeupdate', function() {
                const progress = audioPlayer.currentTime / audioPlayer.duration;
                if (!isNaN(progress)) {
                    waveforms[id].seekTo(progress);
                }
            });
        }
    }
    
    // Add visual grid lines to waveform for better alignment
    function addGridLinesToWaveform(id) {
        const container = document.getElementById(id);
        if (!container) return;
        
        // Create grid line overlay
        const gridOverlay = document.createElement('div');
        gridOverlay.className = 'grid-overlay';
        gridOverlay.style.position = 'absolute';
        gridOverlay.style.top = '0';
        gridOverlay.style.left = '0';
        gridOverlay.style.width = '100%';
        gridOverlay.style.height = '100%';
        gridOverlay.style.pointerEvents = 'none';
        gridOverlay.style.zIndex = '1';
        
        // Create vertical centerline
        const vLine = document.createElement('div');
        vLine.style.position = 'absolute';
        vLine.style.top = '0';
        vLine.style.left = '50%';
        vLine.style.width = '1px';
        vLine.style.height = '100%';
        vLine.style.backgroundColor = 'rgba(66, 133, 244, 0.2)';
        
        // Create horizontal centerline
        const hLine = document.createElement('div');
        hLine.style.position = 'absolute';
        hLine.style.top = '50%';
        hLine.style.left = '0';
        hLine.style.width = '100%';
        hLine.style.height = '1px';
        hLine.style.backgroundColor = 'rgba(66, 133, 244, 0.2)';
        
        gridOverlay.appendChild(vLine);
        gridOverlay.appendChild(hLine);
        container.appendChild(gridOverlay);

        // Ensure container has relative positioning
        container.style.position = 'relative';
    }
    
    // Get audio ID from waveform ID
    function getAudioIdFromWaveformId(waveformId) {
        if (waveformId === 'humming-waveform-1') return 'humming1';
        if (waveformId === 'humming-waveform-2') return 'humming2';
        if (waveformId === 'user-waveform-1') return 'user1';
        if (waveformId === 'user-waveform-2') return 'user2';
        if (waveformId === 'user-waveform-3') return 'user3';
        return null;
    }

    // Function to toggle play/pause
    function togglePlayPause(audioId, button) {
        // Check if audio player exists for this audio
        if (!audioPlayers[audioId]) {
            console.error(`No audio player found for ID: ${audioId}`);
            return;
        }
        
        // Check if this audio is already playing
        if (audioPlayers[audioId].paused) {
            // Pause all other audio first
            Object.keys(audioPlayers).forEach(id => {
                if (id !== audioId && !audioPlayers[id].paused) {
                    audioPlayers[id].pause();
                    // Reset corresponding button
                    resetOtherButtons(id);
                }
            });
            
            // Play this audio
            audioPlayers[audioId].play().catch(error => {
                console.error('Audio playback failed:', error);
                alert('오디오 재생에 문제가 발생했습니다. 다시 시도해 주세요.');
            });
            button.innerHTML = '<i class="fas fa-pause"></i>';
            button.classList.add('playing');
        } else {
            // Pause this audio
            audioPlayers[audioId].pause();
            resetButton(button);
        }
    }
    
    // Reset button to play state
    function resetButton(button) {
        button.innerHTML = '<i class="fas fa-play"></i>';
        button.classList.remove('playing');
    }
    
    // Reset other buttons based on audioId
    function resetOtherButtons(audioId) {
        playButtons.forEach(btn => {
            if (btn.getAttribute('data-audio') === audioId) {
                resetButton(btn);
            }
        });
    }

    // Function to render piano roll visualization
    function renderPianoRoll(id, notes) {
        const container = document.getElementById(id);
        if (!container) return;
        
        // Clear existing content
        container.innerHTML = '';
        
        // Add grid overlay
        addGridLinesToContainer(container);
        
        // Find the range of notes for scaling
        let minNote = 127, maxNote = 0;
        notes.forEach(note => {
            minNote = Math.min(minNote, note.note);
            maxNote = Math.max(maxNote, note.note);
        });
        
        // Add some padding to the range
        minNote = Math.max(0, minNote - 2);
        maxNote = Math.min(127, maxNote + 2);
        const noteRange = maxNote - minNote + 1;
        
        // Find max duration for scaling
        let maxDuration = 0;
        notes.forEach(note => {
            maxDuration = Math.max(maxDuration, note.start + note.duration);
        });
        
        // Center notes horizontally if there's extra space
        const totalWidth = maxDuration / 8; // scale factor
        let leftOffset = 0;
        if (totalWidth < 1) {
            leftOffset = (1 - totalWidth) / 2 * 100;
        }
        
        // Draw the notes
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'midi-note';
            
            // Position the note
            const top = ((maxNote - note.note) / noteRange) * 100;
            const left = (note.start / maxDuration) * 100;
            const width = (note.duration / maxDuration) * 100;
            
            noteElement.style.position = 'absolute';
            noteElement.style.top = top + '%';
            noteElement.style.left = (leftOffset + left) + '%';
            noteElement.style.width = width + '%';
            noteElement.style.height = (1 / noteRange) * 100 + '%';
            noteElement.style.backgroundColor = getColorForNote(note.note);
            noteElement.style.borderRadius = '3px';
            noteElement.style.zIndex = '2';
            
            container.appendChild(noteElement);
        });
    }
    
    // Add grid lines to any container
    function addGridLinesToContainer(container) {
        // Create grid line overlay
        const gridOverlay = document.createElement('div');
        gridOverlay.className = 'grid-overlay';
        gridOverlay.style.position = 'absolute';
        gridOverlay.style.top = '0';
        gridOverlay.style.left = '0';
        gridOverlay.style.width = '100%';
        gridOverlay.style.height = '100%';
        gridOverlay.style.pointerEvents = 'none';
        gridOverlay.style.zIndex = '1';
        
        // Create vertical centerline
        const vLine = document.createElement('div');
        vLine.style.position = 'absolute';
        vLine.style.top = '0';
        vLine.style.left = '50%';
        vLine.style.width = '1px';
        vLine.style.height = '100%';
        vLine.style.backgroundColor = 'rgba(66, 133, 244, 0.2)';
        
        // Create horizontal centerline
        const hLine = document.createElement('div');
        hLine.style.position = 'absolute';
        hLine.style.top = '50%';
        hLine.style.left = '0';
        hLine.style.width = '100%';
        hLine.style.height = '1px';
        hLine.style.backgroundColor = 'rgba(66, 133, 244, 0.2)';
        
        gridOverlay.appendChild(vLine);
        gridOverlay.appendChild(hLine);
        container.appendChild(gridOverlay);
    }
    
    // Generate a color based on the note value
    function getColorForNote(note) {
        // Map MIDI note to a hue value (0-360)
        const hue = (note % 12) * 30;
        return `hsl(${hue}, 70%, 60%)`;
    }

    // Create mock directories and files needed for the demo
    function createMockDirectories() {
        console.log('Mock directories and files would be created in a real environment');
        // In a real environment, you would create:
        // - audio/ directory with mp3 files
        // - img/ directory with svg files
    }
    
    // Call this function in development to log what would be created
    createMockDirectories();
}); 