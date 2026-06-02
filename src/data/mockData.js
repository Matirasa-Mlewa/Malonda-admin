// ── Mock Data for Malonda Admin Panel ──────────────────────────────────────

export const MOCK_USERS = [
  { id: 'u1', name: 'Chisomo Banda',    phone: '+265 881 234 567', level: 'VERIFIED', status: 'ACTIVE',    orders: 12, joined: 'Jan 2026', initials: 'CB', avatarClass: 'av-green' },
  { id: 'u2', name: 'John Phiri',       phone: '+265 999 876 543', level: 'TRUSTED',  status: 'ACTIVE',    orders: 34, joined: 'Nov 2025', initials: 'JP', avatarClass: 'av-blue' },
  { id: 'u3', name: 'Grace Mbewe',      phone: '+265 887 654 321', level: 'BASIC',    status: 'ACTIVE',    orders:  3, joined: 'Feb 2026', initials: 'GM', avatarClass: 'av-amber' },
  { id: 'u4', name: 'Limbani Mzumara',  phone: '+265 883 339 090', level: 'BASIC',    status: 'SUSPENDED', orders:  1, joined: 'Mar 2026', initials: 'LM', avatarClass: 'av-gray' },
  { id: 'u5', name: 'Amina Shop',       phone: '+265 994 112 233', level: 'VERIFIED', status: 'ACTIVE',    orders: 19, joined: 'Oct 2025', initials: 'AS', avatarClass: 'av-green' },
  { id: 'u6', name: 'Kondwani Tembo',   phone: '+265 882 345 678', level: 'BASIC',    status: 'ACTIVE',    orders:  0, joined: 'May 2026', initials: 'KT', avatarClass: 'av-amber' },
  { id: 'u7', name: 'Tiwonge Crafts',   phone: '+265 991 223 344', level: 'TRUSTED',  status: 'ACTIVE',    orders: 56, joined: 'Aug 2025', initials: 'TC', avatarClass: 'av-blue' },
  { id: 'u8', name: 'Farm Direct MW',   phone: '+265 885 667 788', level: 'VERIFIED', status: 'ACTIVE',    orders: 23, joined: 'Sep 2025', initials: 'FD', avatarClass: 'av-green' },
]

export const MOCK_VERIFICATIONS = [
  { id: 'v1', name: 'Kondwani Mbewe',  phone: '+265 099 234 5678', idNo: 'MWI-2024-189234', submitted: '2 hours ago',  risk: 'LOW',    status: 'PENDING' },
  { id: 'v2', name: 'Tadala Phiri',    phone: '+265 088 876 5432', idNo: 'MWI-2024-092847', submitted: '5 hours ago',  risk: 'LOW',    status: 'PENDING' },
  { id: 'v3', name: 'Blessings Nkosi', phone: '+265 099 111 2222', idNo: 'MWI-2024-334521', submitted: '1 day ago',    risk: 'MEDIUM', status: 'PENDING' },
]

export const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Tecno Spark 10',       seller: 'John Phiri',     price: 'MK 75,000',  category: 'Electronics', status: 'ACTIVE',  flags: 0 },
  { id: 'p2', name: 'Chitenje Fabric 5m',   seller: 'Amina Shop',     price: 'MK 8,500',   category: 'Clothing',    status: 'ACTIVE',  flags: 0 },
  { id: 'p3', name: 'Fresh Tomatoes 1kg',   seller: 'Grace Mbewe',    price: 'MK 1,500',   category: 'Food',        status: 'ACTIVE',  flags: 0 },
  { id: 'p4', name: 'Wooden Dining Table',  seller: 'Tiwonge Crafts', price: 'MK 95,000',  category: 'Furniture',   status: 'ACTIVE',  flags: 0 },
  { id: 'p5', name: 'Suspicious Phone Lot', seller: 'Limbani Mzumara',price: 'MK 12,000',  category: 'Electronics', status: 'FLAGGED', flags: 3 },
  { id: 'p6', name: 'Solar Panel Kit 100W', seller: 'Solar Malawi',   price: 'MK 125,000', category: 'Electronics', status: 'ACTIVE',  flags: 0 },
  { id: 'p7', name: 'Maize Flour 25kg',     seller: 'Farm Direct MW', price: 'MK 18,000',  category: 'Food',        status: 'ACTIVE',  flags: 0 },
]

export const MOCK_REPORTS = [
  { id: 'r1', reporter: 'Chisomo Banda',  reported: 'Limbani Mzumara', reason: 'Asked for payment outside platform', risk: 'HIGH',   status: 'PENDING',      date: 'Today' },
  { id: 'r2', reporter: 'Kondwani Tembo', reported: 'Unknown Seller',  reason: 'Fake product images',               risk: 'MEDIUM', status: 'UNDER REVIEW', date: 'Yesterday' },
  { id: 'r3', reporter: 'Grace Mbewe',    reported: 'Blessings Nkosi', reason: 'No delivery after payment',         risk: 'HIGH',   status: 'PENDING',      date: '2 days ago' },
  { id: 'r4', reporter: 'Amina Shop',     reported: 'Anonymous',       reason: 'Harassment in chat',                risk: 'MEDIUM', status: 'RESOLVED',     date: '3 days ago' },
  { id: 'r5', reporter: 'John Phiri',     reported: 'Limbani Mzumara', reason: 'Scam attempt detected',             risk: 'HIGH',   status: 'PENDING',      date: 'Today' },
]

export const MOCK_TRANSACTIONS = [
  { id: 'ORD-2847', buyer: 'Chisomo Banda',  seller: 'John Phiri',    amount: 'MK 75,500',  status: 'ESCROWED',  date: 'May 29' },
  { id: 'ORD-2831', buyer: 'Chisomo Banda',  seller: 'Amina Shop',    amount: 'MK 8,670',   status: 'COMPLETED', date: 'May 18' },
  { id: 'ORD-2819', buyer: 'Kondwani Tembo', seller: 'Amina Shop',    amount: 'MK 22,440',  status: 'ESCROWED',  date: 'May 26' },
  { id: 'ORD-2808', buyer: 'Grace Mbewe',    seller: 'John Phiri',    amount: 'MK 18,360',  status: 'PENDING',   date: 'May 30' },
  { id: 'ORD-2790', buyer: 'Kondwani Tembo', seller: 'Grace Mbewe',   amount: 'MK 3,060',   status: 'COMPLETED', date: 'May 15' },
  { id: 'ORD-2775', buyer: 'Chisomo Banda',  seller: 'Solar Malawi',  amount: 'MK 127,500', status: 'ESCROWED',  date: 'May 28' },
  { id: 'ORD-2760', buyer: 'Grace Mbewe',    seller: 'Farm Direct MW',amount: 'MK 18,360',  status: 'COMPLETED', date: 'May 20' },
]

export const MOCK_DISPUTES = [
  { id: 'DSP-041', order: 'ORD-2801', buyer: 'Chisomo Banda',  seller: 'Limbani Mzumara', issue: 'Item not received after 7 days. Seller has been unresponsive to messages.', amount: 'MK 45,000', opened: 'May 25', status: 'OPEN'      },
  { id: 'DSP-040', order: 'ORD-2788', buyer: 'Grace Mbewe',    seller: 'Unknown Seller',  issue: 'Product was damaged on arrival and not as described in the listing.',        amount: 'MK 12,500', opened: 'May 22', status: 'REVIEWING' },
]

export const CHART_DATA = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  values: [42, 58, 35, 71, 63, 88, 54],
}

export const METRICS = {
  totalUsers:       1284,
  verifiedSellers:   312,
  activeListings:    847,
  totalTransactions: 2941,
  fraudReports:        5,
  escrowHeld:   'MK 203K',
  platformFees: 'MK 84K',
  totalVolume:  'MK 4.2M',
}
