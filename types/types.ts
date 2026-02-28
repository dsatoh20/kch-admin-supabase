// type.ts

export type ClubAffiliation = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Club = {
  id: number;
  slug: string;
  name: string;
  is_verified: boolean;
  profile_image_url: string | null;
  club_affiliation_id: number | null;
  founding_year: number | null;
  created_at: string;
  updated_at: string;
  owner_id: string; // uuidは文字列として扱うのが一般的です
};

export type ClubInfo = {
  id: number;
  club_id: number;
  description: string | null;
  location: string | null;
  frequency: string | null;
  banquet: string | null;
  record: string | null;
  membership_fee: string | null;
  initial_cost: string | null;
  feeling_positive: string | null;
  feeling_negative: string | null;
  created_at: string;
  updated_at: string;
};

export type Url = {
  id: number;
  club_id: number;
  instagram: string | null;
  x: string | null;
  discord: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
};

export type ClubEvent = {
  id: number;
  club_id: number;
  club_name: string | null;
  description: string | null;
  date: string | null; // date型は文字列で扱うのが一般的です
  start_time: string | null; // time型は文字列で扱うのが一般的です
  end_time: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  url: string | null;
  on_carousel: boolean;
};

export type Belonging = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type MemberComposition = {
  id: number;
  club_id: number;
  total: number | null;
  B1: number | null;
  B2: number | null;
  B3: number | null;
  B4: number | null;
  B5: number | null;
  B6: number | null;
  M1: number | null;
  M2: number | null;
  others: number | null;
  male: number | null;
  female: number | null;
  created_at: string;
  updated_at: string;
};

export type MemberCompositionBelonging = {
  id: number;
  member_composition_id: number;
  belonging_id: number;
  created_at: string;
  updated_at: string;
};

export type Tag = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type ClubTag = {
  id: number;
  club_id: number;
  tag_id: number;
  created_at: string;
  updated_at: string;
};

export type IsVerified = {
  id: number;
  club_id: number;
  created_at: string;
}

export type OnCarousel = {
  id: number;
  club_event_id: number;
  created_at: string;
}