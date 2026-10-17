"""Render resume_template.html to Denis_Kustura_CV.pdf (also copied to
public/resume.pdf for the site) and scripts/og-image.html to public/og-image.png.

Usage: python scripts/build-cv.py
Needs an internet connection: the Inter font is loaded from Google Fonts.
Set CHROME to a Chrome/Chromium binary if it isn't found automatically.
"""
import os, pathlib, shutil, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
]
CHROME_COMMANDS = ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]


def find_chrome():
    if os.environ.get("CHROME"):
        return os.environ["CHROME"]
    for path in CHROME_CANDIDATES:
        if pathlib.Path(path).exists():
            return path
    for command in CHROME_COMMANDS:
        if found := shutil.which(command):
            return found
    sys.exit("Chrome not found. Set the CHROME environment variable to its path.")


def render(chrome, source, *args):
    subprocess.run(
        [chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
         "--virtual-time-budget=5000", *args, source.as_uri()],
        check=True, capture_output=True,
    )


if __name__ == "__main__":
    chrome = find_chrome()

    pdf = ROOT / "Denis_Kustura_CV.pdf"
    render(chrome, ROOT / "resume_template.html", "--no-pdf-header-footer", f"--print-to-pdf={pdf}")
    shutil.copyfile(pdf, ROOT / "public" / "resume.pdf")
    print(pdf)

    og_image = ROOT / "public" / "og-image.png"
    render(chrome, ROOT / "scripts" / "og-image.html", "--window-size=1200,630", f"--screenshot={og_image}")
    print(og_image)
