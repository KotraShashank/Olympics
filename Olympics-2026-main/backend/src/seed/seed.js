// Mirrors: data.sql (INSERT IGNORE ... idempotent seeding)
// Run with: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Sport = require('../models/Sport');
const sportsData = require('./sportsSeedData');

(async () => {
  await connectDB();

  let inserted = 0;
  let skipped = 0;

  for (const sport of sportsData) {
    const result = await Sport.updateOne(
      { name: sport.name },
      { $setOnInsert: sport },
      { upsert: true }
    );
    if (result.upsertedCount > 0) inserted += 1;
    else skipped += 1;
  }

  console.log(`Seed complete. Inserted: ${inserted}, already existed: ${skipped}, total: ${sportsData.length}`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
