import router from '@adonisjs/core/services/router'
import { adminConfigService } from './services/admin_config_service.js'
const ResourceController = () => import('./controllers/resource_controller.js')

export function renderAdminRoutes() {
  const adminConfig = adminConfigService.getConfig()
  return router.group(() => {
    router.any('/*', [ResourceController, 'index']).as('resource')
    router.on('').redirectToPath(adminConfig.defaultPath).as('redirect')
  })
}
