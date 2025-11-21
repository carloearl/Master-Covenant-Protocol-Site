import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import JSZip from "npm:jszip";

export default Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Allow public access for SDK downloads, or check auth if preferred
    // const user = await base44.auth.me();

    const { language } = await req.json();
    const langKey = language.toLowerCase().replace('.', '').replace('js', ''); // normalize

    const zip = new JSZip();
    const folder = zip.folder(`glyphlock-${langKey}-v2.1.0`);

    switch (langKey) {
      case 'node':
        folder.file("index.js", "module.exports = { test: () => console.log('GlyphLock Node SDK ready') };");
        folder.file("README.md", "# GlyphLock Node SDK\nStarter pack for v2.1.0");
        break;
      case 'python':
        folder.file("glyphlock.py", 'print("GlyphLock Python SDK ready")');
        folder.file("README.md", "# GlyphLock Python SDK\nStarter pack for v2.1.0");
        break;
      case 'go':
        folder.file("glyphlock.go", 'package glyphlock\n\nfunc Test(){ println("GlyphLock Go SDK ready") }');
        folder.file("README.md", "# GlyphLock Go SDK");
        break;
      case 'java':
        folder.file("GlyphLock.java", 'public class GlyphLock { public static void test(){ System.out.println("GlyphLock Java SDK ready"); }}');
        folder.file("README.md", "# GlyphLock Java SDK");
        break;
      case 'net':
      case 'csharp':
        folder.file("GlyphLock.cs", 'namespace GlyphLock { public class SDK { public static void Test(){ System.Console.WriteLine("GlyphLock .NET SDK ready"); }}}');
        folder.file("README.md", "# GlyphLock .NET SDK");
        break;
      case 'ruby':
        folder.file("glyphlock.rb", 'puts "GlyphLock Ruby SDK ready"');
        folder.file("README.md", "# GlyphLock Ruby SDK");
        break;
      case 'php':
        folder.file("glyphlock.php", '<?php echo "GlyphLock PHP SDK ready"; ?>');
        folder.file("README.md", "# GlyphLock PHP SDK");
        break;
      case 'rust':
        folder.file("lib.rs", 'pub fn test(){ println!("GlyphLock Rust SDK ready"); }');
        folder.file("README.md", "# GlyphLock Rust SDK");
        break;
      default:
        return Response.json({ error: "Unsupported language" }, { status: 400 });
    }

    const content = await zip.generateAsync({ type: "base64" });

    return Response.json({ 
      file_data: content, 
      filename: `glyphlock-${langKey}-v2.1.0.zip` 
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});