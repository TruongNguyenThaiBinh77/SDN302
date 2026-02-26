const forge = require('node-forge');
const fs = require('fs');

console.log('Generating 2048-bit key-pair...');
const keys = forge.pki.rsa.generateKeyPair(2048);
const cert = forge.pki.createCertificate();

cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

const attrs = [{
  name: 'commonName',
  value: 'localhost'
}, {
  name: 'countryName',
  value: 'US'
}, {
  shortName: 'ST',
  value: 'Virginia'
}, {
  name: 'localityName',
  value: 'Blacksburg'
}, {
  name: 'organizationName',
  value: 'Test'
}, {
  shortName: 'OU',
  value: 'Test'
}];

cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.sign(keys.privateKey, forge.md.sha256.create());

const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
const certificatePem = forge.pki.certificateToPem(cert);

fs.writeFileSync('key.pem', privateKeyPem);
fs.writeFileSync('cert.pem', certificatePem);

console.log('Certificates generated using node-forge: key.pem, cert.pem');
