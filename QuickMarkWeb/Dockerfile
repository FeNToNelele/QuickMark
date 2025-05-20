FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy only server and shared project files (not client)
COPY QuickMarkWeb.Server/*.csproj ./QuickMarkWeb.Server/
COPY QuickMarkWeb.Shared/*.csproj ./QuickMarkWeb.Shared/

# Restore only the server project
RUN dotnet restore ./QuickMarkWeb.Server/QuickMarkWeb.Server.csproj

# Copy only server and shared source code (exclude client)
COPY QuickMarkWeb.Server/. ./QuickMarkWeb.Server/
COPY QuickMarkWeb.Shared/. ./QuickMarkWeb.Shared/

RUN dotnet publish ./QuickMarkWeb.Server/QuickMarkWeb.Server.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "QuickMarkWeb.Server.dll"]
