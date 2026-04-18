export type SocialKind =
  | "github"
  | "linkedin"
  | "twitter"
  | "x"
  | "instagram"
  | "dribbble"
  | "youtube"
  | "website"
  | "other";

export type SocialLink = {
  label: string;
  href: string;
  kind: SocialKind;
};

export type Contact = {
  email: string;
  phone?: string;
  location?: string;
  socials: SocialLink[];
};
