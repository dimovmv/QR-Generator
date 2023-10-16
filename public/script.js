const form = document.getElementById('qr-form');
const qrCodeImg = document.getElementById('qr-code-img');
const downloadLink = document.getElementById('download-link');
const pdfViewer = document.getElementById('pdf-viewer');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const url = formData.get('url');
  const format = formData.get('format');

  try {
    const response = await fetch('/generate-qr', {
      method: 'POST',
      body: JSON.stringify({ url, format }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const qrCodeData = await response.json();

      if (format === 'png') {
        qrCodeImg.src = `data:image/png;base64,${qrCodeData.image}`;
        qrCodeImg.style.display = 'block';
        pdfViewer.style.display = 'none'; // Hide the PDF viewer
      } else if (format === 'pdf') {
        pdfViewer.src = `data:application/pdf;base64,${qrCodeData.image}`;
        pdfViewer.style.display = 'block';
        qrCodeImg.style.display = 'none'; // Hide the PNG image
      }

      downloadLink.href = `data:${format};base64,${qrCodeData.image}`;
      downloadLink.style.display = 'block';
    } else {
      console.error('Failed to generate QR code.');
    }
  } catch (error) {
    console.error(error);
  }
});

downloadLink.addEventListener('click', () => {
  const format = form.format.value;
  downloadLink.download = `qr-code.${format}`;
});
