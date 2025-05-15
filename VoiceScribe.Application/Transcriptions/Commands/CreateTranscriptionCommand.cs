namespace VoiceScribe.Application.Transcriptions.Commands;

public record CreateTranscriptionCommand(string PatientReference, byte[] AudioData);