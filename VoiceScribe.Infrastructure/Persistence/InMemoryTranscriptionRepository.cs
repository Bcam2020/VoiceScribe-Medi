using VoiceScribe.Application.Interfaces;
using VoiceScribe.Domain;

namespace VoiceScribe.Infrastructure.Persistence;

public class InMemoryTranscriptionRepository : ITranscriptionRepository
{
    private readonly List<Transcription> _transcriptions = new();

    public Task<Transcription?> GetByIdAsync(Guid id)
    {
        return Task.FromResult(_transcriptions.FirstOrDefault(t => t.Id == id));
    }

    public Task<IEnumerable<Transcription>> GetAllAsync()
    {
        return Task.FromResult(_transcriptions.AsEnumerable());
    }

    public Task AddAsync(Transcription transcription)
    {
        _transcriptions.Add(transcription);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Transcription transcription)
    {
        // In-memory implementation - no need to update as objects are referenced
        return Task.CompletedTask;
    }
}