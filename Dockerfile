# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["QuickMarkWeb/quickmarkweb.server/quickmarkweb.server.csproj", "./"]
RUN dotnet restore "./quickmarkweb.server.csproj"
COPY . .
RUN dotnet publish "QuickMarkWeb/quickmarkweb.server/quickmarkweb.server.csproj" \
    -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "quickmarkweb.server.dll"]
