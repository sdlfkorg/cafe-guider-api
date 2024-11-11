// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('cafes', (table) => {
    table.uuid('id', { primaryKey: true })
    table.string('name')
    table.string('city').notNullable()
    table.float('wifi').notNullable()
    table.float('seat').notNullable() 
    table.float('quiet').notNullable()
    table.float('tasty').notNullable()
    table.float('cheap').notNullable()
    table.float('music').notNullable()
    table.string('url').notNullable()
    table.string('address').notNullable()
    table.string('latitude').notNullable()
    table.string('longitude').notNullable()
    table.string('limited_time').notNullable()
    table.string('socket').notNullable()
    table.string('standing_desk').notNullable()
    table.string('mrt').notNullable()
    table.string('open_time').notNullable()
    table.increments('sn', {primaryKey: false}).unique()
  })
}
{
  
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cafes')
}
