using ApplicationCore.Entities;
using ApplicationCore.Repositories;
using ApplicationCore.Services;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Infrastructure;
using Infrastructure.Repositories;
using Infrastructure.Services;
using KarlBot.OptionsConfigurations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

// Server entry point. This is the place where the whole application is connected together.
// Here is configured dependency injection and request pipeline.

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();

builder.Services.AddControllers(o =>
{
    o.SuppressAsyncSuffixInActionNames = false;
})
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    });

builder.Services.ConfigureOptions<ChallengeEvaluationOptionsConfiguration>();
builder.Services.Configure<FirebaseOptions>(builder.Configuration.GetSection("Firebase"));
builder.Services.Configure<UserTokenOptions>(builder.Configuration.GetSection("UserToken"));

builder.Services.AddTransient<IFirebaseAuthenticationService, AdminSdkFirebaseAuthenticationService>();
builder.Services.AddTransient<IFirebaseSignInService, UserManagerFirebaseSignInService>();
builder.Services.AddTransient<IChallengeEvaluationService, ClearScriptChallengeEvaluationService>();
builder.Services.AddTransient<IUserTokenService, UserTokenService>();
builder.Services.AddTransient<IChallengeRepository, DbContextChallengeRepository>();
builder.Services.AddTransient<IChallengeSubmissionRepository, DbContextChallengeSubmissionRepository>();
builder.Services.AddTransient<IProjectRepository, DbContextProjectRepository>();
builder.Services.AddTransient<IUserRepository, DbContextUserRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(o =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "JWT token",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "JwtToken"
        }
    };
    o.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    o.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });

    // From https://learn.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle.
    var xmlDocumentationFileName = Assembly.GetExecutingAssembly().GetName().Name + ".xml";
    var xmlDocumentationFilePath = Path.Combine(AppContext.BaseDirectory, xmlDocumentationFileName);
    o.IncludeXmlComments(xmlDocumentationFilePath);
});

builder.Services.AddDbContext<ApplicationDbContext>(o => o.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<User, IdentityRole<Guid>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(o =>
{
    o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    o.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = builder.Configuration["UserToken:Issuer"],
            ValidAudience = builder.Configuration["UserToken:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["UserToken:Key"]!)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true
        };
    });

var app = builder.Build();

using (var serviceScope = app.Services.CreateScope())
{
    var dbContext = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}

InitializeFirebase(app.Services.GetService<IOptions<FirebaseOptions>>()!.Value);

// Request pipeline configuration.

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
}

app.UseHttpsRedirection();

var staticFileOptions = new StaticFileOptions
{
    OnPrepareResponse = c =>
    {
        c.Context.Response.Headers[HeaderNames.CacheControl] = "no-cache";
    }
};
app.UseStaticFiles(staticFileOptions);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers().RequireAuthorization();
app.MapFallbackToFile("index.html", staticFileOptions);

app.Run();

void InitializeFirebase(FirebaseOptions options)
{
    if (app.Environment.IsDevelopment())
        Environment.SetEnvironmentVariable("FIREBASE_AUTH_EMULATOR_HOST", options.AuthenticationEmulatorUrl);

    FirebaseApp.Create(new AppOptions
    {
        ProjectId = options.ProjectId,
        Credential = app.Environment.IsDevelopment()
            ? GoogleCredential.FromAccessToken("test")
            : GoogleCredential.FromFile(options.CredentialFilePath)
    });
}