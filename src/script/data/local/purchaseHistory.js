const purchaseHistory = [
  {
    id: 'htry-001',
    name: 'Super Quota',
    date: 'September 15, 2025',
    icon: 'local_fire_department',
    price: 10.00,
  },
  {
    id: 'htry-002',
    name: 'Max Stream',
    date: 'August 28, 2025',
    icon: 'movie',
    price: 5.00,
  },
  {
    id: 'htry-003',
    name: 'Unlimited Data',
    date: 'August 1, 2025',
    icon: 'wifi',
    price: 15.00,
  },
  {
    id: 'htry-004',
    name: 'Talk Mania',
    date: 'July 22, 2025',
    icon: 'call',
    price: 4.50
  },
  {
    id: 'htry-005',
    name: 'Gamer Pro',
    date: 'July 5, 2025',
    icon: 'stadia_controller',
    price: 8.00
  }
];

class PurchaseHistory {
  static getAll() {
    return purchaseHistory;
  }
}

export default PurchaseHistory;