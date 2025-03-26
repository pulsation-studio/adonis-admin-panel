import app from '@adonisjs/core/services/app'
import { AdminConfig } from '../models/admin_config.js'

export class AdminConfigService {
  constructor(protected config: AdminConfig) {}

  public getConfig() {
    return this.config
  }
}

let adminConfigService: AdminConfigService
await app.booted(async () => {
  adminConfigService = await app.container.make(AdminConfigService)
})
export { adminConfigService }
