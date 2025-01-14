import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('monster', (table: Knex.TableBuilder) => {
    table.string('name').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('monster', (table: Knex.TableBuilder) => {
    table.dropColumn('name');
  });
}
