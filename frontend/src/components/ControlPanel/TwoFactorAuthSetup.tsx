import { useEffect, useState } from 'react';
import { Switch } from '@chakra-ui/react';
import { TwoFAComponent } from '../TwoFAComponent';

const TwoFactorAuthSetup: React.FC = () => {
  const [qrCodeSrc, setQrCodeSrc] = useState<string | null>(null);
  const [isSwitchedOn, setIsSwitchedOn] = useState<boolean>(false);

  useEffect(() => {
    if (!isSwitchedOn) {
      return; // Don't fetch if the switch is off
    }

    async function fetchQrCode() {
      try {
        const response = await fetch(`http://localhost:4000/2fa/activate`, {
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
  }, [isSwitchedOn]);

  async function handleFetchToggle2FAuthOff() {
    try {
      const response = await fetch(
        `http://localhost:4000/2fa/deactivate`,
        {
          method: "PATCH",
          credentials: "include",
          // 'Access-Control-Allow-Credentials': 'true',
          // 'Access-Control-Allow-Origin': 'http://localhost:5173',
        }
      );
      if (response.ok) {
        alert("2Fauth deactivated successfully");
      } else {
        throw new Error("Failed to deactivate 2Fauth.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    // window.location.reload();
  }

  function handleToggle() {
    if (isSwitchedOn === false) {
      setIsSwitchedOn(true);
    } else {
      handleFetchToggle2FAuthOff();
      setIsSwitchedOn(false);
    }
  }


  return (
    <div>
      <h2>Two-Factor Authentication Setup</h2>
      <Switch isChecked={isSwitchedOn} onChange={handleToggle} />
      <p>{isSwitchedOn ? 'Scan the QR code using a 2FA app:' : 'Enable the switch to set up 2FA'}</p>
      {qrCodeSrc && isSwitchedOn && <img src={qrCodeSrc} alt="QR Code" />}
      {isSwitchedOn && <TwoFAComponent/>}
    </div>
  );
};

export default TwoFactorAuthSetup;
