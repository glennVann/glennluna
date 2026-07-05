export const projects = [
  {
    slug: "tighomecare-ca",
    name: "Tighomecare.ca",
    category: "Healthcare Services Platform",
    status: "Ongoing Project",
    summary:
      "An ongoing home care website project designed to build trust quickly, communicate services clearly, and make it easy for families to take the next step.",
    highlights: [
      "Clear service presentation for families and caregivers",
      "Professional visual tone that supports trust and credibility",
      "Responsive layout optimized for mobile and desktop browsing",
    ],
    features: [
      "Service pages for home care support and caregiver information",
      "Clear contact and inquiry paths for families seeking care",
      "Mobile-friendly layout for easy access across devices",
      "Trust-focused presentation with clean, professional design",
    ],
    technologies: ["Next.js", "Responsive Design", "Content Strategy"],
    seoDescription:
      "Healthcare website project focused on trust, responsive design, service clarity, and smooth inquiry paths for families seeking home care support.",
    url: "https://tighomecare.ca",
  },
  {
    slug: "feluna-realty-booking",
    name: "Feluna Realty Booking",
    category: "Real Estate Booking Platform",
    status: "Ongoing Project",
    summary:
      "An ongoing real estate booking platform designed to support property discovery, agent presentation, and private visit scheduling in a streamlined web experience.",
    highlights: [
      "Landing page built around listings and agent presentation",
      "Private property visit booking flow for prospective clients",
      "Bookings dashboard for managing submitted requests",
    ],
    features: [
      "Agent profile presentation for a more trust-driven real estate experience",
      "Property visit request form for private booking inquiries",
      "Dashboard workflow for reviewing and managing bookings",
      "Structured listing photo support with room for future database growth",
    ],
    technologies: ["Next.js", "Booking Workflows", "Dashboard UX"],
    seoDescription:
      "Real estate booking platform with listing discovery, agent presentation, and private property visit scheduling workflows.",
    url: null,
  },
  {
    slug: "sign-dashboard",
    name: "Sign Dashboard",
    category: "Sign Shop Operations Platform",
    status: "Ongoing Project",
    summary:
      "An ongoing full-stack dashboard for sign shop operations, bringing CRM, ticketing, inventory, proofing, and file workflows into one connected system.",
    highlights: [
      "CRM, tickets, quotes, inventory, and job order workflows in one platform",
      "Live dashboard updates through SignalR for operational visibility",
      "Integrated artwork uploads, proofing, and customer review links",
    ],
    features: [
      "Production board with status tracking from pending to completion",
      "Artwork upload versioning for design and production teams",
      "Proof review workflow with customer approvals and revision requests",
      "Local agent support for syncing files to customer-managed drives or NAS storage",
    ],
    technologies: ["Full-Stack Dashboard", "SignalR", "File Workflows"],
    seoDescription:
      "Operations dashboard for sign shop workflows covering CRM, ticketing, proof approvals, production tracking, and file handling.",
    url: null,
  },
  {
    slug: "stackwatch",
    name: "Stackwatch",
    category: "Website Monitoring SaaS MVP",
    status: "Ongoing Project",
    summary:
      "An ongoing monitoring product built for agencies and operators who need visibility into uptime, SEO issues, conversion risks, and site performance across multiple websites.",
    highlights: [
      "Multi-site monitoring dashboard with portfolio-level risk views",
      "Checks for uptime, response speed, SSL, SEO basics, and conversion signals",
      "SEO Lab support and SaaS-ready database foundation for growth",
    ],
    features: [
      "Add-site workflow for agency and client website monitoring",
      "Run-all and per-site checks for operational visibility",
      "Cloudflare integration path for traffic and page-load analytics",
      "MariaDB-backed SaaS foundation for users, organizations, alerts, and subscriptions",
    ],
    technologies: ["SaaS MVP", "Monitoring", "SEO Checks", "MariaDB"],
    seoDescription:
      "Website monitoring SaaS MVP for uptime, SEO issues, SSL health, conversion risks, and multi-site visibility.",
    url: null,
  },
  {
    slug: "bubbleteabrewers-ca",
    name: "bubbleteabrewers.ca",
    category: "POS and Web App",
    status: "Ongoing Project",
    summary:
      "An ongoing POS and web application project for Bubble Tea Brewers, including a site conversion from PHP to Next.js and integration of the POS system with the backend while streamlining operations and supporting a polished customer-facing digital experience.",
    highlights: [
      "Conversion of the existing website experience from PHP to Next.js",
      "POS workflows designed for practical day-to-day business operations",
      "Integration of the POS system with backend workflows and data handling",
      "Web app experience that supports brand presentation and usability",
      "Built with scalability in mind for future product and operational needs",
    ],
    features: [
      "Modernized frontend architecture through PHP-to-Next.js migration",
      "POS functionality aligned with real business operations",
      "Backend integration for completed sales, operational data, and system workflows",
      "Customer-facing web experience with a cleaner, more maintainable stack",
      "Foundation for future content, product, and operational growth",
    ],
    technologies: ["Next.js", "POS Integration", "Backend Workflows"],
    seoDescription:
      "Bubble Tea Brewers POS and website project with PHP to Next.js migration, backend integration, and customer-facing web app improvements.",
    url: "https://bubbleteabrewers.ca",
  },
  {
    slug: "github-portfolio",
    name: "GitHub Portfolio",
    category: "Code Portfolio",
    status: "Active Projects",
    summary:
      "A public GitHub portfolio that brings together development work across web applications, full-stack projects, and practical product builds.",
    highlights: [
      "Public repositories that show real implementation work",
      "A mix of frontend, backend, and full-stack projects",
      "Ongoing development and experimentation across products",
    ],
    features: [
      "Source code available for technical review",
      "Project variety across different business and product needs",
      "Visible coding style, structure, and implementation approach",
      "A central place to explore more of my software work",
    ],
    technologies: ["GitHub", "Open Source", "Portfolio Presentation"],
    seoDescription:
      "Public GitHub portfolio covering frontend, backend, full-stack applications, and practical software development work.",
    url: "https://github.com/glennluna",
  },
  {
    slug: "bindaddy-ca",
    name: "bindaddy.ca",
    category: "Customer-Facing Digital Platform",
    status: "Completed Project",
    summary:
      "A completed modern web platform focused on customer journeys, account experiences, and product operations, with an emphasis on clarity, usability, and scalable delivery.",
    highlights: [
      "Customer-centric flows for discovery, booking, and account use",
      "Full-stack implementation thinking across frontend and backend",
      "Built to support growth with maintainable product foundations",
    ],
    features: [
      "Account-based user experience for customer access and management",
      "Booking and service flow support for product interactions",
      "Frontend and backend integration for scalable platform behavior",
      "Structured product pages and operational workflows",
    ],
    technologies: ["Full-Stack Platform", "Account Experience", "Scalable Delivery"],
    seoDescription:
      "Customer-facing digital platform with account flows, booking support, product operations, and scalable full-stack architecture.",
    url: "https://bindaddy.ca",
  },
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}
