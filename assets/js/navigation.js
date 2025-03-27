// Handles section navigation and state management
const Navigation = {
    init() {
        this.currentSection = 0;
        this.showSection(0);
        this.bindEvents();
    },

    bindEvents() {
        // Bind sidebar navigation
        document.querySelectorAll('#sidebar button').forEach((button, index) => {
            button.addEventListener('click', () => this.showSection(index));
        });
    },

    showSection(index) {
        this.currentSection = index;
        
        // Update sections visibility
        document.querySelectorAll('.section').forEach((section, i) => {
            section.classList.toggle('active', i === index);
        });

        // Update sidebar active state
        document.querySelectorAll('#sidebar button').forEach((button, i) => {
            button.classList.toggle('active', i === index);
        });

        // Toggle appropriate footer
        this.updateFooter(index);

        // Special handling for chat section
        if (index === 1) {
            this.initializeChatSection();
        }
    },

    updateFooter(index) {
        const playbarContainer = document.getElementById('playbar-container');
        const chatbarContainer = document.getElementById('chatbar-container');
        
        if (index === 1) { // Chat section
            playbarContainer.style.display = 'none';
            chatbarContainer.style.display = 'block';
        } else {
            playbarContainer.style.display = 'block';
            chatbarContainer.style.display = 'none';
        }
    },

    initializeChatSection() {
        document.getElementById('nav-public-chat').removeAttribute('disabled');
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.style.display = 'flex';
        }
    }
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Navigation.init());
} else {
    Navigation.init();
} 