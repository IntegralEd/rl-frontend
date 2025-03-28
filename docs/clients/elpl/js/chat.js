// Chat Core Configuration
const LAMBDA_ENDPOINT = 'https://tixnmh1pe8.execute-api.us-east-2.amazonaws.com/prod/IntegralEd-Main';
const ASSISTANT_ID = 'asst_QoAA395ibbyMImFJERbG2hKT';

// State Management
let messageCount = 0;
let selectedGrade = null;

// Initialize chat session
function initChat() {
    window.threadId = localStorage.getItem('threadId') || null;
    console.log(`Chat initialized: ${messageCount} messages, ${window.threadId ? `thread ${window.threadId}` : 'no thread'}`);
}

// Message handling
function sendMessage(input, options = {}) {
    if (input.trim() === "") return;
    
    messageCount++;
    console.log(`Message ${messageCount} sent${options.grade ? ` for grade ${options.grade}` : ''}`);
    
    const requestBody = {
        message: input,
        assistantId: ASSISTANT_ID,
        ...(options.grade && { grade: options.grade }),
        ...(window.threadId && { threadId: window.threadId })
    };
    
    return fetch(LAMBDA_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        console.log(`Message ${messageCount} completed, response received`);
        return data;
    });
}

// Session management
function resetSession() {
    window.threadId = null;
    localStorage.removeItem('threadId');
    messageCount = 0;
    console.log('Chat session reset');
}

// Grade selection (for embed version)
function setGrade(grade) {
    selectedGrade = grade;
    localStorage.setItem('selectedGrade', grade);
    console.log(`Grade set to: ${grade}`);
}

function getGrade() {
    return localStorage.getItem('selectedGrade');
}

// Export functions
window.chatCore = {
    init: initChat,
    send: sendMessage,
    reset: resetSession,
    setGrade,
    getGrade
}; 