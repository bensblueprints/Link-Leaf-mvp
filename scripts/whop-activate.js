/* One-time Whop activation for the self-hosted install: opens a browser for
 * Whop sign-in, verifies the license, writes data/.whop-activated.json.
 * After this the app never contacts Whop again. */
const path = require('path');
const { exec } = require('child_process');
const lic = require('../whop-license');

const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const openUrl = url => new Promise((resolve, reject) => {
  const cmd = process.platform === 'win32' ? `start "" "${url.replace(/&/g, '^&')}"`
    : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
  exec(cmd, err => (err ? reject(err) : resolve()));
});

lic.activateOnce({ dataDir, openUrl })
  .then(r => {
    console.log(r.already ? 'Already activated — nothing to do.' : 'Activated! This install will never contact Whop again.');
    process.exit(0);
  })
  .catch(e => {
    console.error('Activation failed:', e.message);
    if (e.code === 'NO_LICENSE') console.error('Buy a license at https://onetimesuite.com/linkleaf/');
    console.error('\nHeadless server? Run this on any machine with a browser, then copy');
    console.error('data/.whop-activated.json into the server\'s data directory.');
    process.exit(1);
  });
