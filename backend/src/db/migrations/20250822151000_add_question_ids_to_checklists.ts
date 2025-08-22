import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('checklists', (table) => {
    table.text('question_ids'); // Will store a JSON array of question IDs
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('checklists', (table) => {
    table.dropColumn('question_ids');
  });
}
