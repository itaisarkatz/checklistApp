import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('documents', (table) => {
    table.uuid('company_id').references('id').inTable('companies').onDelete('CASCADE');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('documents', (table) => {
    table.dropColumn('company_id');
  });
}

