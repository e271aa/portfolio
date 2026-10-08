// Rewrites the document properties (title, author, keywords) of a PDF and can prove that
// nothing else changed. macOS only (uses PDFKit, no extra install needed).
//
//   swift scripts/clean-pdf-metadata.swift clean   <in.pdf> <out.pdf> "<title>" "<author>"
//   swift scripts/clean-pdf-metadata.swift compare <a.pdf> <b.pdf>
//
// Why it exists: the CVs exported from Canva carried another person's name as author and a
// template name as title ("Mary fez"), which shows up in the browser tab and in "Document
// properties". Run `compare` after every `clean`, and only publish the result if it passes.

import AppKit
import Foundation
import PDFKit

func die(_ message: String) -> Never {
    FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
    exit(1)
}

func open(_ path: String) -> PDFDocument {
    guard let doc = PDFDocument(url: URL(fileURLWithPath: path)) else { die("Cannot open \(path)") }
    return doc
}

/// Renders a page to raw RGBA bytes, so two files can be compared pixel by pixel.
func pixels(_ page: PDFPage, scale: CGFloat = 1.5) -> (bytes: [UInt8], width: Int, height: Int)? {
    let box = page.bounds(for: .mediaBox)
    let size = CGSize(width: box.width * scale, height: box.height * scale)
    let image = page.thumbnail(of: size, for: .mediaBox)
    guard let tiff = image.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
          let data = rep.bitmapData else { return nil }
    let count = rep.bytesPerRow * rep.pixelsHigh
    return (Array(UnsafeBufferPointer(start: data, count: count)), rep.pixelsWide, rep.pixelsHigh)
}

func linkTargets(_ page: PDFPage) -> [String] {
    page.annotations.compactMap { $0.url?.absoluteString ?? $0.destination?.page?.label }.sorted()
}

let args = CommandLine.arguments
guard args.count >= 4 else { die("usage: clean <in> <out> <title> <author> | compare <a> <b>") }

switch args[1] {
case "clean":
    guard args.count == 6 else { die("usage: clean <in.pdf> <out.pdf> \"<title>\" \"<author>\"") }
    let doc = open(args[2])
    var attrs = doc.documentAttributes ?? [:]
    print("before:", attrs.filter { ["Title", "Author", "Keywords", "Subject"].contains($0.key as? String ?? "") })
    attrs["Title"] = args[4]
    attrs["Author"] = args[5]
    attrs.removeValue(forKey: "Keywords")  // held a Canva design id
    attrs.removeValue(forKey: "Subject")
    doc.documentAttributes = attrs
    guard doc.write(to: URL(fileURLWithPath: args[3])) else { die("Write failed") }
    print("written:", args[3])

case "compare":
    let a = open(args[2]), b = open(args[3])
    var failures = 0
    func check(_ ok: Bool, _ what: String, _ detail: String = "") {
        print((ok ? "  ok   " : "  FAIL ") + what + (detail.isEmpty ? "" : "  — " + detail))
        if !ok { failures += 1 }
    }
    check(a.pageCount == b.pageCount, "page count", "\(a.pageCount) vs \(b.pageCount)")
    for i in 0..<min(a.pageCount, b.pageCount) {
        guard let pa = a.page(at: i), let pb = b.page(at: i) else { continue }
        check(pa.string == pb.string, "page \(i + 1) text identical", "\((pa.string ?? "").count) chars")
        // Rewriting decimals rounds the 7th digit (7.8299813 -> 7.829981); 0.01 pt is 10,000x that
        // and still far below anything visible.
        let boxA = pa.bounds(for: .mediaBox), boxB = pb.bounds(for: .mediaBox)
        let sameBox = abs(boxA.minX - boxB.minX) < 0.01 && abs(boxA.minY - boxB.minY) < 0.01
            && abs(boxA.width - boxB.width) < 0.01 && abs(boxA.height - boxB.height) < 0.01
        check(sameBox, "page \(i + 1) size identical", "\(Int(boxA.width))x\(Int(boxA.height)) pt, within 0.01")
        let la = linkTargets(pa), lb = linkTargets(pb)
        check(la == lb, "page \(i + 1) links identical", "\(la.count) links")
        if let ra = pixels(pa), let rb = pixels(pb) {
            var maxDiff = 0, differing = 0
            if ra.bytes.count == rb.bytes.count {
                for j in 0..<ra.bytes.count {
                    let d = abs(Int(ra.bytes[j]) - Int(rb.bytes[j]))
                    if d > maxDiff { maxDiff = d }
                    if d > 2 { differing += 1 }
                }
            }
            check(ra.bytes.count == rb.bytes.count && maxDiff <= 2, "page \(i + 1) drawing identical",
                  "\(ra.width)x\(ra.height) px, largest difference \(maxDiff)/255, \(differing) values above 2")
        }
    }
    print("attributes B:", (b.documentAttributes ?? [:]).filter { ["Title", "Author", "Keywords", "Subject", "Creator", "Producer"].contains($0.key as? String ?? "") })
    print(failures == 0 ? "RESULT: identical apart from properties" : "RESULT: \(failures) difference(s) — do not publish")
    exit(failures == 0 ? 0 : 2)

default:
    die("unknown command \(args[1])")
}
