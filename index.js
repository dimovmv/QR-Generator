import express from 'express';
import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/generate-qr', (req, res) => {
  const { url, format } = req.body;
  const qrCode = qr.image(url, { type: format });

  qrCode.pipe(
    fs.createWriteStream(path.join(__dirname, `public/qr_img.${format}`))
  );

  fs.readFile(path.join(__dirname, `public/qr_img.${format}`), (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to generate QR code.');
    } else {
      const qrCodeBase64 = Buffer.from(data).toString('base64');
      res.json({ image: qrCodeBase64 });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

inquirer
  .prompt([{ message: 'Enter URL: ', name: 'URL' }])
  .then((answers) => {
    // Use user feedback for... whatever!!
    const url = answers.URL;
    const qr_png = qr.image(url);
    const qr_pdf = qr.image(url, { type: 'pdf' });
    qr_png.pipe(fs.createWriteStream('qr_img.png'));
    qr_pdf.pipe(fs.createWriteStream('qr_img.pdf'));
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
