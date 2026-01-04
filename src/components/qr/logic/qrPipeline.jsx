import { frequencyDomainTransform } from './frequencyDomain';

export const buildQrArtifact = async (input) => {
  const { rawData, agent = 'claude-base44' } = input;

  // Time-domain representation: simple numeric encoding
  const timeDomainSignal = Array.from(rawData).map((c) => c.charCodeAt(0));

  const freqResult = await frequencyDomainTransform(timeDomainSignal, {
    agent,
    algorithmLabel: 'identity-stub-charCode',
  });

  return {
    qrPayload: rawData,
    frequencyDomain: freqResult,
  };
};