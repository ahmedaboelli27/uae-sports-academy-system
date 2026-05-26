export interface PublicKpiDto {
  key: string;
  label: string;
  value: string;
}

export interface PublicProgramDto {
  id: string;
  title: string;
  age: string;
  level: string;
  description: string;
  image?: string;
}

export interface PublicBranchDto {
  id: string;
  city: string;
  location: string;
  schedule: string;
}

export interface PublicGalleryItemDto {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
}

export interface PublicLoginFeatureDto {
  id: string;
  title: string;
}

export interface PublicLoginMetricDto {
  id: string;
  label: string;
  value: string;
}

export interface PublicHomeContentDto {
  kpis: PublicKpiDto[];
  programs: PublicProgramDto[];
  branches: PublicBranchDto[];
  gallery: PublicGalleryItemDto[];
  loginShowcase: {
    features: PublicLoginFeatureDto[];
    metrics: PublicLoginMetricDto[];
  };
}
