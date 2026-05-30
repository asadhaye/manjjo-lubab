// Tehsil-based delivery validation for Lahore (no API required)

// Lahore Tehsils and major areas for keyword matching
const LAHORE_TEHSILS_AND_AREAS = [
  // Tehsils
  'lahore city',
  'lahore cantt',
  'lahore cantonment',
  'shalimar',
  'data ganj bakhsh',
  'wagah',
  'samanabad',
  'gulberg',
  'iqbal town',
  'nishtar town',
  'allama iqbal town',
  'ravi town',
  'shadbagh',
  'aziz bhatti town',
  'harbanspura',
  
  // Major areas/neighborhoods
  'dha',
  'dha phase 1',
  'dha phase 2',
  'dha phase 3',
  'dha phase 4',
  'dha phase 5',
  'dha phase 6',
  'dha phase 7',
  'dha phase 8',
  'dha phase 9',
  'dha phase 10',
  'pchs A Block',
  'pchs B Block',
  'pchs C Block',
  'pchs D Block',
  'pchs E Block',
  'pchs F Block',  
  'defence',
  'gulberg',
  'johar town',
  'model town',
  'cantt',
  'cantonment',
  'faisal town',
  'township',
  'wapda town',
  'bahria town',
  'lake city',
  'valencia',
  'eden',
  'askari',
  'sui gas',
  'multan road',
  'ferozepur road',
  'canal road',
  'mall road',
  'main boulevard',
  'gulshan-e-iqbal',
  'gulshan-e-ravi',
  'samnabad',
  'ichra',
  'mughalpura',
  'baghbanpura',
  'shahdara',
  'badami bagh',
  'anarkali',
  'taxila gate',
  'mochi gate',
  'bhati gate',
  'kashmiri gate',
  'ravi road',
  'band road',
  'ring road',
  'thokar niaz baig',
  'harbanspura',
  'bedian road',
  'raiwind road',
  'sundar industrial estate',
  'quaid-e-azam industrial estate',
  'kot lakhpat',
  'nawab town',
  'pakistan town',
  'khayaban-e-amin',
  'khayaban-e-jinnah',
  'khayaban-e-sir syed',
  'garden town',
  'paragon city',
  'bahria orchard',
  'fazaia housing scheme',
  'paf housing scheme',
  'askari housing',
  'sui gas housing',
  'punjab cooperative housing society',
  'ghazi road',
  'shanghai road',
  
  // Common variations
  'lahore',
  'punjab',
  'pakistan'
]

/**
 * Validate if an address is within Lahore delivery zone using keyword matching
 */
export function validateDeliveryAddress(address: string): {
  valid: boolean
  message: string
} {
  // Basic validation first
  if (!address || address.trim().length < 10) {
    return {
      valid: false,
      message: 'Please enter a complete delivery address (at least 10 characters)'
    }
  }

  const addressLower = address.toLowerCase().trim()
  
  // Check for house number (patterns: house #, h#, #, no, plot)
  const hasHouseNumber = /house\s*#|h\s*#|#\s*\d|plot\s*\d|no\s*\d/i.test(addressLower)
  
  // Check for street (patterns: street, st, road, rd)
  const hasStreet = /street|st\.|road|rd\.|road\s*\d/i.test(addressLower)
  
  // Check for block (patterns: block, blk)
  const hasBlock = /block|blk\.|b\s*\d/i.test(addressLower)
  
  // Check if address contains any Lahore Tehsil or area keywords
  const foundArea = LAHORE_TEHSILS_AND_AREAS.some(area => 
    addressLower.includes(area)
  )

  // Validate required components
  if (!hasHouseNumber) {
    return {
      valid: false,
      message: 'Please include your house number (e.g., House #123, H-123, #123, Plot 123)'
    }
  }

  if (!hasStreet) {
    return {
      valid: false,
      message: 'Please include your street name or road (e.g., Street 5, Main Road, Ferozepur Road)'
    }
  }

  if (!foundArea) {
    return {
      valid: false,
      message: 'Please include your area/society name (e.g., DHA Phase 1, Gulberg, Johar Town, Model Town, etc.)'
    }
  }

  return {
    valid: true,
    message: 'Address validated successfully'
  }
}
