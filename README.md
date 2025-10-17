# Playwright E2E Automation (GitHub Actions + GHCR)

End-to-end tests for two services, runnable locally and in GitHub Actions inside a Docker **app image** published to GitHub Container Registry (GHCR).

- **Framework:** `@playwright/test`
- **Services / tags:** `@cm` (Community Members) and `@earnin` (EarnIn)
- **Projects (devices):** `Chromium Desktop` and `Safari Mobile`
- **CI pattern:** build once → run everywhere (tests run **inside** the image; no checkout/npm install in the E2E job)

## Features

- Page-object style tests (`tests/screens/**`) with readable suites (`tests/suites/**`)
- Multi-project matrix (desktop & mobile)
- Videos & traces on failure (uploaded as Actions artifacts)
- Quality-gated “deployment” workflow (mark deployment success/failure based on E2E)
- App image on GHCR (code + `node_modules` + Playwright browsers)

## Docker “App Image”

The repo builds a Docker image that already contains:

- your tests & config
- installed `node_modules`
- Playwright browsers

This lets CI run tests **inside the container** without checking out code or installing dependencies.

## How to run simulate deployment and trigger E2E automation

steps:

- Go to Actions → select Simulate Deployment.
- Choose end and service (cm or earnin) and click Run workflow.
- Open the run → download Artifacts to view the HTML report, videos, and traces.
