const SEO_DATA = {
    Home: {
        title: "GlyphLock Security - Quantum-Resistant Cybersecurity Platform | Enterprise AI Security",
        description: "GlyphLock Security LLC provides military-grade quantum-resistant cybersecurity with AI-powered threat detection, visual cryptography, blockchain security, and secure POS systems. GlyphBot AI assistant, secure QR codes, steganography tools, and Master Covenant framework.",
        keywords: ["GlyphLock Security", "quantum-resistant encryption", "cybersecurity", "AI security", "blockchain security", "visual cryptography", "QR code security", "steganography", "security operations center", "GlyphBot AI", "Master Covenant"],
        url: "/",
        schemaType: "WebSite"
    },
    About: {
        title: "About GlyphLock - Quantum-Resistant Security for a World Already Under Attack",
        description: "Born from a dangerous idea: What if camouflage could hide QR codes? GlyphLock is survival-grade security built to eliminate digital theft, end fraud, and protect creators for 200 years.",
        keywords: ["GlyphLock about", "quantum-resistant security", "Carlo Earl DACO", "Collin Vanderginst CTO", "Master Covenant", "steganographic QR", "AI governance", "IP protection", "TruthStrike Protocol", "Base44 platform", "Dream Team AI"],
        url: "/About",
        schemaType: "AboutPage"
    },
    Blockchain: {
        title: "Blockchain Security Suite - GlyphLock",
        description: "Explore enterprise-grade cryptographic verification and blockchain tools. Generate SHA-256/512 hashes, build Merkle trees, simulate block mining, and verify data integrity.",
        keywords: ["blockchain security", "cryptographic hashing", "SHA-256 generator", "Merkle tree", "block mining", "data integrity", "proof-of-work"],
        url: "/Blockchain",
        schemaType: "WebPage"
    }
};

export const getSeoData = (key) => SEO_DATA[key] || {};
