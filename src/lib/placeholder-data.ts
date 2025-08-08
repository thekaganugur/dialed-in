import { CoffeeBean, CoffeeLog } from './definitions';

export const coffeeBeans: CoffeeBean[] = [
  {
    id: '1',
    name: 'Ethiopian Yirgacheffe',
    roaster: 'Blue Bottle',
    origin: 'Ethiopia',
    roast_level: 'light',
  },
  {
    id: '2',
    name: 'Colombian Supremo',
    roaster: 'Stumptown',
    origin: 'Colombia',
    roast_level: 'medium',
  },
  {
    id: '3',
    name: 'Guatemala Antigua',
    roaster: 'Intelligentsia',
    origin: 'Guatemala',
    roast_level: 'medium',
  },
  {
    id: '4',
    name: 'Sumatra Mandheling',
    roaster: 'Peet\'s',
    origin: 'Indonesia',
    roast_level: 'dark',
  },
  {
    id: '5',
    name: 'Kenya AA',
    roaster: 'Counter Culture',
    origin: 'Kenya',
    roast_level: 'light',
  },
];

export const coffeeLogs: CoffeeLog[] = [
  {
    id: '1',
    bean_id: '1',
    method: 'V60',
    rating: 4.3,
    brew_date: '2024-01-15',
  },
  {
    id: '2',
    bean_id: '1',
    method: 'French Press',
    rating: 3.9,
    brew_date: '2024-01-16',
  },
  {
    id: '3',
    bean_id: '2',
    method: 'Chemex',
    rating: 4.6,
    brew_date: '2024-01-17',
  },
  {
    id: '4',
    bean_id: '3',
    method: 'Aeropress',
    rating: 4.5,
    brew_date: '2024-01-18',
  },
  {
    id: '5',
    bean_id: '2',
    method: 'V60',
    rating: 4.4,
    brew_date: '2024-01-19',
  },
  {
    id: '6',
    bean_id: '4',
    method: 'French Press',
    rating: 3.6,
    brew_date: '2024-01-20',
  },
  {
    id: '7',
    bean_id: '5',
    method: 'Pour Over',
    rating: 4.6,
    brew_date: '2024-01-21',
  },
  {
    id: '8',
    bean_id: '3',
    method: 'Espresso',
    rating: 4.2,
    brew_date: '2024-01-22',
  },
];