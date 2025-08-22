import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('checklist_documents', (table) => {
    table.increments('id').primary();
    table.integer('checklist_id').unsigned().references('id').inTable('checklists').onDelete('CASCADE');
    table.integer('document_id').unsigned().references('id').inTable('documents').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('checklist_documents');
}
