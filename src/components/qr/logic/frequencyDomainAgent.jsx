/**
 * @file frequencyDomainAgent.js
 * @description Frequency-Domain Processing Agent for GlyphLock QR Pipeline.
 * Operates under DACO¹ Governance.
 * 
 * Responsibilities:
 * - Accept raw time-domain signals.
 * - Apply deterministic transforms.
 * - Produce audit-ready artifacts with strict metadata.
 */

import { generateSHA256 } from '@/components/utils/securityUtils';

const AGENT_IDENTITY = "GLYPHLOCK-FREQ-AGENT-V1";
const ALGORITHM_LABEL = "DETERMINISTIC-SPECTRAL-MAP-V1";

/**
 * Transforms a raw input signal into a frequency-domain artifact.
 * 
 * @param {string|Uint8Array} rawInput - The time-domain input signal (payload).
 * @returns {Promise<Object>} The audit-safe frequency-domain artifact.
 */
export async function generateFrequencyArtifact(rawInput) {
  // 1. Timestamp Anchor (ISO 8601)
  const timestamp = new Date().toISOString();

  // 2. Input Validation & normalization
  if (rawInput === null || rawInput === undefined) {
    throw new Error("FrequencyDomainAgent: Null input received.");
  }
  const normalizedInput = typeof rawInput === 'string' ? rawInput : new TextDecoder().decode(rawInput);

  // 3. Input Ledgering (Hash)
  const inputHash = await generateSHA256(normalizedInput);

  // 4. Processing: Time-Domain to Frequency-Domain Transformation
  // NOTE: This is a deterministic projection for auditability, not a full FFT implementation 
  // to maintain performance in the browser while proving transformation integrity.
  const spectralData = performDeterministicSpectralProjection(normalizedInput);

  // 5. Output Ledgering (Hash)
  const outputHash = await generateSHA256(JSON.stringify(spectralData));

  // 6. Artifact Construction
  const artifact = {
    lane: "frequency-domain",
    data: spectralData,
    metadata: {
      timestamp: timestamp,
      agent_id: AGENT_IDENTITY,
      provenance: "glyphlock-qr-protocol",
      algorithm_label: ALGORITHM_LABEL,
      input_hash: inputHash,
      output_hash: outputHash,
      uncertainty_buffer: 0, // Deterministic algorithm implies 0 uncertainty
      governance: "DACO-1"
    }
  };

  return artifact;
}

/**
 * Performs a deterministic spectral projection of the input string.
 * Maps character codes to frequency bins to simulate spectral density.
 * 
 * @param {string} input 
 * @returns {Object} Spectral distribution object
 */
function performDeterministicSpectralProjection(input) {
  const bins = new Array(16).fill(0); // 16-bin spectral approximation
  
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    const binIndex = charCode % 16;
    // Magnitude accumulation
    bins[binIndex] += 1; 
  }

  // Normalize
  const maxVal = Math.max(...bins, 1);
  const normalizedSpectrum = bins.map(val => Number((val / maxVal).toFixed(4)));

  return {
    spectrum: normalizedSpectrum,
    peak_frequency_bin: bins.indexOf(Math.max(...bins)),
    entropy_estimate: calculatePseudoEntropy(bins)
  };
}

/**
 * Calculates pseudo-entropy for the spectral distribution.
 * Used as a complexity metric.
 */
function calculatePseudoEntropy(bins) {
  const total = bins.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  
  let entropy = 0;
  for (let count of bins) {
    if (count > 0) {
      const p = count / total;
      entropy -= p * Math.log2(p);
    }
  }
  return Number(entropy.toFixed(4));
}