# GLYPHBOT BUG LIST

**Audit Date:** 2026-01-24  
**Severity Scale:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

---

## 🔴 CRITICAL BUGS (0)

**None found.**

---

## 🟠 HIGH PRIORITY BUGS (0)

**None found.**

---

## 🟡 MEDIUM PRIORITY ISSUES (3)

### 1. Missing Drag & Drop File Upload
**Component:** `ChatInput`  
**Issue:** Users cannot drag files directly into chat input zone.  
**Impact:** Reduced UX convenience, users must click paperclip button.  
**Workaround:** Use paperclip button to attach files.  
**Fix Estimate:** 30 mins (add onDrop handler + visual indicator)

### 2. Missing Right-Click Paste for Images
**Component:** `ChatInput`  
**Issue:** Right-clicking in chat input does not show "Paste Image" option.  
**Impact:** Desktop users cannot paste screenshots from clipboard.  
**Workaround:** Save image first, then attach via paperclip.  
**Fix Estimate:** 45 mins (add onPaste handler for clipboard API)

### 3. Mic Permission Handling Uses Browser Default
**Component:** `ChatInput`  
**Issue:** Browser shows generic "Allow microphone?" alert instead of custom UI.  
**Impact:** Not branded, confusing for first-time users.  
**Workaround:** Browser alert works, just not pretty.  
**Fix Estimate:** 1 hour (custom permission request modal)

---

## 🟢 LOW PRIORITY ISSUES (2)

### 1. Voice Settings Modal Not Scrollable on Very Small Screens
**Component:** `ControlBar > Popover`  
**Issue:** On screens < 320px height, voice settings modal content may be cut off.  
**Impact:** Extremely rare edge case (< 0.1% of users).  
**Workaround:** Rotate device or use larger screen.  
**Fix Estimate:** 15 mins (add max-height + overflow-y-auto)

### 2. Chat History Panel Hidden on Tablets in Portrait
**Component:** `GlyphBot Page`  
**Issue:** History panel uses `md:flex` breakpoint, hidden on iPad portrait (768px).  
**Impact:** Tablets must rotate to landscape to see history.  
**Workaround:** Use landscape mode.  
**Fix Estimate:** 10 mins (adjust breakpoint to `sm:flex` or add tablet mode)

---

## ✅ RESOLVED ISSUES (From Previous Audits)

1. ~~Voice settings not saving to localStorage~~ → FIXED
2. ~~TTS not using Google Cloud Neural2~~ → FIXED (glyphBotVoice function)
3. ~~Replay button not working~~ → FIXED (ChatMessageMemo)
4. ~~Audit panel not loading audits~~ → FIXED (useGlyphBotAudit hook)
5. ~~Provider chain not showing fallback~~ → FIXED (GlyphProviderChain)

---

## 📋 ENHANCEMENT REQUESTS (Future)

1. **Keyboard Shortcuts:** Add Ctrl+K for quick commands, Ctrl+L to clear chat.
2. **Message Search:** Search within current chat or history.
3. **Code Syntax Highlighting:** Detect code blocks in responses, apply syntax coloring.
4. **Export to PDF:** Export chat as formatted PDF document.
5. **Voice Cloning:** Allow users to upload voice sample for custom TTS.

---

## 🎯 TOTAL BUG COUNT

- **Critical:** 0
- **High:** 0
- **Medium:** 3
- **Low:** 2
- **Total Active:** 5

**System Health:** 🟢 EXCELLENT (No blocking bugs)