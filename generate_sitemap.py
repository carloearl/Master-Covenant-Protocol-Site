"""Generate a unified sitemap.xml using the shared route list.

The same route list powers both the Render deployment (static sitemap)
and the Base44 functions (dynamic sitemap endpoints). Keeping them in a
single JSON file avoids drift between hosting environments.
"""

import json
from pathlib import Path

BASE_URL = "https://glyphlock.io"
ROUTES_FILE = Path("sitemap_routes.json")


def load_routes():
    """Load the canonical routes for the sitemap."""
    routes = json.loads(ROUTES_FILE.read_text())
    return [route if route.startswith("/") else f"/{route}" for route in routes]


def generate_sitemap():
    sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    for route in load_routes():
        url = f"{BASE_URL}{route}"
        sitemap_content += f"  <url>\n    <loc>{url}</loc>\n  </url>\n"

    sitemap_content += "</urlset>"

    Path("public").mkdir(exist_ok=True)
    with open("public/sitemap.xml", "w") as f:
        f.write(sitemap_content)


if __name__ == "__main__":
    generate_sitemap()
