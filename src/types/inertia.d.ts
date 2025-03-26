import '@adonisjs/inertia/types'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    inertia: import('@adonisjs/inertia/types').InertiaContract
  }
}
