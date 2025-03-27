let messageCount = 0;
let threadId = localStorage.getItem('threadId') || null;

document.addEventListener("DOMContentLoaded", function() {
    console.log('Session initialized:', threadId ? `Using thread ${threadId}` : 'No existing thread');
    
    const chatInput = document.getElementById("chat-input");
    const sendButton = document.querySelector(".send-button");
    
    if (chatInput && sendButton) {
        chatInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
            if (event.key === "Tab") {
                event.preventDefault();
                sendButton.focus();
            }
        });

        sendButton.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
            }
        });

        // Add click handler for send button
        sendButton.addEventListener("click", sendMessage);
    }
});

function sendMessage() {
    const input = document.getElementById("chat-input");
    if (!input || input.value.trim() === "") return;
    
    messageCount++;
    console.log(`Message ${messageCount}: ${threadId ? `Using thread ${threadId}` : 'No thread exists'}`);
    
    const requestBody = threadId ? 
        { message: input.value, threadId: threadId } : 
        { message: input.value };
    
    const chatWindow = document.getElementById("chat-window");
    if (!chatWindow) return;
    
    const message = document.createElement("div");
    message.classList.add("message", "user");
    message.textContent = input.value;
    chatWindow.appendChild(message);
    input.value = "";
    chatWindow.scrollTop = chatWindow.scrollHeight;

    const transmissionIndicator = document.createElement("div");
    transmissionIndicator.classList.add("message", "assistant");
    transmissionIndicator.textContent = "Sending...";
    chatWindow.appendChild(transmissionIndicator);

    fetch('https://tixnmh1pe8.execute-api.us-east-2.amazonaws.com/prod/IntegralEd-Main', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Full Lambda response:', data);
        
        transmissionIndicator.remove();
        const responseMessage = document.createElement("div");
        responseMessage.classList.add("message", "assistant");
        responseMessage.textContent = data.response;
        chatWindow.appendChild(responseMessage);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        
        if (messageCount === 5) {
            saveChat();
        }

        // Store thread ID if provided
        if (data.Thread_ID) {
            threadId = data.Thread_ID;
            localStorage.setItem('threadId', threadId);
        }
    })
    .catch((error) => {
        console.error('Error with thread:', threadId, error);
        transmissionIndicator.textContent = "Failed to send message.";
    });
}

// Helper function to save chat (placeholder)
function saveChat() {
    console.log('Saving chat...');
    // Implement chat saving functionality
} 