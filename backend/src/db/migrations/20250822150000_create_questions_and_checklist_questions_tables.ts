import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('questions', (table) => {
    table.increments('id').primary();
    table.string('type').notNullable(); // 'condition' or 'question'
    table.text('text').notNullable();
    table.uuid('company_id').references('id').inTable('companies').onDelete('CASCADE');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('checklist_questions', (table) => {
    table.increments('id').primary();
    table.uuid('checklist_id').references('id').inTable('checklists').onDelete('CASCADE');
    table.integer('question_id').references('id').inTable('questions').onDelete('CASCADE');
    table.integer('order').defaultTo(0); // Optional: order of question in checklist
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('checklist_questions');
  await knex.schema.dropTableIfExists('questions');
}
