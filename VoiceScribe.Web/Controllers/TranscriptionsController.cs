using Microsoft.AspNetCore.Mvc;
using VoiceScribe.Application.Transcriptions.Commands;
using VoiceScribe.Application.Transcriptions.Queries;
using VoiceScribe.Application.Transcriptions.Services;

namespace VoiceScribe.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TranscriptionsController : ControllerBase
{
    private readonly TranscriptionService _transcriptionService;

    public TranscriptionsController(TranscriptionService transcriptionService)
    {
        _transcriptionService = transcriptionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var query = new GetAllTranscriptionsQuery();
        var transcriptions = await _transcriptionService.GetAllTranscriptionsAsync(query);

        return Ok(transcriptions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var query = new GetTranscriptionQuery(id);
        var transcription = await _transcriptionService.GetTranscriptionAsync(query);

        if (transcription == null)
            return NotFound();

        return Ok(transcription);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] string patientReference, [FromForm] IFormFile audioFile)
    {
        using var memoryStream = new MemoryStream();
        await audioFile.CopyToAsync(memoryStream);

        var command = new CreateTranscriptionCommand(
            patientReference,
            memoryStream.ToArray());

        var id = await _transcriptionService.CreateTranscriptionAsync(command);

        return CreatedAtAction(nameof(Get), new { id }, new { id });
    }
}