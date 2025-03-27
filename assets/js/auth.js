// Handles affirmations and section unlocking
window.Auth = window.Auth || {
    init() {
        this.bindEvents();
        this.checkAffirmations();
    },

    bindEvents() {
        document.querySelectorAll('.affirmation-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.checkAffirmations());
        });
    },

    checkAffirmations() {
        const allChecked = Array.from(document.querySelectorAll('.affirmation-checkbox'))
            .every(checkbox => checkbox.checked);

        const unlockButton = document.getElementById('unlock-chat');
        if (unlockButton) {
            unlockButton.disabled = !allChecked;
        }

        // Store state
        localStorage.setItem('affirmationsChecked', allChecked);
        
        // Enable navigation if all checked
        if (allChecked) {
            document.querySelectorAll('#sidebar button').forEach(btn => {
                btn.removeAttribute('disabled');
            });
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => Auth.init()); 