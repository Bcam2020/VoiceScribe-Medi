namespace VoiceScribe.Application.Interfaces;

public interface ISpeechService
{
    Task<string> TranscribeAudioAsync(byte[] audioData);
}