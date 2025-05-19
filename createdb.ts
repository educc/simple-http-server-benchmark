import { Database } from "bun:sqlite";
import { faker } from "@faker-js/faker";

const DB_NAME = "data.db"
// Check if the database file exists
async function main() {
  const dbExists = await Bun.file(DB_NAME).exists();

  if (dbExists) {
    await Bun.file(DB_NAME).delete();
    console.log(`Deleted existing database file: ${DB_NAME}`);
  }

  // Create and connect to the database
  const db = new Database(DB_NAME, { strict: true });

  // Enable better formatting for SQLite output
  db.run("PRAGMA table_info(person)");
  db.run("PRAGMA strict=ON");

  // Create the person5 table with 5 fields
  db.run(`
    CREATE TABLE IF NOT EXISTS person5 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT,
      email TEXT,
      phone TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create the person30 table with 30 fields
  db.run(`
    CREATE TABLE IF NOT EXISTS person30 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT,
      email TEXT,
      phone TEXT,
      date_of_birth DATE,
      gender TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      zip_code TEXT,
      country TEXT,
      occupation TEXT,
      company TEXT,
      salary DECIMAL(10,2),
      education_level TEXT,
      marital_status TEXT,
      number_of_children INTEGER,
      height_cm DECIMAL(5,2),
      weight_kg DECIMAL(5,2),
      blood_type TEXT,
      eye_color TEXT,
      hair_color TEXT,
      favorite_color TEXT,
      hobbies TEXT,
      languages TEXT,
      social_security_number TEXT,
      passport_number TEXT,
      driver_license TEXT,
      emergency_contact TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Function to generate a random person with 5 fields
  function generateRandomPerson5() {
    return {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number()
    };
  }

  // Function to generate a random person with 30 fields
  function generateRandomPerson30() {
    return {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      date_of_birth: faker.date.birthdate().toISOString().split('T')[0],
      gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip_code: faker.location.zipCode(),
      country: faker.location.country(),
      occupation: faker.person.jobTitle(),
      company: faker.company.name(),
      salary: faker.number.float({ min: 30000, max: 200000, precision: 2 }),
      education_level: faker.helpers.arrayElement(['High School', 'Bachelor', 'Master', 'PhD']),
      marital_status: faker.helpers.arrayElement(['Single', 'Married', 'Divorced', 'Widowed']),
      number_of_children: faker.number.int({ min: 0, max: 5 }),
      height_cm: faker.number.float({ min: 150, max: 200, precision: 2 }),
      weight_kg: faker.number.float({ min: 45, max: 120, precision: 2 }),
      blood_type: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      eye_color: faker.helpers.arrayElement(['Blue', 'Brown', 'Green', 'Hazel']),
      hair_color: faker.helpers.arrayElement(['Black', 'Brown', 'Blonde', 'Red', 'Gray']),
      favorite_color: faker.helpers.arrayElement(['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange']),
      hobbies: faker.helpers.arrayElements(['Reading', 'Sports', 'Music', 'Cooking', 'Travel', 'Photography'], 3).join(', '),
      languages: faker.helpers.arrayElements(['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'], 2).join(', '),
      social_security_number: faker.helpers.replaceSymbols('###-##-####'),
      passport_number: faker.helpers.replaceSymbols('##??####'),
      driver_license: faker.helpers.replaceSymbols('??###???'),
      emergency_contact: faker.phone.number()
    };
  }

  // Function to insert records into person5 table
  function insertPerson5Records(count: number) {
    const insert = db.prepare(`
      INSERT INTO person5 (first_name, last_name, email, phone)
      VALUES (@first_name, @last_name, @email, @phone)
    `);

    console.log('Starting to populate person5 table...');
    const startTime = Date.now();

    db.transaction(() => {
      for (let i = 0; i < count; i++) {
        const person = generateRandomPerson5();
        if (i === 0) {
          console.log('Sample person5 data:', person);
        }
        insert.run(person);
        if (i % 10000 === 0) {
          console.log(`Inserted ${i} records into person5...`);
        }
      }
    })();

    const endTime = Date.now();
    console.log(`person5 table population completed in ${(endTime - startTime) / 1000} seconds`);
  }

  // Function to insert records into person30 table
  function insertPerson30Records(count: number) {
    const insert = db.prepare(`
      INSERT INTO person30 (
        first_name, last_name, email, phone, date_of_birth, gender,
        address, city, state, zip_code, country, occupation, company,
        salary, education_level, marital_status, number_of_children,
        height_cm, weight_kg, blood_type, eye_color, hair_color,
        favorite_color, hobbies, languages, social_security_number,
        passport_number, driver_license, emergency_contact
      ) VALUES (
        @first_name, @last_name, @email, @phone, @date_of_birth, @gender,
        @address, @city, @state, @zip_code, @country, @occupation, @company,
        @salary, @education_level, @marital_status, @number_of_children,
        @height_cm, @weight_kg, @blood_type, @eye_color, @hair_color,
        @favorite_color, @hobbies, @languages, @social_security_number,
        @passport_number, @driver_license, @emergency_contact
      )
    `);

    console.log('Starting to populate person30 table...');
    const startTime = Date.now();

    db.transaction(() => {
      for (let i = 0; i < count; i++) {
        const person = generateRandomPerson30();
        if (i === 0) {
          console.log('Sample person30 data:', person);
        }
        insert.run(person);
        if (i % 10000 === 0) {
          console.log(`Inserted ${i} records into person30...`);
        }
      }
    })();

    const endTime = Date.now();
    console.log(`person30 table population completed in ${(endTime - startTime) / 1000} seconds`);
  }

  // Insert records into both tables
  const RECORD_COUNT = 100000;
  insertPerson5Records(RECORD_COUNT);
  insertPerson30Records(RECORD_COUNT);

  // Display sample records from both tables
  console.log('\nSample records from person5:');
  const sampleRecords5 = db.query(`
    SELECT * FROM person5 LIMIT 5
  `).all();
  console.table(sampleRecords5);

  console.log('\nSample records from person30:');
  const sampleRecords30 = db.query(`
    SELECT id, first_name, last_name, email, phone, date_of_birth, gender, occupation, salary
    FROM person30 LIMIT 5
  `).all();
  console.table(sampleRecords30);

  // Close the database connection
  db.close();
}

main();
