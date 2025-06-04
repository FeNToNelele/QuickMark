using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Components;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using QuickMarkWeb.Server.Data;
using QuickMarkWeb.Server.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// if (builder.Environment.IsDevelopment())
// {
//     builder.WebHost.UseUrls("http://localhost:5023");
// }

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//TODO: At deployment change code above to:
/*
 * builder.Services.AddDbContext<AppDbContext>(opt =>
  opt.UseNpgsql(Environment.GetEnvironmentVariable("DATABASE_URL"))); //DATABASE_URL: the database's endpoint
 */

//TODO: At deployment change port to 80, as it is in dockerfile
//builder.WebHost.UseUrls("http://*:80");

builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, //can be turned off in demonstration
            ValidateAudience = true, //can be turned off in demonstration
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
            ValidAudience = builder.Configuration["JWT:ValidAudience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]!)),
            ClockSkew = TimeSpan.FromMinutes(5) //added 06.02
        };
    });

// Swagger & JWT Support
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "QuickMark API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        Description = "Enter 'Bearer' followed by a space and your JWT."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp",
        builder =>
        {
            builder
                .WithOrigins("https://localhost:53300", "http://localhost:53300", "http://localhost:5000", "http://localhost:3000")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
                //.SetIsOriginAllowedToAllowWildcardSubdomains();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "QuickMark API v1");
        options.RoutePrefix = "swagger";
    });
    app.UseDeveloperExceptionPage();
}

//app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("ReactApp");


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
