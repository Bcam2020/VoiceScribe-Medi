VOICESCRIBE
VoiceScribe is a medical voice recording and transcription application that allows healthcare professionals to record, transcribe, and store patient notes efficiently.
FEATURES

Real-time Voice Recording: Capture high-quality audio directly in the browser
Automatic Transcription: Utilizes browser's Speech Recognition API for real-time transcription
Patient Reference: Organize recordings by patient identifier
Secure Storage: Properly encrypts and secures sensitive medical information
Review Interface: Browse, review, and edit past transcriptions

TECHNOLOGY STACK

Frontend: Blazor Web App (.NET 8)
Backend: ASP.NET Core (.NET 8)
Architecture: Domain-Driven Design (DDD)
Cloud-Native: Built with Aspire for distributed application orchestration
Web APIs: Uses browser's MediaRecorder and SpeechRecognition APIs

PREREQUISITES

.NET 8 SDK or later
Modern web browser (Chrome, Edge, or Firefox recommended)
Microphone access

SETUP AND INSTALLATION

Clone the repository
git clone https://github.com/yourusername/VoiceScribe-Medi.git
cd VoiceScribe-Medi
Build the solution
dotnet build
Run the application
dotnet run --project VoiceScribe.AppHost
Access the application
Open your browser and navigate to: https://localhost:5001

USAGE INSTRUCTIONS
Recording a New Transcription:

Navigate to the Record page
Enter a patient reference ID
Click Start Recording and begin speaking
The application will capture audio and transcribe in real-time
Click Stop Recording when finished
Review the transcription and confirm to save

Reviewing Past Transcriptions:

Navigate to the Transcriptions page
Browse the list of saved transcriptions
Click on any transcription to view details
Edit if necessary and save changes

PROJECT STRUCTURE
VoiceScribe-Medi/
├── VoiceScribe.AppHost/      # Aspire host application
├── VoiceScribe.Domain/       # Domain entities and logic
├── VoiceScribe.Application/  # Application services and DTOs
├── VoiceScribe.Infrastructure/ # External services and repositories
└── VoiceScribe.Web/          # Blazor web interface
├── Components/           # Blazor components
└── wwwroot/              # Static assets
└── js/               # JavaScript files
└── audioRecorder.js # Audio recording functionality
TROUBLESHOOTING
Audio Recording Issues:
If you encounter the "Loading audio capabilities..." message that doesn't go away:

Check Browser Compatibility: Ensure you're using a modern browser that supports MediaRecorder and SpeechRecognition APIs.
Verify JavaScript Loading: Open browser developer tools (F12) and check the Console tab for any errors related to JavaScript file loading.
Force Initialization: Click the "Force Initialize" button to bypass the automatic initialization.
Check Microphone Permissions: Ensure your browser has permission to access the microphone.
Direct Test Page: Navigate to /audiotest to run basic JavaScript interop tests.

Common Issues:

Microphone Access Denied: Grant microphone permissions in your browser settings
Speech Recognition Unavailable: Some browsers don't support the SpeechRecognition API; try Chrome or Edge
JavaScript Not Loading: Check network requests in developer tools to ensure all JS files are loading

DEVELOPMENT GUIDE
Adding New Features:

Follow the DDD architecture pattern
Place domain logic in the Domain project
Implement application services in the Application project
Add UI components in the Web project

JavaScript Interop:
When working with the audio recording functionality:

Ensure proper two-way communication between Blazor and JavaScript
Use DotNetObjectReference to pass Blazor objects to JavaScript
Use JSInvokable methods for JavaScript callbacks to Blazor

LICENSE
MIT License
ACKNOWLEDGMENTS

This project uses browser APIs for audio recording and speech recognition
Built with .NET 8 and Aspire
