const Navigation = {
    currentSection: 0,
    
    showSection: function(index) {
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, i) => {
            if (i === index) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        this.currentSection = index;
    },

    init: function() {
        this.showSection(0);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
}); 