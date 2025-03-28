// Chat Core Configuration
const LAMBDA_ENDPOINT = 'https://tixnmh1pe8.execute-api.us-east-2.amazonaws.com/prod/IntegralEd-Main';

// State Management
let messageCount = 0;
let selectedGrade = null;
let contextReady = false;
let userContext = null;

// Initialize chat session with context awareness
function initChat(options = {}) {
    if (!window.ASSISTANT_ID) {
        console.error('No ASSISTANT_ID provided. Set window.ASSISTANT_ID before initializing chat.');
        return;
    }

    // Load existing thread if available
    window.threadId = localStorage.getItem('threadId') || null;
    
    // Check for Softr context
    if (typeof Softr !== 'undefined' && typeof Softr.user?.get === 'function') {
        Softr.user.get()
            .then(userData => {
                if (userData && userData.airtable_record_id) {
                    userContext = {
                        userId: userData.airtable_record_id,
                        name: userData.Name,
                        organization: userData.Organization
                    };
                } else {
                    userContext = getContextFromUrl();
                }
                setContextReady();
            })
            .catch(error => {
                console.error('Error getting Softr user data:', error);
                userContext = getContextFromUrl();
                setContextReady();
            });
    } else {
        // Not in Softr, try URL params
        userContext = getContextFromUrl();
        setContextReady();
    }
    
    console.log('Chat initializing:', {
        assistant: window.ASSISTANT_ID,
        thread: window.threadId,
        context: contextReady ? 'ready' : 'waiting',
        messages: messageCount
    });

    // If preload context is provided, start a thread with it
    if (options.preloadContext) {
        startContextThread(options.preloadContext);
    }
}

function getContextFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return {
        userId: params.get('User_ID') || 'anonymous',
        name: params.get('Name') || 'friend',
        organization: params.get('Organization') || 'Unknown'
    };
}

function setContextReady() {
    contextReady = true;
    console.log('Context ready:', userContext);
    document.dispatchEvent(new Event('chat-context-ready'));
}

async function startContextThread(context) {
    try {
        const response = await sendMessage(context, { isContext: true });
        if (response.Thread_ID) {
            window.threadId = response.Thread_ID;
            localStorage.setItem('threadId', window.threadId);
        }
    } catch (error) {
        console.error('Failed to start context thread:', error);
    }
}

function validateThread() {
    if (!window.threadId) return false;
    
    // Check if thread matches current assistant
    return sendMessage('validate', { validate: true })
        .then(() => true)
        .catch(() => {
            console.log('Thread validation failed, resetting session');
            resetSession();
            return false;
        });
}

function sanitizeResponse(text) {
    try {
        // Remove non-printable characters except newlines
        text = text.replace(/[^\x20-\x7E\n]/g, '');
        // Remove multiple spaces
        text = text.replace(/\s+/g, ' ');
        // Remove multiple newlines
        text = text.replace(/\n+/g, '\n');
        return text.trim();
    } catch (e) {
        console.error('Error sanitizing response:', e);
        return 'I apologize, but I received an invalid response. Please try again.';
    }
}

// Message handling
function sendMessage(input, options = {}) {
    if (!window.ASSISTANT_ID) {
        throw new Error('No ASSISTANT_ID provided');
    }
    if (!contextReady && !options.isContext) {
        throw new Error('Context not ready');
    }
    if (input.trim() === "") return;
    
    messageCount++;
    
    const requestBody = {
        message: input,
        assistantId: window.ASSISTANT_ID,
        debug: true,
        ...(options.grade && { grade: options.grade }),
        ...(window.threadId && { threadId: window.threadId }),
        ...(userContext && { userContext }),
        ...(options.isContext && { isContext: true }),
        ...(options.validate && { validate: true })
    };
    
    console.log(`Message ${messageCount} request:`, {
        assistantId: requestBody.assistantId,
        threadId: requestBody.threadId,
        preview: input.substring(0, 50) + (input.length > 50 ? '...' : '')
    });
    
    return fetch(LAMBDA_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        if (!data.response && !options.validate) {
            throw new Error('No response received');
        }
        
        if (data.Thread_ID) {
            window.threadId = data.Thread_ID;
            localStorage.setItem('threadId', window.threadId);
        }
        
        data.response = options.validate ? data.response : sanitizeResponse(data.response);
        return data;
    })
    .catch(error => {
        console.error('Error:', error);
        throw error;
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
    getGrade,
    isContextReady: () => contextReady,
    validateThread
}; 