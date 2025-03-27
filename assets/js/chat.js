document.addEventListener('DOMContentLoaded', function() {
    initChatInterface({
        User_ID: "test_user",
        Assistant_ID: "asst_IA5PsJxdShVPTAv2xeXTr4Ma",
        Org_ID: "recjUGiOT65lwgBtm",
        Thread_ID: null
    });
});

function initChatInterface(config) {
    // Add thread persistence
    config.threadId = localStorage.getItem('threadId') || null;
    console.log('Session initialized:', config.threadId ? `Using thread ${config.threadId}` : 'No existing thread');
    
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.querySelector('.send-button');

    if (!chatWindow || !chatInput || !sendButton) {
        console.error('Error: Required DOM elements not found');
        return;
    }

    // Display welcome message
    displayAssistantMessage('Hello! How can I assist you today?');

    // Send message on button click
    sendButton.addEventListener('click', function() {
        const message = chatInput.value.trim();
        if (message !== '') {
            sendMessage(message, config);
            chatInput.value = '';
        }
    });

    // Send message on Enter key
    chatInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendButton.click();
        }
        // Tab handling
        if (event.key === 'Tab') {
            event.preventDefault();
            sendButton.focus();
        }
    });

    // Handle enter key on send button when focused
    sendButton.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    function sendMessage(message, config) {
        displayUserMessage(message);

        const payload = {
            User_ID: config.User_ID,
            Assistant_ID: config.Assistant_ID,
            Org_ID: config.Org_ID,
            message: message,
            threadId: config.threadId
        };

        // Show loading indicator
        const transmissionIndicator = document.createElement("div");
        transmissionIndicator.classList.add("message", "assistant");
        transmissionIndicator.textContent = "Sending...";
        chatWindow.appendChild(transmissionIndicator);

        fetch('https://tixnmh1pe8.execute-api.us-east-2.amazonaws.com/prod/IntegralEd-Main', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            transmissionIndicator.remove();
            if (data && data.response) {
                displayAssistantMessage(data.response);
                // Persist threadId
                if (data.Thread_ID) {
                    config.threadId = data.Thread_ID;
                    localStorage.setItem('threadId', data.Thread_ID);
                }
            } else {
                displayAssistantMessage('Sorry, I did not understand that.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            transmissionIndicator.textContent = "Failed to send message.";
        });
    }

    function displayUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user');
        messageElement.innerText = message;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function displayAssistantMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'assistant');
        messageElement.innerText = message;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
} 