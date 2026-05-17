const fs = require('fs');
const testStr = 'ðŸ’¬ WhatsApp Us, ðŸ“ž +91 70658 15743 Get Directions â†’ âœ… Honest Recommendations';
const fixed = Buffer.from(testStr, 'latin1').toString('utf8');
console.log(fixed);
