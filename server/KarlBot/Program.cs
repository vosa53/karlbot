using ApplicationCore.Entities;
using ApplicationCore.Repositories;
using ApplicationCore.Services;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Infrastructure;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;
using System.Text.Json;
using KarlBot.OptionsConfigurations;
using Microsoft.Extensions.Options;
using System.Reflection;

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
builder.Services.AddTransient<IChallengeEvaluationService, ClearScriptChallengeEvaluationService>();
builder.Services.AddTransient<IUserTokenService, UserTokenService>();
builder.Services.AddTransient<IChallengeRepository, DbContextChallengeRepository>();
builder.Services.AddTransient<IChallengeSubmissionRepository, DbContextChallengeSubmissionRepository>();
builder.Services.AddTransient<IProjectRepository, DbContextProjectRepository>();
builder.Services.AddTransient<IUserRepository, DbContextUserRepository>();

// Configuring Swagger/OpenAPI. More at: https://aka.ms/aspnetcore/swashbuckle.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(setup =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "JWT Authentication",
        Description = "JWT Bearer token",
        Type = SecuritySchemeType.Http,
        In = ParameterLocation.Header,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme,
        }
    };
    setup.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    setup.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });

    var xmlDocumentationFileName = Assembly.GetExecutingAssembly().GetName().Name + ".xml";
    var xmlDocumentationFilePath = Path.Combine(AppContext.BaseDirectory, xmlDocumentationFileName);
    setup.IncludeXmlComments(xmlDocumentationFilePath);

});

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<User, IdentityRole<Guid>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(o => 
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = builder.Configuration["UserToken:Issuer"],
            ValidAudience = builder.Configuration["UserToken:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["UserToken:Key"])),
            ValidateIssuerSigningKey = true,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true
        };
    });


var app = builder.Build();

// Migrate database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}

InitializeFirebase(app.Services.GetService<IOptions<FirebaseOptions>>()!.Value);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
}

app.UseHttpsRedirection();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers().RequireAuthorization();
app.MapFallbackToFile("index.html");

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