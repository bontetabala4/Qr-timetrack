/*
|--------------------------------------------------------------------------
| HTTP Kernel
|--------------------------------------------------------------------------
|
| Point d'entrée pour enregistrer les middlewares globaux et nommés.
| Les middlewares globaux sont appliqués à toutes les requêtes,
| les middlewares nommés sont appliqués aux routes spécifiques.
|
*/

import server from '@adonisjs/core/services/server'
import router from '@adonisjs/core/services/router'

/**
 * Gestionnaire des erreurs global
 */
server.errorHandler(() => import('#exceptions/handler'))

/**
 * Middleware globaux (exécutés sur toutes les requêtes)
 */
server.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('@adonisjs/static/static_middleware'),
  () => import('@adonisjs/vite/vite_middleware'),
])

/**
 * Middleware appliqués aux routes enregistrées (router middleware)
 */
router.use([
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('@adonisjs/auth/initialize_auth_middleware'),
  () => import('#middleware/force_json_response_middleware'),
  () => import('#middleware/container_bindings_middleware'),
])

/**
 * Middleware nommés, à appliquer individuellement aux routes ou groupes
 */
export const middleware = router.named({
  // auth: () => import('#middleware/auth_middleware'),
})
