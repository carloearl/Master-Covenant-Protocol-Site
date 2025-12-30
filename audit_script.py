import asyncio
from playwright.async_api import async_playwright
import json

PAGES_TO_CHECK = [
    "Home", "MasterCovenant", "Consultation", "Blockchain", "SecurityTools", "Contact",
    "NUPSLogin", "NUPSStaff", "NUPSOwner", "About", "Roadmap", "Privacy", "Terms",
    "NotFound", "ConsultationSuccess", "HSSS", "SecurityDocs", "PaymentSuccess",
    "Dashboard", "DreamTeam", "SecurityOperationsCenter", "GovernanceHub",
    "EntertainerCheckIn", "VIPContract", "ImageGenerator", "Partners",
    "ManageSubscription", "Robots", "Sitemap", "FAQ", "Services", "Solutions",
    "ContentGenerator", "GlyphBot", "InteractiveImageStudio", "BillingAndPayments",
    "PaymentCancel", "CommandCenter", "IntegrationTests", "ImageLab", "SitemapXml",
    "SitemapApp", "SitemapImages", "SitemapInteractive", "SitemapDynamic",
    "GlyphBotJunior", "Cookies", "Accessibility", "ProviderConsole", "SDKDocs",
    "HotzoneMapper", "Qr", "VideoUpload", "Mobile", "AboutCarlo",
    "GlyphLockPlayground", "AccountSecurity", "NISTChallenge", "CaseStudies",
    "CaseStudyCovenantVictory", "SiteBuilder", "SiteBuilderTest", "SiteAudit",
    "PartnerPortal", "TrustSecurity", "FullExport", "EmergencyBackup",
    "CaseStudyTruthStrike", "CaseStudyAIBinding", "sitemap-qr", "SitemapQr", "Sie",
    "ProjectUpdates"
]

BASE_URL = "http://localhost:5173"

async def crawl_site():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        results = {}

        for page_name in PAGES_TO_CHECK:
            url = f"{BASE_URL}/{page_name}"
            console_errors = []
            page_errors = []

            page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}"))
            page.on("pageerror", lambda exc: page_errors.append(str(exc)))

            try:
                response = await page.goto(url, wait_until="domcontentloaded")
                status = response.status if response else "No response"

                # Check for broken links (404s)
                if status == 404:
                    results[page_name] = {
                        "url": url,
                        "status": status,
                        "console_errors": console_errors,
                        "page_errors": page_errors,
                        "critical_bug": "Page not found"
                    }
                    continue

                # Check for broken links on the page
                links = await page.eval_on_selector_all("a", "elements => elements.map(el => el.href)")

                results[page_name] = {
                    "url": url,
                    "status": status,
                    "console_errors": console_errors,
                    "page_errors": page_errors,
                    "links": links
                }

            except Exception as e:
                results[page_name] = {
                    "url": url,
                    "status": "Error",
                    "error_message": str(e),
                    "critical_bug": "Page failed to load"
                }

            # Reset error collectors for the next page
            console_errors = []
            page_errors = []


        await browser.close()
        return results

async def main():
    crawl_results = await crawl_site()
    with open("crawl_report.json", "w") as f:
        json.dump(crawl_results, f, indent=2)

if __name__ == "__main__":
    asyncio.run(main())
