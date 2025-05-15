var builder = DistributedApplication.CreateBuilder(args);

var apiService = builder.AddProject<Projects.VoiceScribe_ApiService>("apiservice");

builder.AddProject<Projects.VoiceScribe_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithReference(apiService)
    .WaitFor(apiService);

builder.Build().Run();
