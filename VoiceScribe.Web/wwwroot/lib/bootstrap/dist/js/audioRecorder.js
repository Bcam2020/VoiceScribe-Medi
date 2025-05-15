window.audioRecorder = {
    mediaRecorder: null,
    audioChunks: [],

    startRecording: async function () {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.addEventListener("dataavailable", event => {
                this.audioChunks.push(event.data);
            });

            this.mediaRecorder.start();
            return true;
        } catch (error) {
            console.error("Error starting recording:", error);
            return false;
        }
    },

    stopRecording: function () {
        return new Promise((resolve) => {
            this.mediaRecorder.addEventListener("stop", async () => {
                const audioBlob = new Blob(this.audioChunks);
                const arrayBuffer = await audioBlob.arrayBuffer();
                const bytes = new Uint8Array(arrayBuffer);
                resolve(Array.from(bytes));
            });

            this.mediaRecorder.stop();
        });
    }
};