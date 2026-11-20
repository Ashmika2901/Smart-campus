/**
 * Smart Campus AI Triage & Natural Language Processing Service
 * Free, deterministic, zero-dependency AI engine for campus complaints.
 */

const CATEGORY_KEYWORDS = {
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

const LOW_KEYWORDS = [
    'minor', 'slight', 'request', 'suggestion', 'cosmetic', 'paint', 'creak', 'slowly'
];

/**
 * Analyzes complaint description and predicts optimal category, priority, and ETA
 */
function analyzeComplaint({ description, userCategory, location = '' }) {
  const text = `${description} ${location}`.toLowerCase();
  
  // 1. Predict Category via keyword resonance
  let categoryScores = {};
  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    words.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) score += matches.length * 2;
      else if (text.includes(word)) score += 1;
    });
    categoryScores[cat] = score;
  }

  // Sort candidate categories
  const sortedCategories = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]);
  const bestMatch = sortedCategories[0];
  const aiSuggestedCategory = bestMatch && bestMatch[1] > 0 ? bestMatch[0] : (userCategory || 'Other');

  // 2. Assess Urgency & Priority
  let urgencyScore = 45; // baseline medium

  // Check critical hazards
  let hasCriticalWord = false;
  CRITICAL_KEYWORDS.forEach(kw => {
    if (text.includes(kw)) {
      urgencyScore += 30;
      hasCriticalWord = true;
    }
  });

  // Check high priority keywords
  HIGH_KEYWORDS.forEach(kw => {
    if (text.includes(kw)) {
      urgencyScore += 18;
    }
  });

  // Check low priority keywords
  LOW_KEYWORDS.forEach(kw => {
    if (text.includes(kw)) {
      urgencyScore -= 15;
    }
  });

  // Cap urgency between 5 and 99
  urgencyScore = Math.max(10, Math.min(98, urgencyScore));

  let aiPriority = 'Medium';
  let aiResolutionEtaHours = 24;

  if (urgencyScore >= 80 || hasCriticalWord) {
    aiPriority = 'Critical';
    aiResolutionEtaHours = 4;
  } else if (urgencyScore >= 65) {
    aiPriority = 'High';
    aiResolutionEtaHours = 12;
  } else if (urgencyScore < 35) {
    aiPriority = 'Low';
    aiResolutionEtaHours = 48;
  }

  // 3. Generate Smart Triage Recommendation
  let triageNote = '';
  if (aiPriority === 'Critical') {
    triageNote = 'Immediate physical inspection recommended due to potential safety or infrastructure risk.';
  } else if (aiPriority === 'High') {
    triageNote = 'High operational impact on ongoing academic/lab sessions; assign to duty technician promptly.';
  } else if (aiPriority === 'Medium') {
    triageNote = 'Standard campus service level agreement applies. Schedule for maintenance within 24 hours.';
  } else {
    triageNote = 'Low impact routine maintenance. Batch with regular facility rounds.';
  }

  return {
    aiSuggestedCategory,
    aiPriority,
    aiUrgencyScore: urgencyScore,
    aiResolutionEtaHours,
    triageNote,
  };
}

module.exports = {
  analyzeComplaint,
};
