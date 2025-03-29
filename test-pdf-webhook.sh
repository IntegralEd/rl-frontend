#!/bin/bash

# Make.com webhook URL
WEBHOOK_URL="https://hook.us1.make.com/w2ry0jbxh13h9xgd83hdrkts61au6uwj"

# Function to print response details
print_response() {
    echo "Status Code: $1"
    echo "Response Body: $2"
    echo "----------------------------------------"
}

# Test Case: StriveTogether Goal Setter Webhook
echo "Testing StriveTogether Goal Setter Webhook"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_data": {
      "name": "Jordan Smith",
      "email": "jordan.smith@school.edu",
      "user_id": "",
      "thread_id": "thread_abc123",
      "assistant_id": "asst_IA5PsJxdShVPTAv2xeXTr4Ma",
      "subject_and_grade": "5th Grade Science",
      "learning_target": "Students will be able to analyze and explain the relationships within an ecosystem",
      "measure_of_success": "80% of students will score proficient or above on the ecosystem assessment",
      "classroom_goal_statement": "By the end of the unit, students will demonstrate understanding of ecosystem relationships through a combination of written assessments and hands-on projects",
      "org_id": "recsK5zK0CouK5ebW",
      "intake_token": "goalsetter_chat",
      "source": "url"
    },
    "template_id": "st_goal_setter",
    "client_id": "st",
    "version": "1.0"
  }')

STATUS_CODE=$(echo "$RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')
print_response "$STATUS_CODE" "$RESPONSE_BODY"

# Wait a moment between tests
sleep 2

# Test Case 2: Webhook Data Structure Test
echo -e "\n\nTesting Case 2: Webhook Data Structure Test"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_data": {
      "message": "I need to create a detailed learning plan for my 5th grade science class",
      "threadId": "thread_xyz789",
      "metadata": {
        "grade_level": "5",
        "subject_area": "Science",
        "timestamp": "2024-03-29T12:05:00Z"
      },
      "chat_summary": "Teacher needs to create a comprehensive learning plan for 5th grade science focusing on ecosystems and environmental impact. The plan should include both theoretical understanding and practical applications.",
      "learning_target": "Develop understanding of ecosystem interactions and human environmental impact",
      "success_criteria": "1. Complete ecosystem mapping project\n2. Present findings on environmental impact\n3. Create action plan for local conservation\n4. Score 85% on unit assessment"
    },
    "template_id": "st_goal_setter",
    "client_id": "st",
    "version": "1.0"
  }')

STATUS_CODE=$(echo "$RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')
print_response "$STATUS_CODE" "$RESPONSE_BODY"

# Wait a moment between tests
sleep 2

# Test Case 3: Error Case - Missing Required Fields
echo -e "\n\nTesting Case 3: Error Case - Missing Required Fields"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_data": {
      "message": "Test message",
      "threadId": "thread_test123"
    },
    "template_id": "st_goal_setter",
    "client_id": "st"
  }')

STATUS_CODE=$(echo "$RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')
print_response "$STATUS_CODE" "$RESPONSE_BODY" 