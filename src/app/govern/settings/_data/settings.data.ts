export const ROLE_DISPLAY: Record<string, string> = {
  chairman:  'Chairman',
  technical: 'Member — Technical',
  legal:     'Member — Legal',
  secretary: 'Secretary',
}

export const NAME_MAP: Record<string, string> = {
  'chairman@krera.gov.in':  'DK Shivakumar (Chairman)',
  'technical@krera.gov.in': 'Ar. Suresh Babu',
  'legal@krera.gov.in':     'Adv. Meera Iyer',
  'secretary@krera.gov.in': 'R. Krishnamurthy',
}

export const DATA_SOURCES = [
  { name: 'K-RERA Project Registry',  last_sync: '6 hours ago', frequency: 'Every 6 hours', status: 'SYNCED' },
  { name: 'eCourts (High Court)',      last_sync: '4 hours ago', frequency: 'Every 4 hours', status: 'SYNCED' },
  { name: 'Kaveri 2.0 (Land Titles)',  last_sync: '3 days ago',  frequency: 'Weekly',        status: 'OK' },
  { name: 'Bhoomi (Land Records)',     last_sync: '5 days ago',  frequency: 'Weekly',        status: 'OK' },
  { name: 'BBMP / BDA (Zoning)',       last_sync: '6 days ago',  frequency: 'Weekly',        status: 'OK' },
  { name: 'Internal QPR Database',     last_sync: 'Live',         frequency: 'Real-time',     status: 'LIVE' },
]

export const NOTIF_ITEMS = [
  { key: 'priority1',     label: 'Priority 1 Alerts',          desc: 'Critical risk escalations — always on',                     locked: true },
  { key: 'qprDefaults',   label: 'QPR Default Notifications',   desc: 'Notify when a project misses QPR deadline',                  locked: false },
  { key: 'newLitigation', label: 'New Litigation Filed',        desc: 'Alert when new case filed against registered project',       locked: false },
  { key: 'weeklyReport',  label: 'Weekly Intelligence Summary', desc: 'Automated digest every Monday 9 AM',                        locked: false },
]
