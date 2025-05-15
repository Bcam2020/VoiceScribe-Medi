namespace VoiceScribe.Domain;

public class Transcription
{
    // Private constructor for EF Core
    private Transcription() { }

    public Transcription(string patientReference)
    {
        Id = Guid.NewGuid();
        PatientReference = patientReference;
        Status = TranscriptionStatus.Draft;
        CreatedAt = DateTime.UtcNow;
    }

    public Guid Id { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public string Content { get; private set; } = string.Empty;
    public string PatientReference { get; private set; }
    public TranscriptionStatus Status { get; private set; }

    // Domain behaviors
    public void UpdateContent(string content)
    {
        Content = content;
    }

    public void MarkAsReviewed()
    {
        Status = TranscriptionStatus.Completed;
    }

    public void StartReview()
    {
        Status = TranscriptionStatus.InReview;
    }
}