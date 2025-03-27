// Initialize Navigation object
const Navigation = {
    currentSection: 0,
    
    showSection: function(index) {
        const sections = document.querySelectorAll('.section');
        const navItems = document.querySelectorAll('.nav-item');
        
        sections.forEach((section, i) => {
            if (i === index) {
                section.classList.add('active');
                this.updateFooter(section.id);
            } else {
                section.classList.remove('active');
            }
        });

        navItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        this.currentSection = index;
    },

    updateFooter: function(sectionId) {
        // Hide all interaction bars first
        const bars = document.querySelectorAll('.interaction-bar');
        bars.forEach(bar => {
            bar.style.display = 'none';
        });

        // Show appropriate interaction bar based on section
        if (sectionId === 'welcome-section') {
            const playbar = document.querySelector('.playbar');
            if (playbar) playbar.style.display = 'flex';
        } else if (sectionId === 'chat-section') {
            const chatbar = document.querySelector('.chatbar');
            if (chatbar) chatbar.style.display = 'flex';
        }
    },

    enableSection: function(index) {
        const navItem = document.querySelector(`.nav-item[data-section="${index}"]`);
        if (navItem) {
            navItem.disabled = false;
        }
    },

    disableSection: function(index) {
        const navItem = document.querySelector(`.nav-item[data-section="${index}"]`);
        if (navItem) {
            navItem.disabled = true;
        }
    }
};

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Set initial state
    Navigation.showSection(0);
    
    // Initially disable chat and tools sections
    Navigation.disableSection(1);
    Navigation.disableSection(2);
    
    // Listen for affirmations to enable chat section
    document.addEventListener('affirmationsComplete', () => {
        Navigation.enableSection(1);
    });
}); 