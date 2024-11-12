// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { CafesService } from './cafes.class'

// Main data model schema
export const cafesSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String(),
    sn: Type.Number()
  },
  { $id: 'Cafes', additionalProperties: false }
)
export type Cafes = Static<typeof cafesSchema>
export const cafesValidator = getValidator(cafesSchema, dataValidator)
export const cafesResolver = resolve<Cafes, HookContext<CafesService>>({})

export const cafesExternalResolver = resolve<Cafes, HookContext<CafesService>>({})

// Schema for creating new entries
export const cafesDataSchema = Type.Pick(cafesSchema, ['text'], {
  $id: 'CafesData'
})
export type CafesData = Static<typeof cafesDataSchema>
export const cafesDataValidator = getValidator(cafesDataSchema, dataValidator)
export const cafesDataResolver = resolve<Cafes, HookContext<CafesService>>({})

// Schema for updating existing entries
export const cafesPatchSchema = Type.Partial(cafesSchema, {
  $id: 'CafesPatch'
})
export type CafesPatch = Static<typeof cafesPatchSchema>
export const cafesPatchValidator = getValidator(cafesPatchSchema, dataValidator)
export const cafesPatchResolver = resolve<Cafes, HookContext<CafesService>>({})

// Schema for allowed query properties
export const cafesQueryProperties = Type.Pick(cafesSchema, ['id', 'text', 'sn'])
export const cafesQuerySchema = Type.Intersect(
  [
    querySyntax(cafesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type CafesQuery = Static<typeof cafesQuerySchema>
export const cafesQueryValidator = getValidator(cafesQuerySchema, queryValidator)
export const cafesQueryResolver = resolve<CafesQuery, HookContext<CafesService>>({})
