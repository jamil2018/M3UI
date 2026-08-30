export interface ComponentVariant {
  title: string;
  description: string;
}

export interface ComponentDocContent {
  slug: string;
  title: string;
  overview: string;
  /** Named exports from `@m3ui/react` */
  imports: string[];
  usageCode: string;
  variants: ComponentVariant[];
  accessibility: string[];
  /** Related component slugs for cross-linking */
  related: string[];
  /** Optional Material Web parity nuance beyond the tier default */
  parityNote?: string;
}

export type ContentCoverage = 'full' | 'minimal';
