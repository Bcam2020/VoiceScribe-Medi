namespace VoiceScribe.Application.DTOs;

public class TranscriptionDto
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Content { get; set; } = string.Empty;
    public string PatientReference { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}