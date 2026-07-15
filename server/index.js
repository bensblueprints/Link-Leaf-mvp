const PORT = Number(process.env.PORT) || 5307;
const APP_MODE = process.env.APP_MODE || 'single';

// Whop one-time activation (self-hosted single mode only — never phones home after)
if (APP_MODE !== 'multi' && !process.env.SKIP_LICENSE_CHECK) {
  const path = require('path');
  const lic = require('../whop-license');
  const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
  if (!lic.isActivated({ dataDir })) {
    console.error('\nLinkLeaf is not activated on this install yet.');
    console.error('Run once:  npm run activate   (signs in with the Whop account that bought it;');
    console.error('after that this app NEVER contacts Whop again — you own it.)\n');
    process.exit(1);
  }
}

if (APP_MODE === 'multi') {
  const { runMigrations } = require('../scripts/migrate-pg');
  const { createMultiApp } = require('./app-multi');
  runMigrations()
    .then(() => {
      const app = createMultiApp();
      app.listen(PORT, () => {
        console.log(`LinkLeaf (hosted, multi-tenant) running on :${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Migration failed, refusing to start:', err.message);
      process.exit(1);
    });
} else {
  const { createApp } = require('./app');
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Link-in-Bio running`);
    console.log(`  Public page : http://localhost:${PORT}/`);
    console.log(`  Admin panel : http://localhost:${PORT}/admin`);
  });
}
