# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS client-build
WORKDIR /src/quickmarkweb.client

RUN apt-get update && apt-get install -y nodejs npm

COPY quickmarkweb.client/package*.json ./
RUN npm install

COPY quickmarkweb.client/ .
RUN npm run build --prod

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .

RUN apt-get update && apt-get install -y nodejs npm \
    && rm -rf /var/lib/apt/lists/*

COPY QuickMarkWeb.Server/QuickMarkWeb.Server.csproj ./QuickMarkWeb.Server/
COPY QuickMarkWeb.Shared/Shared.csproj ./QuickMarkWeb.Shared/

RUN dotnet restore QuickMarkWeb.Server/QuickMarkWeb.Server.csproj

COPY QuickMarkWeb.Server/ ./QuickMarkWeb.Server/
COPY QuickMarkWeb.Shared/ ./QuickMarkWeb.Shared/

COPY --from=client-build /src/quickmarkweb.client/dist /src/QuickMarkWeb.Server/wwwroot

WORKDIR /src/QuickMarkWeb.Server

RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "QuickMarkWeb.Server.dll"]
