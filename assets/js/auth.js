const Auth = {
    checkAffirmations: function() {
        const checkboxes = document.querySelectorAll('.affirmation-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        
        document.getElementById('unlock-chat').disabled = !allChecked;
        document.getElementById('account-button').disabled = !allChecked;
    },

    init: function() {
        document.querySelectorAll('.affirmation-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.checkAffirmations());
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
}); 