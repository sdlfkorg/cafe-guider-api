import { Knex } from "knex";
import crypto from 'crypto';
import { cafes } from "../db-data/cafes";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("cafes").del();

    
    // Inserts seed entries
    await knex("cafes").insert(cafes);
};
