export interface Music {
  album: string;
  arranger: string;
  composer: string;
  game: string;
  genre: string;
  id: number;
  name: string;
  title: string;
  track: number;
}

export interface Option<T> {
  label: T;
  value: T;
}