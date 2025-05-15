// Debug logging
console.log("Loading audioRecorder.js...");

// Define an initialization state
window.audioRecorderInitialized = false;

window.audioRecorder = {
    mediaRecorder: null,
    audioChunks: [],
    recognition: null,
    transcriptionText: '',
    dotNetRef: null, // To store reference to .NET object

    // Initialize function to properly signal readiness
    initialize: function (dotNetReference) {
        console.log("Initializing audioRecorder...");

        // Store the .NET reference
        this.dotNetRef = dotNetReference;

        // Check for required browser features
        const issues = [];

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            issues.push("Audio recording (getUserMedia) not supported");
        }

        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            issues.push("Speech recognition not supported, but will continue with recording only");
            console.warn("Speech recognition not supported in this browser");
        }

        if (issues.length > 0 && issues[0].includes("getUserMedia")) {
            console.error("Critical browser compatibility issues detected:", issues);

            // Notify Blazor about initialization failure
            if (this.dotNetRef) {
                this.dotNetRef.invokeMethodAsync('OnAudioRecorderInitialized', false, issues[0]);
            }

            return false;
        }

        // Mark as initialized
        window.audioRecorderInitialized = true;
        console.log("audioRecorder initialized successfully!");

        // Notify Blazor about successful initialization
        if (this.dotNetRef) {
            this.dotNetRef.invokeMethodAsync('OnAudioRecorderInitialized', true, null);
        }

        return true;
    },

    // Test function to verify JavaScript is working
    testFunction: function () {
        console.log("Test function called!");

        // Notify Blazor if reference exists
        if (this.dotNetRef) {
            this.dotNetRef.invokeMethodAsync('OnTestFunctionCalled');
        }

        return true;
    },

    // Request microphone permissions explicitly
    requestMicrophonePermission: async function () {
        try {
            console.log("Requesting microphone permission...");

            // First ensure the recorder is initialized
            if (!window.audioRecorderInitialized) {
                this.initialize(this.dotNetRef);
            }

            // Request permission directly through the API
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Stop the stream immediately - we're just checking permissions
            stream.getTracks().forEach(track => track.stop());
            console.log("Microphone permission granted!");

            // Notify Blazor about permission grant
            if (this.dotNetRef) {
                this.dotNetRef.invokeMethodAsync('OnMicrophonePermissionChanged', true, null);
            }

            return true;
        } catch (error) {
            console.error("Error requesting microphone permission:", error);

            // Notify Blazor about permission denial
            if (this.dotNetRef) {
                this.dotNetRef.invokeMethodAsync('OnMicrophonePermissionChanged', false, error.message || "Permission denied");
            }

            return false;
        }
    },

    // Start recording with explicit permission check
    startRecording: async function () {
        console.log("startRecording called");

        try {
            // First check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.error("getUserMedia not supported in this browser");

                if (this.dotNetRef) {
                    this.dotNetRef.invokeMethodAsync('OnRecordingError', "Your browser doesn't support audio recording");
                }

                return false;
            }

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("Microphone access granted");

            // Set up MediaRecorder
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.addEventListener("dataavailable", event => {
                this.audioChunks.push(event.data);
                console.log("Audio chunk captured: " + event.data.size + " bytes");
            });

            this.mediaRecorder.start(1000); // Capture in 1-second chunks
            console.log("MediaRecorder started");

            // Set up speech recognition
            this.transcriptionText = '';

            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                console.warn("Speech recognition not supported in this browser");
                // Continue without transcription

                if (this.dotNetRef) {
                    this.dotNetRef.invokeMethodAsync('OnRecordingStarted', false);
                }

                return true;
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
                        console.log("Transcription updated: " + this.transcriptionText);

                        // Notify Blazor about transcription update
                        if (this.dotNetRef) {
                            this.dotNetRef.invokeMethodAsync('OnTranscriptionUpdated', this.transcriptionText);
                        }
                    }
                }
            };

            this.recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);

                // Notify Blazor about recognition error (but don't stop recording)
                if (this.dotNetRef && event.error !== 'no-speech') {
                    this.dotNetRef.invokeMethodAsync('OnRecognitionError', event.error);
                }
            };

            this.recognition.start();
            console.log("Speech recognition started");

            // Notify Blazor about successful recording start
            if (this.dotNetRef) {
                this.dotNetRef.invokeMethodAsync('OnRecordingStarted', true);
            }

            return true;
        } catch (error) {
            console.error("Error in startRecording:", error);

            // Notify Blazor about recording error
            if (this.dotNetRef) {
                this.dotNetRef.invokeMethodAsync('OnRecordingError', error.message || "Failed to start recording");
            }

            return false;
        }
    },

    stopRecording: function () {
        console.log("stopRecording called");

        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder) {
                console.error("No active recording to stop");

                if (this.dotNetRef) {
                    this.dotNetRef.invokeMethodAsync('OnRecordingError', "No active recording to stop");
                }

                reject("No active recording");
                return;
            }

            // Stop speech recognition if it was started
            if (this.recognition) {
                try {
                    this.recognition.stop();
                    console.log("Speech recognition stopped");
                } catch (e) {
                    console.error("Error stopping recognition:", e);
                }
            }

            // Handler for when recording is stopped
            const handleStop = async () => {
                console.log("MediaRecorder stopped event fired");

                try {
                    // Create audio blob from recorded chunks
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                    console.log("Audio blob created, size:", audioBlob.size, "bytes");

                    if (audioBlob.size === 0) {
                        console.error("No audio data captured");

                        if (this.dotNetRef) {
                            this.dotNetRef.invokeMethodAsync('OnRecordingError', "No audio data was captured");
                        }

                        reject("No audio data was captured");
                        return;
                    }

                    const arrayBuffer = await audioBlob.arrayBuffer();
                    const bytes = new Uint8Array(arrayBuffer);

                    console.log("Final transcription:", this.transcriptionText);

                    // Notify Blazor about recording completion first
                    if (this.dotNetRef) {
                        this.dotNetRef.invokeMethodAsync('OnRecordingStopped');
                    }

                    // Return both audio bytes and transcription
                    resolve({
                        audioBytes: Array.from(bytes),
                        transcription: this.transcriptionText.trim() || "No transcription available"
                    });
                } catch (error) {
                    console.error("Error processing recording:", error);

                    if (this.dotNetRef) {
                        this.dotNetRef.invokeMethodAsync('OnRecordingError', error.message || "Error processing recording");
                    }

                    reject(error);
                }
            };

            // Add the event listener and stop the recorder
            this.mediaRecorder.addEventListener("stop", handleStop, { once: true });
            this.mediaRecorder.stop();
            console.log("MediaRecorder stop requested");
        });
    }
};

// Add a global direct test function
window.testAudioRecorder = function () {
    console.log("Global audioRecorder test function called");
    alert("Testing audioRecorder: " + (window.audioRecorderInitialized ? "Initialized" : "Not Initialized"));
    return true;
};

// Initialize on load
document.addEventListener('DOMContentLoaded', function () {
    // We'll wait for explicit initialization from Blazor now
    console.log("audioRecorder.js loaded successfully and waiting for initialization from Blazor");
});

// Verify script loaded
console.log("audioRecorder.js loaded successfully!");