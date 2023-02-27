FROM mcr.microsoft.com/dotnet/sdk:7.0-bullseye-slim AS build
WORKDIR /src
COPY friByte.capture-the-flag.service/*.csproj ./friByte.capture-the-flag.service/
COPY friByte.capture-the-flag.service.sln .
RUN dotnet restore "friByte.capture-the-flag.service/friByte.capture-the-flag.service.csproj"
COPY . .
WORKDIR "/src/friByte.capture-the-flag.service"
RUN dotnet build "friByte.capture-the-flag.service.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "friByte.capture-the-flag.service.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:7.0-bullseye-slim AS final
WORKDIR /app
EXPOSE 80
EXPOSE 443

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "friByte.capture-the-flag.service.dll"]