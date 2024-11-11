// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Cafes, CafesData, CafesPatch, CafesQuery, CafesService } from './cafes.class'

export type { Cafes, CafesData, CafesPatch, CafesQuery }

export type CafesClientService = Pick<CafesService<Params<CafesQuery>>, (typeof cafesMethods)[number]>

export const cafesPath = 'cafes'

export const cafesMethods: Array<keyof CafesService> = ['find', 'get', 'create', 'patch', 'remove']

export const cafesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(cafesPath, connection.service(cafesPath), {
    methods: cafesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [cafesPath]: CafesClientService
  }
}
