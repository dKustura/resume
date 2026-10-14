"""Render resume_template.html to Denis_Kustura_CV.pdf.

Usage: python scripts/build-cv.py
Needs an internet connection: the Inter font is loaded from Google Fonts.
"""
import pathlib, subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

if __name__ == "__main__":
    pdf = ROOT / "Denis_Kustura_CV.pdf"
    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
         "--virtual-time-budget=5000", f"--print-to-pdf={pdf}",
         (ROOT / "resume_template.html").as_uri()],
        check=True, capture_output=True,
    )
    print(pdf)
