#!/usr/bin/env python3
"""Fix the document properties of a CV exported from Canva, without touching its content.

    python3 scripts/clean-cv-pdf.py ~/Downloads/CV_PT.pdf public/Ruben_Martins_CV_PT.pdf \
        --title "Ruben Martins — CV" --author "Ruben Martins" --lang pt-PT
    python3 scripts/clean-cv-pdf.py ~/Downloads/CV_EN.pdf public/Ruben_Martins_CV_EN.pdf \
        --title "Ruben Martins — CV" --author "Ruben Martins" --lang en-GB

What it fixes (all invisible on the page, but visible in the browser tab, in "Document
properties" and to screen readers):
  * title   -> a Canva template name ("Mary fez") in BOTH places a viewer may read it:
               the Info dictionary and the XMP packet
  * author  -> another person's name ("JDM Culture PT")
  * keywords-> a Canva design id
  * language-> the document was declared Indonesian ("id-ID"), so a screen reader would
               read Portuguese text with an Indonesian voice

How: PDFKit (macOS) rewrites the Info dictionary; the XMP packet and the /Lang entry are then
edited IN PLACE. The XMP packet ships with ~2 KB of blank padding for exactly this purpose, so
the new title is paid for out of that padding, so this step changes no byte offsets and nothing
else in the file can move (PDFKit's own rewrite, just before it, adds about 1 KB).

It then runs `clean-pdf-metadata.swift compare` (text, page size, links and a pixel-by-pixel
render of every page against the original) and exits non-zero if anything differs.
Only publish the output if this script ends with "OK".
"""
import argparse
import html
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SWIFT = HERE / "clean-pdf-metadata.swift"


def run(*cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def patch_xmp(data: bytes, title: str, lang: str) -> bytes:
    m = re.search(rb'<\?xpacket begin.*?<\?xpacket end="w"\?>', data, re.S)
    if not m:
        sys.exit("No XMP packet found; nothing to patch (Info dictionary was still updated).")
    packet = m.group(0)

    new = re.sub(
        rb'(<rdf:li xml:lang="[^"]*">)([^<]*)(</rdf:li>)',
        lambda x: x.group(1) + html.escape(title, quote=False).encode("utf-8") + x.group(3),
        packet,
    )
    old_lang = re.search(rb'dc:language="([^"]+)"', packet)
    if old_lang:
        if len(old_lang.group(1)) != len(lang):
            sys.exit(f"--lang must have {len(old_lang.group(1))} characters (same as {old_lang.group(1).decode()})")
        new = new.replace(old_lang.group(1), lang.encode())

    # pay for (or return) the size difference with the blank padding before <?xpacket end
    delta = len(new) - len(packet)
    tail = re.search(rb"([ \t\r\n]*)(<\?xpacket end)", new)
    pad = tail.group(1)
    if delta > 0 and len(pad) <= delta + 32:
        sys.exit("Not enough XMP padding for this title; use a shorter one.")
    new = new[: tail.start(1)] + (pad[:-delta] if delta > 0 else pad + b" " * -delta) + new[tail.start(2):]
    assert len(new) == len(packet), "XMP packet size must not change"
    return data[: m.start()] + new + data[m.end():]


def patch_lang(data: bytes, lang: str) -> bytes:
    def swap(m):
        if len(m.group(1)) != len(lang):
            sys.exit(f"--lang must have {len(m.group(1))} characters")
        return b"/Lang (" + lang.encode() + b")"
    return re.sub(rb"/Lang\s*\(([^)]*)\)", swap, data)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--title", required=True)
    ap.add_argument("--author", required=True)
    ap.add_argument("--lang", required=True, help="5 characters, e.g. pt-PT or en-GB")
    a = ap.parse_args()

    r = run("swift", str(SWIFT), "clean", a.src, a.dst, a.title, a.author)
    if r.returncode:
        sys.exit(r.stderr or r.stdout)

    dst = Path(a.dst)
    data = dst.read_bytes()
    size = len(data)
    data = patch_lang(patch_xmp(data, a.title, a.lang), a.lang)
    assert len(data) == size, "file size must not change"
    dst.write_bytes(data)

    print(f"properties rewritten; file size unchanged ({size} bytes)")
    r = run("swift", str(SWIFT), "compare", a.src, a.dst)
    print(r.stdout.strip())
    if r.returncode:
        sys.exit("FAILED: the cleaned file differs from the original. Do not publish it.")

    left = [w for w in (b"Mary fez", b"JDM Culture", b"DAHAvMLOJKY") if w in data]
    if left:
        sys.exit(f"FAILED: still contains {[w.decode() for w in left]}")
    print("OK: properties fixed, content identical")


if __name__ == "__main__":
    main()
