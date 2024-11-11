// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Cafes, CafesData, CafesPatch, CafesQuery } from './cafes.schema'

export type { Cafes, CafesData, CafesPatch, CafesQuery }

export interface CafesParams extends KnexAdapterParams<CafesQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class CafesService<ServiceParams extends Params = CafesParams> extends KnexService<
  Cafes,
  CafesData,
  CafesParams,
  CafesPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'cafes'
  }
}
