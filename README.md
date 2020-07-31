# MyPod
Production quality Express API server template.

## Features
- Automatic build on code change in development mode
- Automatic generate request-id
- Automatic HTTP request log with morgan
- Apply babel preset to handle latest language spec(es6)
- Build webpack bundle with code optimization
- Create small size docker container with alpine core

## Package manager
- `npm i` : Install dependencies
- `npm run dev` : Restart on code change (development)
- `npm run dev:build` : Build on code change (development)
- `npm run build` : Generate bundle (production)
- `npm run start` : Execute generated bundle (production)

## Docker
- Build
  - `docker build -t dilly97/mypod:v1.0-alpine .` 
- Execute
  - `docker run -it -p 8080:8080 dilly97/mypod:v1.0-alpine`


