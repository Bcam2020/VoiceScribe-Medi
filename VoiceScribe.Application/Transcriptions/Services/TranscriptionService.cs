using VoiceScribe.Application.DTOs;
using VoiceScribe.Application.Interfaces;
using VoiceScribe.Application.Transcriptions.Commands;
using VoiceScribe.Application.Transcriptions.Queries;
using VoiceScribe.Domain;

namespace VoiceScribe.Application.Transcriptions.Services;

public class TranscriptionService
{
    private readonly ITranscriptionRepository _repository;
    private readonly ISpeechService _speechService;

    public TranscriptionService(
        ITranscriptionRepository repository,
        ISpeechService speechService)
    {
        _repository = repository;
        _speechService = speechService;
    }

    public async Task<Guid> CreateTranscriptionAsync(CreateTranscriptionCommand command)
    {
        // Transcribe audio
        string content = await _speechService.TranscribeAudioAsync(command.AudioData);

        // Create domain entity
        var transcription = new Transcription(command.PatientReference);
        transcription.UpdateContent(content);

        // Save
        await _repository.AddAsync(transcription);

        return transcription.Id;
    }

    public async Task<TranscriptionDto?> GetTranscriptionAsync(GetTranscriptionQuery query)
    {
        var transcription = await _repository.GetByIdAsync(query.Id);

        if (transcription == null)
            return null;

        return new TranscriptionDto
        {
            Id = transcription.Id,
            Content = transcription.Content,
            CreatedAt = transcription.CreatedAt,
            PatientReference = transcription.PatientReference,
            Status = transcription.Status.ToString()
        };
    }

    public async Task<IEnumerable<TranscriptionDto>> GetAllTranscriptionsAsync(GetAllTranscriptionsQuery query)
    {
        var transcriptions = await _repository.GetAllAsync();

        return transcriptions.Select(t => new TranscriptionDto
        {
            Id = t.Id,
            Content = t.Content,
            CreatedAt = t.CreatedAt,
            PatientReference = t.PatientReference,
            Status = t.Status.ToString()
        });
    }
}