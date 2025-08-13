export type CoffeeBean = {
  id: string;
  name: string;
  roaster: string;
  origin: string;
  roast_level: "light" | "medium" | "dark";
};

export type CoffeeLog = {
  id: string;
  bean_id: string;
  method: string;
  rating: number;
  brew_date: string;
};

export type Breadcrumb = {
  title: string;
  href?: string; // undefined for current page (no link)
};
