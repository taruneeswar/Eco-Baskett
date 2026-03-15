require('dotenv').config();
const mongoose = require('mongoose');

const SOURCE_URI = process.env.SOURCE_MONGODB_URI || 'mongodb://127.0.0.1:27017';
const SOURCE_DB_NAME = process.env.SOURCE_DB_NAME || 'ecobasket';
const TARGET_URI = process.env.MONGODB_URI || process.env.ATLAS_URI;
const TARGET_DB_NAME = process.env.MONGODB_DB_NAME || process.env.ATLAS_DB_NAME || 'ecobasket';
const COLLECTIONS = (process.env.COPY_COLLECTIONS || 'products,users,orders')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function maskUri(uri) {
  if (!uri) return '<missing>';
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:<hidden>@');
}

(async () => {
  let sourceConn;
  let targetConn;

  try {
    if (!TARGET_URI) {
      throw new Error('TARGET_URI missing. Set MONGODB_URI or ATLAS_URI in .env');
    }

    console.log('\n=== Compass -> Atlas Transfer ===\n');
    console.log(`Source: ${maskUri(SOURCE_URI)} / ${SOURCE_DB_NAME}`);
    console.log(`Target: ${maskUri(TARGET_URI)} / ${TARGET_DB_NAME}`);
    console.log(`Collections: ${COLLECTIONS.join(', ')}\n`);

    sourceConn = await mongoose.createConnection(SOURCE_URI, {
      dbName: SOURCE_DB_NAME,
      serverSelectionTimeoutMS: 10000,
      family: 4,
    }).asPromise();

    targetConn = await mongoose.createConnection(TARGET_URI, {
      dbName: TARGET_DB_NAME,
      serverSelectionTimeoutMS: 15000,
      family: 4,
    }).asPromise();

    for (const name of COLLECTIONS) {
      const sourceCol = sourceConn.db.collection(name);
      const targetCol = targetConn.db.collection(name);

      const docs = await sourceCol.find({}).toArray();
      await targetCol.deleteMany({});

      if (docs.length > 0) {
        await targetCol.insertMany(docs, { ordered: false });
      }

      console.log(`Transferred ${name}: ${docs.length}`);
    }

    console.log('\nTransfer complete.\n');
    process.exit(0);
  } catch (err) {
    console.error('\nTransfer failed:', err.message);
    process.exit(1);
  } finally {
    if (sourceConn) await sourceConn.close();
    if (targetConn) await targetConn.close();
  }
})();
