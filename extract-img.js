const fs = require('fs');
const html = fs.readFileSync('c:/d_drive/Fahim-PROJECT/portfolio/index.html', 'utf8');
const m = html.match(/src="data:image\/jpeg;base64,([A-Za-z0-9+/=]+)"/);
if (m) {
  fs.writeFileSync('c:/d_drive/Fahim-PROJECT/portfolio/nextjs-portfolio/public/profile.jpg', Buffer.from(m[1], 'base64'));
  console.log('Saved profile.jpg, size:', Buffer.from(m[1], 'base64').length, 'bytes');
} else {
  console.log('No base64 image match found');
}
