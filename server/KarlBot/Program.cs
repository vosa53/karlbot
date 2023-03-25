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
using KarlBot.Controllers;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace KarlBot
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors();

            builder.Services.AddControllers(o =>
            {
                o.SuppressAsyncSuffixInActionNames = false;
            }).AddJsonOptions(o =>
            {
                o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
            });

            FirebaseApp.Create(new AppOptions
            {
                Credential = GoogleCredential.FromFile("karlbot-app-firebase-adminsdk-azcla-72e48f58a6.json")
            });

            builder.Services.AddTransient<IFirebaseAuthenticationService, FirebaseAuthenticationService>();
            builder.Services.AddTransient<IChallengeEvaluationService, ChallengeEvaluationService>();
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
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    Description = "JWT Bearer token",

                    Reference = new OpenApiReference
                    {
                        Id = JwtBearerDefaults.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme
                    }
                };

                setup.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

                setup.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    { jwtSecurityScheme, Array.Empty<string>() }
                });

            });

            builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddIdentity<User, IdentityRole>()
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
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true
                };
            });

            var app = builder.Build();

            app.UseCors(
                options => options.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader()
            );

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers().RequireAuthorization();

            app.Run();
        }
    }
}