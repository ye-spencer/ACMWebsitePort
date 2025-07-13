interface SponsorData {
    name: string;
    logoPath: string;
    description: string;
    tier: 'Partner' | 'Standard';
    website: string;
    year: string;
}

export const sponsorsData: SponsorData[] = [
    {
        name: "Google",
        logoPath: "../assets/sponsors/google.png",
        description: "Leading technology company providing innovative solutions and supporting student organizations.",
        tier: "Partner",
        website: "https://www.google.com",
        year: "2025-2026"
    },
    {
        name: "Microsoft",
        logoPath: "../assets/sponsors/microsoft.png",
        description: "Global technology leader empowering students and organizations through cutting-edge software.",
        tier: "Partner",
        website: "https://www.microsoft.com",
        year: "2025-2026"
    },
    {
        name: "Amazon",
        logoPath: "../assets/sponsors/amazon.png",
        description: "E-commerce and cloud computing giant supporting innovation and technology education initiatives.",
        tier: "Partner",
        website: "https://www.amazon.com",
        year: "2025-2026"
    },
    {
        name: "Meta",
        logoPath: "../assets/sponsors/meta.png",
        description: "Social media and technology company focused on connecting people.",
        tier: "Partner",
        website: "https://www.meta.com",
        year: "2025-2026"
    },
    {
        name: "Apple",
        logoPath: "../assets/sponsors/apple.png",
        description: "Innovative technology company creating products that inspire creativity and empower individuals.",
        tier: "Standard",
        website: "https://www.apple.com",
        year: "2025-2026"
    },
    {
        name: "Netflix",
        logoPath: "../assets/sponsors/netflix.png",
        description: "Entertainment streaming service supporting technology education and student development.",
        tier: "Standard",
        website: "https://www.netflix.com",
        year: "2025-2026"
    },
    {
        name: "Spotify",
        logoPath: "../assets/sponsors/spotify.png",
        description: "Digital music streaming platform fostering innovation in audio technology and user experience.",
        tier: "Standard",
        website: "https://www.spotify.com",
        year: "2025-2026"
    },
    {
        name: "Uber",
        logoPath: "../assets/sponsors/uber.png",
        description: "Mobility and delivery platform revolutionizing transportation through technology and innovation.",
        tier: "Standard",
        website: "https://www.uber.com",
        year: "2025-2026"
    },
    {
        name: "GitHub",
        logoPath: "../assets/sponsors/github.png",
        description: "Leading software development platform enabling collaboration and open source innovation.",
        tier: "Standard",
        website: "https://www.github.com",
        year: "2025-2026"
    },
    {
        name: "Intel",
        logoPath: "../assets/sponsors/intel.png",
        description: "Semiconductor technology company driving innovation in computing and artificial intelligence.",
        tier: "Standard",
        website: "https://www.intel.com",
        year: "2025-2026"
    }
]