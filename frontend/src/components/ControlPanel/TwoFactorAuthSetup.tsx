import React, { useEffect, useState } from 'react';

const TwoFactorAuthSetup: React.FC = () => {
  const [qrCodeSrc, setQrCodeSrc] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQrCode() {
      try {
        const response = await fetch('http://localhost:4000/2fa/activate', {
          headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': 'http://localhost:5173',
          },
          credentials: 'include',
        });
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const imgElement = doc.querySelector('img');
        if (imgElement) {
          const imgSrc = imgElement.getAttribute('src');
          if (imgSrc) {
            setQrCodeSrc(imgSrc);
          } else {
            console.error('Failed to fetch QR code: src attribute is null');
          }
        } else {
          console.error('Failed to fetch QR code: img element is null');
        }
      } catch (error) {
        console.error('Failed to fetch QR code:', error);
      }
    }

    fetchQrCode();
  }, []);

  if (!qrCodeSrc) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Two-Factor Authentication Setup</h2>
      <p>Scan the QR code using a 2FA app:</p>
      <img src={qrCodeSrc} alt="QR Code" />
    </div>
  );
};

export default TwoFactorAuthSetup;
