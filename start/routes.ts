/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

// Auth routes
Route.post('/login', 'AuthController.login')
Route.post('/register', 'AuthController.register')

// API routes
Route
  .group(() => {
    // Hello world
    Route.get('/', async () => {
      return { hello: 'world' }
    })

    // Account CRUD
    Route
      .group(() => {
        Route.get('/', 'AccountsController.get').middleware('auth:api')
        Route.post('/', 'AccountsController.create').middleware('auth:api')
      })
      .prefix('/account')

    // Health Check
    Route.get('health', async ({ response }) => {
      const report = await HealthCheck.getReport()

      return report.healthy
        ? response.ok(report)
        : response.badRequest(report)
    })
  })
  .prefix('/api').middleware('auth:api')
