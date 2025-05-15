var builder = DistributedApplication.CreateBuilder(args);

var webApp = builder.AddProject<Projects.VoiceScribe_Web>("webapp");

builder.Build().Run();