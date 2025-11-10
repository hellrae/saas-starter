export interface NavLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

export interface NavbarProps {
  logoSrc?: string;
  logoAlt?: string;
  brand?: string;
  links?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
}
