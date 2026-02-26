const selfsigned = require('selfsigned');
const fs = require('fs');

try {
  console.log('Generating certificates...');
  // Try with default attributes
  const pems = selfsigned.generate(null, { days: 365 });
  
  fs.writeFileSync('key.pem', pems.private);
  fs.writeFileSync('cert.pem', pems.cert);
  console.log('Certificates generated successfully.');
} catch (err) {
  console.error('Error generating certificates:', err);
}
