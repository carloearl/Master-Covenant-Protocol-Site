from playwright.sync_api import sync_playwright, expect
import traceback

def debug_home_page():
    URL = "http://localhost:5173/Home"
    print(f"--- Starting debug script for URL: {URL} ---")

    try:
        with sync_playwright() as p:
            print("1. Launching browser...")
            browser = p.chromium.launch()
            page = browser.new_page()

            console_errors = []
            page_errors = []

            page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}"))
            page.on("pageerror", lambda exc: page_errors.append(str(exc)))

            print(f"2. Navigating to {URL}...")
            response = page.goto(URL, timeout=15000)
            page.wait_for_timeout(10000) # Wait 10 seconds for the page to settle

            print("3. Navigation complete. Analyzing response...")
            status = response.status
            print(f"   - Response Status: {status}")

            # A simple check to see if the main app container is there
            expect(page.locator("#root")).to_be_visible(timeout=5000)
            print("   - #root element is visible.")

            print("4. Checking for errors on the page...")
            print(f"   - Console Errors: {console_errors}")
            print(f"   - Page Errors: {page_errors}")

            if not console_errors and not page_errors and status == 200:
                print("\n--- ✅ SUCCESS: Page loaded without apparent errors. ---")
            else:
                print("\n--- ⚠️  WARNING: Page loaded but with potential errors. ---")

            browser.close()

    except Exception as e:
        print(f"\n--- ❌ CRITICAL FAILURE: The script failed to execute. ---")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Message: {e}")
        print("Traceback:")
        traceback.print_exc()

if __name__ == "__main__":
    debug_home_page()
