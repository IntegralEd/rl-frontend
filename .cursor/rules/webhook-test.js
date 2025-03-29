const schema = require('./webhook-schema.json');

function validateWebhookPayload(payload) {
  const errors = [];
  
  // Validate user_data
  if (!payload.user_data) {
    errors.push('Missing user_data object');
  } else {
    const userFields = schema.collections.user_data.fields;
    for (const [field, config] of Object.entries(userFields)) {
      if (config.required && !payload.user_data[field]) {
        errors.push(`Missing required field: user_data.${field}`);
      }
    }
  }

  // Validate document_data
  if (!payload.document_data) {
    errors.push('Missing document_data object');
  } else {
    const docFields = schema.collections.document_data.fields;
    for (const [field, config] of Object.entries(docFields)) {
      if (config.required && !payload.document_data[field]) {
        errors.push(`Missing required field: document_data.${field}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Test the validation
const testPayload = {
  user_data: {
    name: "Jordan Smith",
    email: "jordan.smith@school.edu",
    user_id: "",
    thread_id: "thread_abc123",
    assistant_id: "asst_IA5PsJxdShVPTAv2xeXTr4Ma",
    org_id: "recsK5zK0CouK5ebW",
    intake_token: "goalsetter_chat",
    source: "url",
    url: "https://recursivelearning.app/clients/st/goal-setter.html"
  },
  document_data: {
    subject_and_grade: "5th Grade Science",
    learning_target: "Students will be able to analyze and explain the relationships within an ecosystem",
    measure_of_success: "80% of students will score proficient or above on the ecosystem assessment",
    classroom_goal_statement: "By the end of the unit, students will demonstrate understanding of ecosystem relationships through a combination of written assessments and hands-on projects"
  }
};

const result = validateWebhookPayload(testPayload);
console.log('Validation result:', result); 