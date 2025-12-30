import json

PAGES = [
    "Home", "MasterCovenant", "Consultation", "Blockchain", "SecurityTools", "Contact",
    "NUPSLogin", "NUPSStaff", "NUPSOwner", "About", "Roadmap", "Privacy", "Terms",
    "ConsultationSuccess", "HSSS", "SecurityDocs", "PaymentSuccess",
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
    "CaseStudyTruthStrike", "CaseStudyAIBinding", "SitemapQr", "Sie",
    "ProjectUpdates"
]

BASE_URL = "https://glyphlock.io"

def generate_sitemap():
    sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\\n'
    sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n'

    for page in PAGES:
        if page == "NotFound":
            continue

        url = f"{BASE_URL}/{page}"
        sitemap_content += f"  <url>\\n    <loc>{url}</loc>\\n  </url>\\n"

    sitemap_content += "</urlset>"

    with open("public/sitemap.xml", "w") as f:
        f.write(sitemap_content)

if __name__ == "__main__":
    generate_sitemap()
