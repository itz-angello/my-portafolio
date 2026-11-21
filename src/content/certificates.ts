export interface CertificateText {
  en: string;
  es: string;
}

export interface Certificate {
  id: string;
  title: CertificateText;
  institution: CertificateText;
  date: CertificateText;
  image?: string;
  verificationUrl?: string;
}

// Add verified certificates here. The portfolio currently has none to show.
export const certificates: Certificate[] = [];
