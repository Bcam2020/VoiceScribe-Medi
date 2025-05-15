namespace VoiceScribe.Web.Models;

public class RecordingResult
{
    public byte[] AudioBytes { get; set; } = Array.Empty<byte>();
    public string Transcription { get; set; } = string.Empty;
}