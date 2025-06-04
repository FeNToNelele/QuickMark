# QuickMark
A QuickMark egy vizsgáztató keretrendszer. Magába foglal egy vizsgalapszkennelő mobilalkalmazást, valamint egy adminisztrátor weboldalt.

## Előkövetelmény
- node.js (^18)
- .NET keretrendszer (^8.0)
- PostgreSQL 17

## Projekt futtatása fejlesztéshez:
- Nyisd meg a projektet .NET-et támogató IDE-ben,
- Nyiss terminált
- Navigálj a projekt gyökérkönyvtárába,
- ```cd QuickMarkWeb/QuickMarkWeb.Server```
- ```dotnet ef database update```
- Az API futtatásához ugyanebben a könyvtárban: ```dotnet run```
- A weboldal futtatásához nyiss új terminált menj a repo gyökérkönyvtárába, majd: ```cd QuickMarkWeb/quickmarkweb.client``` ezután ```npm run build```
