export const projects = [
  {
    slug: "tighomecare-ca",
    name: "Tighomecare.ca",
    category: "Healthcare Services Platform",
    status: "Ongoing Project",
    summary:
      "An ongoing home care project that includes a trust-focused website and mobile app work to help families understand services and connect more easily.",
    highlights: [
      "Clear service presentation for families and caregivers",
      "A calm, trustworthy visual style that fits the audience",
      "Responsive browsing across desktop and mobile",
      "Mobile app support for easier access on the go",
    ],
    features: [
      "Service pages for home care support and caregiver information",
      "Simple contact and inquiry paths for families looking for help",
      "Mobile-friendly layout for easy access across devices",
      "A clean presentation designed to build trust quickly",
      "Android app development for care-related workflows",
      "iOS app development for a smoother cross-platform experience",
    ],
    technologies: [
      "Next.js",
      "Responsive Design",
      "Content Strategy",
      "Android App Development",
      "iOS App Development",
    ],
    seoDescription:
      "Healthcare project covering website delivery, mobile app support, responsive design, clear service presentation, and inquiry paths for families seeking home care support.",
    architectureImage: {
      src: "/tighomecare-platform-topology.png",
      alt: "Tighomecare customer-facing digital platform topology diagram",
      title: "Platform Topology",
      caption:
        "High-level architecture illustrating the customer-facing web platform, mobile access paths, authentication, backend services, storage, and operational workflows supporting Tighomecare.",
    },
    url: null,
  },
  {
    slug: "feluna-realty-booking",
    name: "Feluna Realty Booking",
    category: "Real Estate Booking Platform",
    status: "Ongoing Project",
    summary:
      "An ongoing real estate booking project built to support property discovery, agent presentation, and private visit scheduling in a simple web experience.",
    highlights: [
      "Landing page built around listings and agent presentation",
      "Private property visit booking flow for prospective clients",
      "A dashboard for managing submitted booking requests",
    ],
    features: [
      "Agent profile presentation that helps build trust",
      "Property visit request form for private booking inquiries",
      "Dashboard workflow for reviewing and managing bookings",
      "Structured listing photo support with room for future growth",
    ],
    technologies: ["Next.js", "Booking Workflows", "Dashboard UX"],
    seoDescription:
      "Real estate booking platform with listing discovery, agent presentation, and private property visit scheduling.",
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
    category: "Website Monitoring SaaS Platform",
    status: "Ongoing Project",
    summary:
      "An ongoing monitoring product built for agencies and operators who need a clearer view of uptime, SEO issues, conversion risks, and site performance across multiple websites.",
    highlights: [
      "Multi-site monitoring dashboard with portfolio-level visibility",
      "Checks for uptime, response speed, SSL, SEO basics, and conversion signals",
      "A solid data foundation for future growth",
    ],
    features: [
      "Add-site workflow for agency and client website monitoring",
      "Run-all and per-site checks for day-to-day visibility",
      "Cloudflare integration path for traffic and page-load analytics",
      "MariaDB-backed foundation for users, organizations, alerts, and subscriptions",
    ],
    technologies: ["SaaS Platform", "Monitoring", "SEO Checks", "MariaDB"],
    seoDescription:
      "Website monitoring platform for uptime, SEO issues, SSL health, conversion risks, and multi-site visibility.",
    architectureImage: {
      src: "/stackwatch-topology-map-v2.png",
      alt: "Stackwatch SaaS website monitoring platform topology map",
      title: "Monitoring Platform Topology",
      caption:
        "System architecture showing the Stackwatch SaaS dashboard, monitoring engine, alerting workflows, data layer, client website checks, and supporting cloud infrastructure.",
    },
    url: null,
  },
  {
    slug: "bubbleteabrewers-ca",
    name: "bubbleteabrewers.ca",
    category: "POS and Web App",
    status: "Ongoing Project",
    summary:
      "An ongoing POS and web application project for Bubble Tea Brewers, including a move from PHP to Next.js and POS integration with the backend to support smoother operations.",
    highlights: [
      "Moving the website from PHP to Next.js",
      "POS workflows shaped around day-to-day business operations",
      "Backend integration for POS data and system workflows",
      "A cleaner customer-facing web experience",
      "A stronger foundation for future growth",
    ],
    features: [
      "Modernized frontend architecture through PHP-to-Next.js migration",
      "POS functionality aligned with real business operations",
      "Backend integration for sales data and operational workflows",
      "Customer-facing web experience with a cleaner, more maintainable stack",
      "Room for future content, product, and operational growth",
    ],
    technologies: ["Next.js", "POS Integration", "Backend Workflows"],
    seoDescription:
      "Bubble Tea Brewers POS and website project with a PHP to Next.js migration, backend integration, and customer-facing improvements.",
    url: null,
  },
  {
    slug: "github-portfolio",
    name: "GitHub Portfolio",
    category: "Code Portfolio",
    status: "Active Projects",
    summary:
      "A public GitHub portfolio that brings together my development work across web applications, full-stack projects, and practical builds.",
    highlights: [
      "Public repositories that show real implementation work",
      "A mix of frontend, backend, and full-stack projects",
      "Ongoing development and experimentation across different ideas",
    ],
    features: [
      "Source code available for technical review",
      "Project variety across different business and product needs",
      "A visible look at coding style, structure, and implementation approach",
      "A central place to explore more of my software work",
    ],
    technologies: ["GitHub", "Open Source", "Portfolio Presentation"],
    seoDescription:
      "Public GitHub portfolio covering frontend, backend, full-stack applications, and practical software development work.",
    url: null,
  },
  {
    slug: "bindaddy-ca",
    name: "bindaddy.ca",
    category: "Customer-Facing Digital Platform",
    status: "Completed Project",
    summary:
      "A completed digital platform focused on customer journeys, account experience, and the operational flow behind a real product.",
    highlights: [
      "Customer-focused flows for discovery, booking, and account use",
      "Full-stack thinking across frontend and backend",
      "Built on a maintainable foundation that can grow over time",
    ],
    features: [
      "Account-based user experience for customer access and management",
      "Booking and service flows that support real use cases",
      "Frontend and backend integration for stable platform behavior",
      "Structured product pages and operational workflows",
    ],
    technologies: ["Full-Stack Platform", "Account Experience", "Scalable Delivery"],
    seoDescription:
      "Customer-facing digital platform with account flows, booking support, product operations, and stable full-stack architecture.",
    url: null,
  },
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}
