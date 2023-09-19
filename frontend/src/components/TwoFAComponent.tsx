import { useEffect, useState, ChangeEvent, FC } from "react";
import {
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Input,
  Button,
} from "@chakra-ui/react";

export const TwoFAComponent: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [token, setToken] = useState<string>("");

  const verifyToken = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/2fa/verify`, {
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={undefined}
      motionPreset="slideInBottom"
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Two Factor Authentication
          </AlertDialogHeader>
          <AlertDialogBody>
            <Input
              value={token}
              onChange={handleInputChange}
              placeholder="Enter your token"
            />
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="green" onClick={verifyToken} ml={3}>
              Verify
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
