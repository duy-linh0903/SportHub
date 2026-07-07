# SportHub

SportHub is a two-part workspace:

- `Backend/` contains an ASP.NET Core Web API with JWT authentication and SQL Server access.
- `Frontend/` contains a React Native application.

## Project Structure

```text
SportHub/
├── Backend/
│   └── SportHub/
└── Frontend/
```

## Backend

The backend project lives in `Backend/SportHub` and is built with .NET 8.

Main responsibilities:

- expose API endpoints
- authenticate requests with JWT Bearer tokens
- connect to SQL Server through Entity Framework Core

### Configuration

Backend settings are defined in `Backend/SportHub/appsettings.json`.

Important keys:

- `ConnectionStrings:DBConnection` for the SQL Server connection string
- `Jwt:Key` for token signing
- `Jwt:Issuer` for the token issuer
- `Jwt:Audience` for the token audience

### Run the backend

From the `Backend/` folder:

```powershell
dotnet restore
dotnet run --project SportHub/SportHub.csproj
```

If you use Visual Studio, open `Backend/Backend.slnx` and run the `SportHub` project.

## Frontend

The frontend project lives in `Frontend` and is a React Native app.

### Requirements

- Node.js 22.11 or newer
- React Native environment set up for Android and/or iOS
- Android Studio for Android builds
- Xcode for iOS builds on macOS

### Run the frontend

From the `Frontend/` folder:

```powershell
npm install
npm start
```

In a second terminal:

```powershell
npm run android
```

For iOS on macOS:

```powershell
npm run ios
```

## Development Notes

- Keep backend secrets out of source control when moving to a shared environment.
- Use the backend connection string and JWT settings that match your local SQL Server instance.
- The frontend currently starts from the default React Native template and can be extended from `Frontend/App.tsx`.

## Useful Commands

Backend:

```powershell
dotnet build Backend/SportHub/SportHub.csproj
dotnet run --project Backend/SportHub/SportHub.csproj
```

Frontend:

```powershell
npm --prefix Frontend install
npm --prefix Frontend start
```

## Notes

This repository currently does not include a root-level CI workflow. The `.github/workflows` folder is present and can be used later if you want to add automated build or test pipelines.
