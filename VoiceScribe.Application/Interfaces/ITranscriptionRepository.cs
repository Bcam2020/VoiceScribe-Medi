// Make sure using directive is correct
using VoiceScribe.Domain;

namespace VoiceScribe.Application.Interfaces;

public interface ITranscriptionRepository
{
    Task<Transcription?> GetByIdAsync(Guid id);
    Task<IEnumerable<Transcription>> GetAllAsync();
    Task AddAsync(Transcription transcription);
    Task UpdateAsync(Transcription transcription);
}