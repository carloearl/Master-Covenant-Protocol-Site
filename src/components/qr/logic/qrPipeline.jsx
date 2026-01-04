/**
 * @file qrPipeline.js
 * @description Main coordination pipeline for QR generation and security binding.
 * Integrates Time, Frequency, and Encoding domains.
 */

import { generateFrequencyArtifact } from './frequencyDomainAgent';

/**
 * Builds a complete QR artifact by binding data across domains.
 * 
 * @param {Object} params
 * @param {string} params.rawData - The user's input payload.
 * @param {string} params.agent - Identity of the requesting agent.
 * @returns {Promise<Object>} The multi-domain QR artifact.
 */
export async function buildQrArtifact({ rawData, agent }) {
  const timestamp = new Date().toISOString();
  
  // 1. Time-Domain Lane (Raw Input)
  const timeDomainArtifact = {
    lane: "time-domain",
    data: rawData,
    metadata: {
      timestamp,
      provenance: "user-input"
    }
  };

  // 2. Frequency-Domain Lane (Spectral Analysis)
  // Invoking the Frequency-Domain Processing Agent
  let frequencyArtifact;
  try {
    frequencyArtifact = await generateFrequencyArtifact(rawData);
  } catch (error) {
    // Audit log failure but do not crash pipeline if strictly necessary, 
    // though DACO prefers explicit failure.
    console.error("Frequency Agent Failure:", error);
    frequencyArtifact = { 
      error: "AGENT_FAILURE", 
      details: error.message,
      metadata: { uncertainty_buffer: 1 } 
    };
  }

  // 3. Encode-Domain Lane (QR Generation)
  // This is handled by the visual renderer, but we prepare the config here.
  const encodeArtifact = {
    lane: "encode-domain",
    config: {
      ecc: "H", // High error correction for robustness
      mask: "auto"
    }
  };

  // 4. Final Binding
  // Construct the Ledger Entry
  return {
    artifact_id: `art_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp,
    requesting_agent: agent,
    timeDomain: timeDomainArtifact,
    frequencyDomain: frequencyArtifact,
    encodeDomain: encodeArtifact,
    governance_status: "AUDIT_READY"
  };
}