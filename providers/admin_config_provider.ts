import { Application } from '@adonisjs/core/app'
import type { AdminConfig } from '../src/models/admin_config.js'
import { AdminConfigService } from '../src/services/admin_config_service.js'

export default class AdminConfigProvider {
  constructor(protected app: Application<any>) {}

  async boot() {}

  async register() {
    const config = this.app.config.get<AdminConfig>('admin_config')

    if (!config) {
      throw new Error('Missing "admin_config" configuration file')
    }

    this.app.container.bind(AdminConfigService, () => {
      return new AdminConfigService(config)
    })
  }

  async start() {}

  async ready() {}

  async shutdown() {}
}
