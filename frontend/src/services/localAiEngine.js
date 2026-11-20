/**
 * Client-Side Smart AI Assistant & Natural Language Triage Engine
 * Zero external dependencies. Instant real-time evaluation as student types.
 */

export const CATEGORY_KEYWORDS = {
  'Classroom Projector': [
    'projector', 'display', 'hdmi', 'vga', 'screen', 'lens', 'flicker', 'blurry',
    'lamp', 'bulb', 'audio-visual', 'av', 'presentation', 'smart board', 'overheat'
  ],
  'Wi-Fi / Internet': [
    'wifi', 'wi-fi', 'internet', 'network', 'router', 'lan', 'connection', 'bandwidth',
    'slow', 'disconnect', 'portal', 'login', 'dns', 'ip', 'signal', 'access point', 'ethernet'
  ],
  'Drinking Water': [
    'water', 'cooler', 'filter', 'purifier', 'drinking', 'tap', 'leak', 'dispenser',
    'taste', 'smell', 'dirty water', 'water supply', 'empty tank', 'ro', 'aquaguard'
  ],
  'Laboratory Equipment': [
    'lab', 'oscilloscope', 'multimeter', 'microscope', 'pc', 'computer', 'bench',
    'chemical', 'reagent', 'soldering', 'trainer kit', 'workbench', 'apparatus', 'hardware'
  ],
  'Washroom Maintenance': [
    'washroom', 'toilet', 'restroom', 'flush', 'plumbing', 'drain', 'smell', 'stink',
    'soap', 'basin', 'hygiene', 'clogged', 'sanitary', 'cleaning', 'odor'
  ],
  'Hostel Maintenance': [
    'hostel', 'room', 'bed', 'fan', 'tube light', 'almirah', 'wardrobe', 'window',
    'door lock', 'cupboard', 'corridor', 'dorm', 'geyser', 'heater', 'balcony'
  ]
};

const CRITICAL_KEYWORDS = [
  'spark', 'fire', 'shock', 'electric', 'smoke', 'short circuit', 'flood',
  'burst', 'emergency', 'danger', 'hazard', 'bleeding', 'injury', 'urgent'
];

const HIGH_KEYWORDS = [
  'exam', 'test', 'deadline', 'viva', 'presentation today', 'not working at all',
  'severe', 'entire block', 'entire floor', 'all students', 'critical'
];

export function liveAiPredict(text = '') {
  if (!text || text.trim().length < 4) {
    return {
      suggestedCategory: null,
      priority: 'Medium',
      urgencyScore: 40,
      etaHours: 24,
      isHazard: false,
    };
  }

  const lower = text.toLowerCase();

  // Category Scoring
  let bestCat = null;
  let maxScore = 0;

  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    words.forEach(w => {
      if (lower.includes(w)) score += 2;
    });
    if (score > maxScore) {
      maxScore = score;
      bestCat = cat;
    }
  }

  // Hazard & Urgency Scoring
  let urgency = 45;
  let isHazard = false;

  CRITICAL_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) {
      urgency += 35;
      isHazard = true;
    }
  });

  HIGH_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) {
      urgency += 18;
    }
  });

  urgency = Math.max(10, Math.min(98, urgency));

  let priority = 'Medium';
  let etaHours = 24;

  if (urgency >= 80 || isHazard) {
    priority = 'Critical';
    etaHours = 4;
  } else if (urgency >= 65) {
    priority = 'High';
    etaHours = 12;
  } else if (urgency < 35) {
    priority = 'Low';
    etaHours = 48;
  }

  return {
    suggestedCategory: maxScore >= 2 ? bestCat : null,
    priority,
    urgencyScore: urgency,
    etaHours,
    isHazard,
  };
}
