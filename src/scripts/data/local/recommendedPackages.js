const recommendedPackages = [
  {
    id: 'pkg-001',
    name: 'Super Quota',
    details: '50 GB - 30 Days',
    price: 10.000,
    icon: 'local_fire_department', // Nama ikon dari Material Symbols
    description: 'A super-sized data package for all your streaming and browsing needs throughout the month. Best value for heavy users.'
  },
  {
    id: 'pkg-002',
    name: 'Max Stream',
    details: '15 GB - 7 Days',
    price: 5.000,
    icon: 'movie',
    description: 'Perfect for a week of binge-watching your favorite series and movies. Optimized for high-quality video streaming.'
  },
  {
    id: 'pkg-003',
    name: 'Gamer Pro',
    details: '25 GB - 30 Days',
    price: 8.000,
    icon: 'stadia_controller',
    description: 'Low latency and high-speed data package designed for online gaming. Conquer the leaderboard without any lag!'
  },
  {
    id: 'pkg-004',
    name: 'Social Media Pass',
    details: '10 GB - 30 Days',
    price: 4.500,
    icon: 'groups',
    description: 'Stay connected on all your favorite social media apps without worrying about data. Includes access to Instagram, Facebook, Twitter, and more.'
  },
];

class RecommendedPackages {
  static getAll() {
    return recommendedPackages;
  }
}

export default RecommendedPackages;