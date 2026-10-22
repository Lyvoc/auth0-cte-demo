/**
 * Organization Branding Configuration
 * 
 * Maps Auth0 Organization IDs to brand-specific theming.
 * Each brand has its own color palette, logo, and support URL.
 * 
 * Model: 3 Brands × N Countries = N Auth0 Organizations
 * - client-1, client-2, client-3 (one Auth0 organization each)
 */

export interface OrganizationBranding {
  brandId: string;
  brandName: string;
  displayName: string;
  country: string;
  language: string;
  logoUrl: string;
  supportUrl: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    bgPrimary: string;
    bgSecondary: string;
    bgSidebar: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
  applications: ApplicationAccess[];
}

export interface ApplicationAccess {
  id: string;
  name: string;
  description: string;
  icon: string;
  url?: string;
}

// Available applications
export const APPLICATIONS: Record<string, ApplicationAccess> = {
  esales: {
    id: "esales",
    name: "eSales",
    description: "Order management and ERP integration",
    icon: "🛒",
  },
  mediaCenter: {
    id: "mediaCenter",
    name: "Media Center",
    description: "Marketing materials and product documentation",
    icon: "📚",
  },
  proAcademy: {
    id: "proAcademy",
    name: "Pro Academy",
    description: "Training courses and certifications",
    icon: "🎓",
  },
  proLab: {
    id: "proLab",
    name: "Pro Lab",
    description: "Technical tools and diagnostics",
    icon: "🔬",
  },
  proApp: {
    id: "proApp",
    name: "Pro App",
    description: "Mobile field service application",
    icon: "📱",
  },
};

// Role to application access mapping
// Auth0 Roles: admin, b2b_customer, buyer
export const ROLE_APP_ACCESS: Record<string, string[]> = {
  buyer: ["esales"],
  b2b_customer: ["mediaCenter", "proAcademy", "proLab"],
  admin: ["esales", "mediaCenter", "proAcademy", "proLab", "proApp"],
};

// Brand base configurations
const BRAND_CONFIGS = {
  "client-1": {
    brandId: "client-1",
    brandName: "Client 1",
    logoUrl: "https://placehold.co/300x100/005BAC/ffffff/png?text=Client+1+Logo&font=roboto",
    supportUrl: "https://client-1.example.com/support",
    theme: {
      primaryColor: "#005BAC",
      secondaryColor: "#00A3E0",
      bgPrimary: "#1a1e27",
      bgSecondary: "#262a33",
      bgSidebar: "#0d2137",
      textPrimary: "#f7fafc",
      textSecondary: "#e2e8f0",
      textMuted: "#a0aec0",
    },
    applications: [
      APPLICATIONS.esales,
      APPLICATIONS.mediaCenter,
      APPLICATIONS.proAcademy,
      APPLICATIONS.proLab,
      APPLICATIONS.proApp,
    ],
  },
  "client-2": {
    brandId: "client-2",
    brandName: "Client 2",
    logoUrl: "https://placehold.co/300x100/ED8936/ffffff/png?text=Client+2+Logo&font=roboto",
    supportUrl: "https://client-2.example.com/support",
    theme: {
      primaryColor: "#ED8936",
      secondaryColor: "#F6AD55",
      bgPrimary: "#1a1e27",
      bgSecondary: "#262a33",
      bgSidebar: "#2d2418",
      textPrimary: "#f7fafc",
      textSecondary: "#e2e8f0",
      textMuted: "#a0aec0",
    },
    applications: [
      APPLICATIONS.esales,
      APPLICATIONS.mediaCenter,
    ],
  },
  "client-3": {
    brandId: "client-3",
    brandName: "Client 3",
    logoUrl: "https://placehold.co/300x100/00875A/ffffff/png?text=Client+3+Logo&font=roboto",
    supportUrl: "https://client-3.example.com/support",
    theme: {
      primaryColor: "#00875A",
      secondaryColor: "#38A169",
      bgPrimary: "#1a1e27",
      bgSecondary: "#262a33",
      bgSidebar: "#0d2d22",
      textPrimary: "#f7fafc",
      textSecondary: "#e2e8f0",
      textMuted: "#a0aec0",
    },
    applications: [
      APPLICATIONS.esales,
      APPLICATIONS.mediaCenter,
      APPLICATIONS.proAcademy,
    ],
  },
};

// Country configurations
const COUNTRY_CONFIGS: Record<string, { name: string; language: string }> = {
  es: { name: "Spain", language: "es" },
  pt: { name: "Portugal", language: "pt" },
  de: { name: "Germany", language: "de" },
  fr: { name: "France", language: "fr" },
  uk: { name: "United Kingdom", language: "en" },
  nordics: { name: "Nordics", language: "en" },
  it: { name: "Italy", language: "it" },
  nl: { name: "Netherlands", language: "nl" },
};

/**
 * Generate organization branding for a brand + country combination
 */
function createOrgBranding(
  brandKey: keyof typeof BRAND_CONFIGS,
  countryCode: string
): OrganizationBranding {
  const brand = BRAND_CONFIGS[brandKey];
  const country = COUNTRY_CONFIGS[countryCode] || { name: countryCode.toUpperCase(), language: "en" };

  return {
    ...brand,
    displayName: brand.brandName,
    country: countryCode,
    language: country.language,
  };
}

/**
 * Auth0 Organization ID mappings
 * Maps org names to their Auth0 org_id values
 * 
 * Currently configured for Spain (ES) only.
 * Add more entries when you create additional country orgs in Auth0.
 */
export const ORG_IDS: Record<string, string> = {
  "client-1": "org_7q04KtoynQHf9VBr",
  "client-2": "org_uhdstdZhMUlMzfwo",
  "client-3": "org_QC43Lk3mOC5IWjrv",
};

/**
 * Reverse lookup: org_id to org name
 */
export const ORG_ID_TO_NAME: Record<string, string> = Object.entries(ORG_IDS).reduce(
  (acc, [name, id]) => {
    acc[id] = name;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Get the Auth0 org_id for a given org name
 */
export function getOrgId(orgName: string): string {
  return ORG_IDS[orgName] || orgName;
}

/**
 * Organization branding lookup by org_id or org_name
 * 
 * This maps Auth0 organization identifiers to their branding configuration.
 * The key can be either the org_id (e.g., "org_abc123") or the org name (e.g., "client-1").
 * 
 * Currently configured for Spain (ES) only - 3 orgs total.
 */
export const ORGANIZATION_BRANDING: Record<string, OrganizationBranding> = {
  // Client 1
  "client-1": createOrgBranding("client-1", "es"),
  "org_7q04KtoynQHf9VBr": createOrgBranding("client-1", "es"),

  // Client 2
  "client-2": createOrgBranding("client-2", "es"),
  "org_uhdstdZhMUlMzfwo": createOrgBranding("client-2", "es"),

  // Client 3
  "client-3": createOrgBranding("client-3", "es"),
  "org_QC43Lk3mOC5IWjrv": createOrgBranding("client-3", "es"),
};

/**
 * Get branding for an organization by ID or name
 * Falls back to Client 1 default if not found
 */
export function getOrganizationBranding(orgIdentifier: string): OrganizationBranding | null {
  // Direct lookup by org name (e.g., "client-1")
  if (ORGANIZATION_BRANDING[orgIdentifier]) {
    return ORGANIZATION_BRANDING[orgIdentifier];
  }

  // Try to parse brand from identifier (e.g., "org_client_1" or custom org_id)
  const lowerId = orgIdentifier.toLowerCase();
  for (const [key, branding] of Object.entries(ORGANIZATION_BRANDING)) {
    if (lowerId.includes(key.replace("-", "_")) || lowerId.includes(key)) {
      return branding;
    }
  }

  return null;
}

/**
 * Get all organizations for a specific brand
 */
export function getOrganizationsByBrand(brandId: string): OrganizationBranding[] {
  return Object.values(ORGANIZATION_BRANDING).filter(
    (org) => org.brandId === brandId
  );
}

/**
 * Get available brands for the brand picker
 */
export function getAvailableBrands() {
  return [
    {
      id: "client-1",
      name: "Client 1",
      logoUrl: BRAND_CONFIGS["client-1"].logoUrl,
      primaryColor: BRAND_CONFIGS["client-1"].theme.primaryColor,
      countries: getOrganizationsByBrand("client-1").map((org) => {
        const orgName = "client-1";
        return {
          code: org.country,
          name: COUNTRY_CONFIGS[org.country]?.name || org.country,
          orgName,
          orgId: getOrgId(orgName),
        };
      }),
    },
    {
      id: "client-2",
      name: "Client 2",
      logoUrl: BRAND_CONFIGS["client-2"].logoUrl,
      primaryColor: BRAND_CONFIGS["client-2"].theme.primaryColor,
      countries: getOrganizationsByBrand("client-2").map((org) => {
        const orgName = "client-2";
        return {
          code: org.country,
          name: COUNTRY_CONFIGS[org.country]?.name || org.country,
          orgName,
          orgId: getOrgId(orgName),
        };
      }),
    },
    {
      id: "client-3",
      name: "Client 3",
      logoUrl: BRAND_CONFIGS["client-3"].logoUrl,
      primaryColor: BRAND_CONFIGS["client-3"].theme.primaryColor,
      countries: getOrganizationsByBrand("client-3").map((org) => {
        const orgName = "client-3";
        return {
          code: org.country,
          name: COUNTRY_CONFIGS[org.country]?.name || org.country,
          orgName,
          orgId: getOrgId(orgName),
        };
      }),
    },
  ];
}

/**
 * Get applications a user can access based on their roles
 */
export function getAccessibleApplications(roles: string[]): ApplicationAccess[] {
  const accessibleAppIds = new Set<string>();

  for (const role of roles) {
    const apps = ROLE_APP_ACCESS[role.toLowerCase()] || [];
    apps.forEach((appId) => accessibleAppIds.add(appId));
  }

  return Array.from(accessibleAppIds).map((appId) => APPLICATIONS[appId]).filter(Boolean);
}

export { BRAND_CONFIGS, COUNTRY_CONFIGS };
