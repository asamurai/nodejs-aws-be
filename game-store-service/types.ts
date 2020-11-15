export type Game = {
  id: string;
  title: string;
  studio: string;
  genre: string;
  description: string;
  release_date: string;
  poster: string;
  price: number;
  count: number;
};

export type GameList = Game[];
