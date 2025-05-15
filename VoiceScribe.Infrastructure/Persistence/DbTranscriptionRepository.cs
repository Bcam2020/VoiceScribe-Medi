using VoiceScribe.Application.Interfaces;
using VoiceScribe.Domain;

namespace VoiceScribe.Infrastructure.Persistence;

public class DbTranscriptionRepository : ITranscriptionRepository
{
    // This would use Entity Framework Core or another ORM
    // For now, it's just a skeleton

    public Task<Transcription?> GetByIdAsync(Guid id)
    {
        throw new NotImplementedException("Database implementation not yet complete");
    }

    public Task<IEnumerable<Transcription>> GetAllAsync()
    {
        throw new NotImplementedException("Database implementation not yet complete");
    }

    public Task AddAsync(Transcription transcription)
    {
        throw new NotImplementedException("Database implementation not yet complete");
    }

    public Task UpdateAsync(Transcription transcription)
    {
        throw new NotImplementedException("Database implementation not yet complete");
    }
}