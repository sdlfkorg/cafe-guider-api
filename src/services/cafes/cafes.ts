// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  cafesDataValidator,
  cafesPatchValidator,
  cafesQueryValidator,
  cafesResolver,
  cafesExternalResolver,
  cafesDataResolver,
  cafesPatchResolver,
  cafesQueryResolver
} from './cafes.schema'

import type { Application } from '../../declarations'
import { CafesService, getOptions } from './cafes.class'
import { cafesPath, cafesMethods } from './cafes.shared'

export * from './cafes.class'
export * from './cafes.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const cafes = (app: Application) => {
  // Register our service on the Feathers application
  app.use(cafesPath, new CafesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: cafesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(cafesPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(cafesExternalResolver), schemaHooks.resolveResult(cafesResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(cafesQueryValidator), schemaHooks.resolveQuery(cafesQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(cafesDataValidator), schemaHooks.resolveData(cafesDataResolver)],
      patch: [schemaHooks.validateData(cafesPatchValidator), schemaHooks.resolveData(cafesPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [cafesPath]: CafesService
  }
}
