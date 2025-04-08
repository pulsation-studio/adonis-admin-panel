# Adonis Admin Panel

A flexible administration panel for AdonisJS applications.

## Description

Adonis Admin Panel is a package that provides a complete administration interface for AdonisJS applications. It is built with the following technologies:

- AdonisJS 6.x
- React
- Mantine UI
- Inertia.js
- TypeScript

## Prerequisites

- Node.js >= 20.6.0
- An existing AdonisJS application

## Installation

```bash
npm install adonis-admin-panel
```

## Configuration

1. Register the provider in your `start/app.ts` file:

```typescript
import { adminConfigProvider } from 'adonis-admin-panel/admin_config_provider'

export const providers = [
  // ... other providers
  adminConfigProvider,
]
```

2. Configure the routes in your `start/routes.ts` file:

```typescript
import { adminRoutes } from 'adonis-admin-panel/routes'

// ... other routes
adminRoutes()
```

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

## Support

For any questions or issues, please open an issue on the GitHub repository.

## Authors

- Pulsation
