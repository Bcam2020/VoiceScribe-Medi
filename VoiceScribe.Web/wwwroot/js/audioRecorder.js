window.audioRecorder = {
    mediaRecorder: null,
    audioChunks: [],
    recognition: null,
    transcriptionText: '',

    testFunction: function () {
        console.log("Test function called!");
        return true;
    },

    startRecording: async function () {
        console.log("Starting recording...");
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.addEventListener("dataavailable", event => {
                this.audioChunks.push(event.data);
            });

            this.mediaRecorder.start(1000); // Capture in 1-second chunks

            // Set up speech recognition
            this.transcriptionText = '';
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                console.error("Speech recognition not supported in this browser");
                return true; // Still allow recording even if speech recognition fails
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        this.transcriptionText += event.results[i][0].transcript + ' ';
                        console.log("Transcription updated:", this.transcriptionText);
                    }
                }
            };

            this.recognition.start();
            console.log("Recording started successfully");
            return true;
        } catch (error) {
            console.error("Error starting recording:", error);
            return false;
        }
    },

    stopRecording: function () {
        console.log("Stopping recording...");
        return new Promise((resolve) => {
            // Stop speech recognition
            if (this.recognition) {
                try {
                    this.recognition.stop();
                } catch (e) {
                    console.error("Error stopping recognition:", e);
                }
            }

            // Handler for when recording is stopped
            const handleStop = async () => {
                // Create audio blob from recorded chunks
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                const arrayBuffer = await audioBlob.arrayBuffer();
                const bytes = new Uint8Array(arrayBuffer);

                console.log("Recording stopped, transcription:", this.transcriptionText);

                // Return both audio bytes and transcription
                resolve({
                    audioBytes: Array.from(bytes),
                    transcription: this.transcriptionText.trim()
                });
            };

            // Add the event listener and stop the recorder
            this.mediaRecorder.addEventListener("stop", handleStop, { once: true });
            this.mediaRecorder.stop();
        });
    }
};

// Log when the script is loaded
console.log("audioRecorder.js loaded successfully!");