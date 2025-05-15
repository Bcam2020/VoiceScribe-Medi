using Microsoft.Extensions.DependencyInjection;
using VoiceScribe.Application.Interfaces;
using VoiceScribe.Application.Transcriptions.Services;
using VoiceScribe.Infrastructure.Persistence;
using VoiceScribe.Infrastructure.Services;

namespace VoiceScribe.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        // Register repositories
        services.AddScoped<ITranscriptionRepository, InMemoryTranscriptionRepository>();

        // Register services
        services.AddHttpClient<ISpeechService, SpeechService>();

        return services;
    }

    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Register application services
        services.AddScoped<TranscriptionService>();

        return services;
    }
}