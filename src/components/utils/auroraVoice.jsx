// ✨ GLYPHBOT JR. — AURORA VOICE (v1.0)
// Immutable. Reliable. No configuration.

if (typeof window !== 'undefined') {
  window.GlyphbotJr = (function() {
    const AURORA = {
      rate: 0.92,    // calm, clear pace
      pitch: 1.05,   // warm, neutral tone
      volume: 1.0,
      lang: 'en-US'
    };

    function speak(text) {
      if (!text || typeof text !== 'string' || !('speechSynthesis' in window)) return;
      
      // Clean text
      let clean = text.trim().replace(/<[^>]*>/g, '');
      if (clean && !/[.!?…]$/.test(clean)) clean += '.';

      // Get voices (retry-safe)
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Try to trigger voice load
        window.speechSynthesis.onvoiceschanged = () => {};
        voices = window.speechSynthesis.getVoices();
      }

      // Pick best voice: Google > Natural > local > first English
      const voice = voices.find(v => 
        v.lang === 'en-US' && 
        (v.name.includes('Google') || v.name.includes('Natural') || v.localService)
      ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

      // Speak
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = AURORA.rate;
      utterance.pitch = AURORA.pitch;
      utterance.volume = AURORA.volume;
      utterance.lang = AURORA.lang;
      if (voice) utterance.voice = voice;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }

    // Auto-bind to buttons with [data-glyphbot-jr-listen]
    // Using a flag to prevent double binding if module is hot-reloaded
    if (!window.__aurora_listener_attached) {
      document.addEventListener('click', (e) => {
        // Handle button or icon inside button
        const target = e.target.closest('[data-glyphbot-jr-listen]');
        if (target) {
          const text = target.getAttribute('data-text') || 
                       target.closest('[data-message]')?.innerText ||
                       // Fallback for React markdown containers
                       target.parentElement?.innerText?.replace('Listen', '').trim() || 
                       'Hello. How can I help?';
          speak(text);
        }
      });
      window.__aurora_listener_attached = true;
    }

    return { speak };
  })();
}

export const speak = (text) => {
  if (typeof window !== 'undefined' && window.GlyphbotJr) {
    window.GlyphbotJr.speak(text);
  }
};

export default { speak };