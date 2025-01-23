# Project Title

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

This project is for mySearch-rest-api

# Install all dependencies

```bash
npm install
```

# Before run next command go to BEacon and create familyFile with leadId and pass it to ./env/.env.qa there would be LEAD_ID and FAMILY_FILE

# This project using ENV variables to use qa or prod env you need to use following CLI command

```bash
ENV=qa npx playwright test
```

# To skip global-setup (global setup stands for log in for Bacon)

```bash
ENV=qa SKIP_GLOBAL_SETUP=true npx playwright test
```

# To run this project using Docker you can run next commands:\

That would biuld an image for playwright

```bash
docker build -t playwright-tests .
```

### and now if you wanna run command inside the Docker you can use this command:

```bash
docker run --rm \
  -e ENV=qa \
  -e SKIP_GLOBAL_SETUP=true \
  -v $(pwd)/reports:/reports/html-report \
  playwright-tests npx playwright test
```

After this command report should be generated to `reports` folder

## Commands

### npm Commands

| Command                    | Description                                                             |
| -------------------------- | ----------------------------------------------------------------------- |
| `npm run ffCreate`         | Run this command when you need to generate FF and leadId(does not work) |
| `npm run test:qa`          | Run tests in qa env                                                     |
| `npm run buildDockerImage` | Run dockerCommand to create an image for docker                         |
| `npm run runTestInDocker`  | Run all tests in Docker                                                 |
