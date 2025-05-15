// app.js
console.log("App script loading...");

window.appInterop = {
    logToConsole: function (message) {
        console.log("Blazor says: " + message);
        return true;
    },

    checkJsLoaded: function (jsName) {
        if (jsName === "audioRecorder") {
            const isLoaded = typeof window.audioRecorder !== 'undefined';
            console.log(`Checking if ${jsName} is loaded: ${isLoaded}`);
            return isLoaded;
        }
        return false;
    }
};

console.log("App script loaded successfully!");