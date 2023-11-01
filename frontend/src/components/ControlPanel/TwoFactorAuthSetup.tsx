import { useEffect, useState } from "react";
import { Switch } from "@chakra-ui/react";
import { TwoFAComponent } from "../TwoFAComponent";

const TwoFactorAuthSetup: React.FC = () => {
	const [qrCodeSrc, setQrCodeSrc] = useState<string | null>(null);
	const [isSwitchedOn, setIsSwitchedOn] = useState<boolean>(false);
	const [token, setToken] = useState<string>("");
	const [is2FAActivated, setIs2FAActivated] = useState<boolean>(false);

	function handleTokenChange(event: React.ChangeEvent<HTMLInputElement>) {
		setToken(event.target.value);
	}

	// Fetch initial switch state
	useEffect(() => {
		async function fetchInitialSwitchState() {
			try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}/2fa/is2faactive`, {
					headers: {
						"Access-Control-Allow-Credentials": "true",
						"Access-Control-Allow-Origin": `${import.meta.env.VITE_FRONTEND_URL}`,
					},
					credentials: "include",
				});
				const switchState = await response.json(); // Assuming response is in JSON format
				setIsSwitchedOn(switchState);
				setIs2FAActivated(switchState);
			} catch (error) {
				console.error("Failed to fetch initial switch state:", error);
			}
		}

		fetchInitialSwitchState();
	}, []);

	async function activate2Fa() {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/2fa/activate`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Credentials": "true",
					"Access-Control-Allow-Origin": `${import.meta.env.VITE_FRONTEND_URL}`,
				},
				credentials: "include",
				body: JSON.stringify({ token }),
			});

			if (response.ok) {
				alert("2Fa activated successfully!");
				// Optionally, set 2FA as active and reload or navigate away
				setIsSwitchedOn(true);
				window.location.reload();
			} else {
				setIsSwitchedOn(false);
				alert("Failed to verify token.");
			}
		} catch (error) {
			console.error("An error occurred:", error);
		}
	}

	useEffect(() => {
		if (!isSwitchedOn) {
			return; // Don't fetch if the switch is off
		}
		async function fetchQrCode() {
			try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}/2fa/qrcode`, {
					headers: {
						"Access-Control-Allow-Credentials": "true",
						"Access-Control-Allow-Origin": `${import.meta.env.VITE_FRONTEND_URL}`,
					},
					credentials: "include",
				});
				const text = await response.text();
				const parser = new DOMParser();
				const doc = parser.parseFromString(text, "text/html");
				const imgElement = doc.querySelector("img");
				if (imgElement) {
					const imgSrc = imgElement.getAttribute("src");
					if (imgSrc) {
						setQrCodeSrc(imgSrc);
					} else {
						console.error("Failed to fetch QR code: src attribute is null");
					}
				} else {
					console.error("Failed to fetch QR code: img element is null");
				}
			} catch (error) {
				console.error("Failed to fetch QR code:", error);
			}
		}

		fetchQrCode();
	}, [isSwitchedOn]);

	async function handleFetchToggle2FAuthOff() {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/2fa/deactivate`, {
				method: "PATCH",
				credentials: "include",
				headers: {
					"Access-Control-Allow-Credentials": "true",
					"Access-Control-Allow-Origin": `${import.meta.env.VITE_FRONTEND_URL}`,
				},
			});
			if (response.ok) {
				alert("2Fauth deactivated successfully");
				window.location.reload();
			} else {
				throw new Error("Failed to deactivate 2Fauth.");
			}
		} catch (error) {
			console.error("An error occurred:", error);
		}
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
			<p>
				{isSwitchedOn && !is2FAActivated
					? "Scan the QR code using a 2FA app:"
					: !isSwitchedOn
					? "2Fa is inactive, enable the switch to set up 2FA"
					: "2Fa is active, disable the switch to deactivate 2FA"}
			</p>
			{qrCodeSrc && isSwitchedOn && !is2FAActivated && (
				<img src={qrCodeSrc} alt="QR Code" />
			)}
			{isSwitchedOn && !is2FAActivated && (
				<>
					<input
						type="text"
						value={token}
						onChange={handleTokenChange}
						placeholder="Enter the token from your app"
					/>
					<button onClick={activate2Fa}>Enter token to activate 2Fa</button>
				</>
			)}
		</div>
	);
};

export default TwoFactorAuthSetup;
