using VoiceScribe.Infrastructure;
using VoiceScribe.Application.Transcriptions.Services;

var builder = WebApplication.CreateBuilder(args);

// Add API-specific services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Register application and infrastructure services
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices();

var app = builder.Build();

// Configure the HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler();
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseAuthorization();

// Map controllers only
app.MapControllers();

app.Run();