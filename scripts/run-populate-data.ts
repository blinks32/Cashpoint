#!/usr/bin/env tsx

import { populateTestData } from './populate-test-data.js';

// Run the populate function
populateTestData()
  .then(() => {
    console.log('\n✅ Test data population completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to populate test data:', error);
    process.exit(1);
  });