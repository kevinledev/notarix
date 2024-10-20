import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  IndexService,
  decodeOnChainData,
  DataLocationOnChain,
} from "@ethsign/sp-sdk";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SCHEMA_DETAILS = [
  { name: "notaries", type: "string[]" },
  { name: "document_title", type: "string" },
  { name: "attestation_status", type: "string" },
  { name: "synaps_session_id", type: "string" },
  { name: "affadavit_recording", type: "string" },
  { name: "case_status", type: "string" },
  { name: "paid", type: "bool" },
];

export function decodeSignData(data) {
  return decodeOnChainData(data, DataLocationOnChain.ONCHAIN, SCHEMA_DETAILS);
}
