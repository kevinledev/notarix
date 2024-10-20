"use client";
import { useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useFile } from "@/components/providers/fileprovider";
import { Button } from "@/components/ui/button";

//pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//  "pdfjs-dist/build/pdf.worker.min.mjs",
//  import.meta.url,
//).toString();

export default function Sign() {
  const handleSign = () => {
    // Import the SDK only after the component is mounted
    const gateFiSDK = require("@gatefi/js-sdk");

    // Initialize the GateFi SDK with overlay mode
    const overlayInstance = new gateFiSDK.GateFiSDK({
      merchantId: "testID", // Replace with your actual merchant ID
      displayMode: "overlay",
      nodeSelector: "#overlay-button", // Button selector
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl mb-4">PDF Viewer</h1>
      <div className="mb-4" style={{ width: "100%", maxWidth: "600px" }}></div>
      <Button id="overlay-button" onClick={handleSign}>
        Sign
      </Button>
    </div>
  );
}
