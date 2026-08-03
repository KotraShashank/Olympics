require('dotenv').config();

const app = require('./app');
const connectDB = require('./src/config/db');
const Sport = require('./src/models/Sport');
const sportsSeedData = require('./src/seed/sportsSeedData');

const PORT = process.env.PORT || 8080;

async function autoSeedSports() {
  const count = await Sport.countDocuments();
  if (count > 0) {
    console.log(`Sports already seeded (${count} found) - skipping.`);
    return;
  }
  console.log('No sports found - auto-seeding 34 sports now...');
  for (const sport of sportsSeedData) {
    await Sport.updateOne({ name: sport.name }, { $setOnInsert: sport }, { upsert: true });
  }
  console.log(`Auto-seed complete: ${sportsSeedData.length} sports inserted.`);
}

connectDB()
  .then(autoSeedSports)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Sports Progression API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Startup failed:', err);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION 💥', err);
  process.exit(1);
});