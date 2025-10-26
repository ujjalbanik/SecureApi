# Use the official .NET SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy everything and publish
COPY . .
RUN dotnet publish -c Release -o out

# Use the smaller runtime image for running
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .

# Expose default port
EXPOSE 8080
ENTRYPOINT ["dotnet", "SecureApi.dll"]
