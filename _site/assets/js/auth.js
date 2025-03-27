// Handles affirmations and section unlocking
const Auth = {
    init() {
        this.bindEvents();
        this.checkStoredState();
    },

    bindEvents() {
        document.querySelectorAll('.affirmation-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.checkAffirmations());
        });
    },

    checkAffirmations() {
        const tos = document.getElementById('tos').checked;
        const norms = document.getElementById('norms').checked;
        const acknowledge = document.getElementById('acknowledge').checked;
        const nextButton = document.getElementById('next-button');
        const accountButton = document.getElementById('account-button');

        const allChecked = tos && norms && acknowledge;

        // Enable/disable buttons
        [nextButton, accountButton].forEach(button => {
            if (button) {
                button.classList.toggle('enabled', allChecked);
                button.disabled = !allChecked;
            }
        });

        // Enable chat section in sidebar if all checked
        const chatNavButton = document.getElementById('nav-public-chat');
        if (chatNavButton) {
            chatNavButton.disabled = !allChecked;
        }

        // Store state
        localStorage.setItem('affirmations_complete', allChecked);
    },

    checkStoredState() {
        const affirmationsComplete = localStorage.getItem('affirmations_complete') === 'true';
        if (affirmationsComplete) {
            // Re-check boxes and enable buttons
            ['tos', 'norms', 'acknowledge'].forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox) checkbox.checked = true;
            });
            this.checkAffirmations();
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => Auth.init()); 