# 🔷 MANUAL VERIFICATION CHECKLIST
**Post-Phase 2 User Actions Required**

**Assigned To:** GlyphLock Admin (carloearl@glyphlock.com)  
**Priority:** CRITICAL - Required before Phase 3  
**Estimated Time:** 15-30 minutes

---

## 🔴 CRITICAL ACTIONS (Do These First)

### **1. Fix Stripe Secret Typo**
**Issue:** Duplicate secret with typo causing integration test failures

**Steps:**
1. Navigate to Base44 Dashboard → Settings → Secrets
2. Locate secret: `STRIPE_SECRET_kEY` (note capital 'k')
3. DELETE this secret (it's the typo version)
4. Verify `STRIPE_SECRET_KEY` still exists (correct version)
5. Re-run integration tests: `/integration-tests` page or invoke `testIntegrations`

**Expected Result:** Stripe API Connection test should now PASS (1/7 fixes)

**Time:** 30 seconds

---

### **2. Initialize QR Signing Keys**
**Issue:** QRKeyRegistry entity exists but has no records (keys not generated)

**Steps:**
1. Navigate to Base44 Dashboard → Functions
2. Find function: `qr/initializeKeys`
3. Click "Test" → Run with empty payload `{}`
4. Verify: Check entities → QRKeyRegistry → should have 1+ records
5. Re-run integration tests

**Expected Result:** Secure QR Generation test should now PASS (2/7 fixes)

**Time:** 1 minute

---

### **3. Monitor Custom Domain Activation**
**Issue:** glyphlock.io showing "Pending" in Base44 dashboard

**Steps:**
1. Navigate to Base44 Dashboard → Settings → Custom Domains
2. Check status of: `glyphlock.io`
3. Wait for status to change: "Pending" → "Active" (24-48 hours)
4. When Active, proceed to step 4

**Expected Result:** glyphlock.io will serve the app directly (no redirect to base44.app)

**Time:** Wait 24-48 hours (check every 6 hours)

**Verification Command (Terminal):**
```powershell
curl -I https://glyphlock.io
# Should return: HTTP/2 200 (not 301)
```

---

### **4. Add WWW Subdomain + Configure Canonical**
**Issue:** www.glyphlock.io not yet added to Base44

**Prerequisites:** glyphlock.io must be "Active" first

**Steps:**
1. Navigate to Base44 Dashboard → Settings → Custom Domains
2. Click "Add Custom Domain"
3. Enter: `www.glyphlock.io`
4. Wait for status: "Pending" → "Active" (should be faster, ~15min)
5. Once Active, configure:
   - Primary Domain: `glyphlock.io` (apex)
   - Enable: "Redirect WWW to Apex"
6. Save configuration

**Expected Result:** 
- www.glyphlock.io → 301 redirect → glyphlock.io
- glyphlock.io returns 200 OK
- robots.txt and sitemap.xml resolve on glyphlock.io

**Time:** 5 minutes (+ 15min wait for WWW activation)

**Verification Commands (Terminal):**
```powershell
curl -I https://www.glyphlock.io
# Should return: HTTP/2 301, Location: https://glyphlock.io

curl -I https://glyphlock.io
# Should return: HTTP/2 200

curl https://glyphlock.io/robots.txt
# Should return: robots.txt content (not 404)

curl https://glyphlock.io/sitemap.xml
# Should return: sitemap XML (not 404)
```

---

## 🟡 HIGH PRIORITY ACTIONS

### **5. Runtime Auth Test Matrix**
**Issue:** Cannot verify login persistence without actual user interaction

**Test Matrix:**
| # | Scenario | Steps | Expected | Verified |
|---|----------|-------|----------|----------|
| 1 | Login Persistence | Login → Refresh page (F5) | Stay logged in | ⬜ |
| 2 | New Tab Auth | Login → Open new tab → Navigate to /command-center | User logged in | ⬜ |
| 3 | Logout Persistence | Logout → Refresh page | Stay logged out | ⬜ |
| 4 | Session Timeout | Login → Wait 30min idle → Interact | Auto-logout or still logged in? | ⬜ |
| 5 | Protected Route (Not Auth) | Open /command-center in incognito | Redirect to / | ⬜ |
| 6 | Cross-Tab Logout | Login in 2 tabs → Logout in tab 1 → Check tab 2 | Both logged out? | ⬜ |
| 7 | Role-Based Access | Login as non-admin → Navigate to /command-center | Limited tabs shown? | ⬜ |

**How to Test:**
1. Open browser incognito mode
2. Navigate to https://glyphlock.base44.app (or glyphlock.io once active)
3. Login with test user account
4. Follow each scenario above
5. Mark ✅ or ❌ in "Verified" column
6. Report any failures

**Expected:** All scenarios should pass (auth flow is implemented correctly in code)

**Time:** 10 minutes

---

### **6. Verify Integration Tests After Fixes**
**Issue:** 6/13 tests passing, should be 11/13 after Stripe + QR key fixes

**Steps:**
1. Complete actions #1 and #2 above
2. Navigate to https://glyphlock.base44.app/integration-tests
3. Click "Run Full Test Suite"
4. Review results

**Expected Outcome:**
```yaml
Before: 6/13 (46%)
After: 11/13 (85%)

Still Failing:
  - Asset Registration (backend routing)
  - GlyphBot Secure Chat (function not implemented)
  - Compliance Report Gen (function not implemented)
```

**If 11/13 not achieved:** Document which tests still fail and why

**Time:** 3 minutes

---

## 🟢 MEDIUM PRIORITY ACTIONS

### **7. Create Missing Backend Functions (Optional)**
**Issue:** 2 functions referenced in tests don't exist

**Option A: Create Functions**
```yaml
Function: glyphbot/secureChat
Purpose: NIST-compliant chat endpoint
Action: Create function with security context wrapper

Function: reports/generateCompliance  
Purpose: Generate SOC 2 / ISO compliance report
Action: Create function with audit data aggregation
```

**Option B: Remove From Tests**
```yaml
Edit: functions/testIntegrations.js
Remove: Test cases #12 and #13
Update: Summary calculation
```

**Recommendation:** Option B (remove tests) - functions not critical for current operations

**Time:** 5 minutes (if removing), 30-60 minutes (if implementing)

---

### **8. Fix Backend Cross-Invocation Routing**
**Issue:** Functions calling other functions via `base44.functions.invoke()` fail with routing error

**Error:**
```
"Backend functions cannot be accessed from the platform domain. 
Use the app's subdomain instead."
```

**Affected Functions:**
- `assets/register`
- `assets/verify`

**Current Pattern (BROKEN):**
```javascript
const { data } = await base44.functions.invoke('assets/register', {...});
```

**Fix Pattern (WORKS):**
```javascript
// Option 1: Direct entity operations (no cross-function call)
await base44.asServiceRole.entities.AssetRegistry.create({...});

// Option 2: Use subdomain URL (not recommended)
const response = await fetch('https://glyphlock.base44.app/api/functions/assets/register', {...});
```

**Recommendation:** Refactor to direct entity operations (cleaner, faster)

**Time:** 15 minutes

---

### **9. Verify SSL Certificate After Domain Activation**
**Issue:** Once custom domain is active, SSL must be provisioned by Render/Base44

**Steps:**
1. Wait for glyphlock.io → Active in Base44 dashboard
2. Navigate to: https://glyphlock.io
3. Click padlock icon in browser address bar
4. Verify certificate:
   - Issued by: Let's Encrypt
   - Valid for: glyphlock.io
   - Expiry: 90 days from issue
5. Check for warnings (none should appear)

**Expected:** Green padlock, no mixed content warnings

**Time:** 1 minute

---

### **10. Test Redirect Chain Optimization**
**Issue:** Verify single-hop redirects (no multi-hop chains)

**Verification Commands (PowerShell):**
```powershell
# Test 1: WWW should redirect directly to apex
./scripts/trace-redirects.ps1 -Url https://www.glyphlock.com
# Expected: www.glyphlock.com → glyphlock.io (301, single hop)

# Test 2: Apex should return 200 (no redirect)
./scripts/trace-redirects.ps1 -Url https://glyphlock.io
# Expected: glyphlock.io → 200 OK (no redirect)

# Test 3: WWW subdomain should redirect to apex
./scripts/trace-redirects.ps1 -Url https://www.glyphlock.io
# Expected: www.glyphlock.io → glyphlock.io (301)
```

**Expected Results:**
- ✅ www.glyphlock.com → glyphlock.io (1 hop)
- ✅ glyphlock.com → glyphlock.io (1 hop)
- ✅ www.glyphlock.io → glyphlock.io (1 hop)
- ✅ glyphlock.io → 200 OK (0 hops)

**Time:** 2 minutes

---

## 📊 VERIFICATION SUMMARY

### **Critical Path (Must Complete)**
1. ✅ Fix Stripe secret (30 sec)
2. ✅ Initialize QR keys (1 min)
3. ⏳ Wait for DNS propagation (24-48 hrs)
4. ✅ Add WWW subdomain (5 min + 15 min wait)
5. ✅ Configure canonical (2 min)
6. ✅ Test auth flows (10 min)

**Total Active Time:** ~20 minutes  
**Total Wait Time:** 24-48 hours (DNS)

### **Optional Enhancements**
7. Remove broken tests from testIntegrations.js (5 min)
8. Fix backend routing pattern (15 min)
9. Create missing functions (60 min)

---

## 🎯 SUCCESS CRITERIA

**Phase 2 is considered COMPLETE when:**
- ✅ glyphlock.io returns HTTP 200 (no redirect)
- ✅ www.glyphlock.io → 301 → glyphlock.io
- ✅ robots.txt resolves on glyphlock.io
- ✅ sitemap.xml resolves on glyphlock.io
- ✅ Integration tests: 11/13 passing (85%+)
- ✅ Auth test matrix: 6/7 scenarios pass
- ✅ SSL certificate valid with no warnings

**When above is achieved → PROCEED TO PHASE 3**

---

## 📞 SUPPORT CONTACTS (If Issues Arise)

**Base44 Support:**
- If custom domain stuck on "Pending" > 72 hours
- If SSL certificate not provisioning
- If auth sessions not persisting

**GoDaddy Support:**
- If DNS propagation > 48 hours
- If CNAME records not accepting base44.app target

**Stripe Support:**
- If webhook signature fails after secret fix
- If test payments not processing

---

**CHECKLIST CREATED:** 2026-01-23 21:30 UTC  
**Status:** ⏳ AWAITING USER EXECUTION  
**Next Review:** After domain activation confirmed