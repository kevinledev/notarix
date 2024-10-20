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

const SCHEMA_DETAILS = {
  pending: [
    { name: "notaries", type: "string[]" },
    { name: "document_title", type: "string" },
    { name: "attestation_status", type: "string" },
    { name: "synaps_session_id", type: "string" },
    { name: "file_url", type: "string" },
    { name: "case_status", type: "string" },
    { name: "paid", type: "bool" },
  ],
  completed: [
    { name: "notaries", type: "string[]" },
    { name: "document_title", type: "string" },
    { name: "attestation_status", type: "string" },
    { name: "synaps_session_id", type: "string" },
    { name: "file_url", type: "string" },
    { name: "case_status", type: "string" },
    { name: "paid", type: "bool" },
    { name: "notary_approved", type: "bool" },
    { name: "notary", type: "string" },
    { name: "submitter_attest_id", type: "string" },
  ],
};

export function decodeSignData(data, schema) {
  return decodeOnChainData(
    data,
    DataLocationOnChain.ONCHAIN,
    SCHEMA_DETAILS[schema],
  );
}
