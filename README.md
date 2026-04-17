## AWS Amplify Next.js (App Router) Starter Template

This repository provides a starter template for creating applications using Next.js (App Router) and AWS Amplify, emphasizing easy setup for authentication, API, and database capabilities.

## Monorepo layout

| Path | Role |
|------|------|
| `apps/web` | Next.js (App Router) frontend |
| `apps/mobile` | Expo (React Native) app — `npm run mobile` from repo root |
| `packages/shared` | Shared TypeScript (`@repo/shared`), safe for web + mobile |
| `amplify/` | Amplify Gen 2 backend (unchanged) |

From the repository root:

- **Web dev:** `npm run dev` (runs `next dev` in `apps/web`)
- **Web build:** `npm run build`
- **Mobile:** `npm run mobile` (Expo dev server)

The Next app imports `amplify_outputs.json` and `amplify/data/resource` via paths that resolve to the **repository root** (`experimental.externalDir` is enabled in `apps/web/next.config.js`). After `ampx sandbox` / deploy, keep `amplify_outputs.json` at the repo root (gitignored) as before.

## Overview

This template equips you with a foundational Next.js application integrated with AWS Amplify, streamlined for scalability and performance. It is ideal for developers looking to jumpstart their project with pre-configured AWS services like Cognito, AppSync, and DynamoDB.

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Database**: Real-time database powered by Amazon DynamoDB.

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/#deploy-a-fullstack-app-to-aws) of our documentation.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.