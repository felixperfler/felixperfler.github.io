// Load header and footer
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('/shared/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            // Get current page from data attribute on body
            const currentPage = document.body.getAttribute('data-page');

            // Set directory path
            const paths = {
                'home': '~/felixperfler',
                'publications': '~/felixperfler/Publications',
                'about': '~/felixperfler/About'
            };

            const directoryPath = document.getElementById('directory-path');
            if (directoryPath && paths[currentPage]) {
                directoryPath.textContent = paths[currentPage];
            }

            // Set active navigation indicator
            const indicators = document.querySelectorAll('.nav-indicator');
            indicators.forEach(indicator => {
                indicator.style.color = 'transparent';
            });

            const activeIndicator = document.getElementById(currentPage + '-indicator');
            if (activeIndicator) {
                activeIndicator.style.color = 'var(--international-orange)';
            }

            // Set aria-current on active link
            const links = document.querySelectorAll('.TopButtons a');
            links.forEach(link => {
                if (link.getAttribute('data-page') === currentPage) {
                    link.setAttribute('aria-current', 'page');
                }
            });
        });

    // Load footer
    fetch('/shared/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;

            // Update the year dynamically (scripts in innerHTML don't execute)
            const currentYear = new Date().getFullYear();
            const footerText = document.querySelector('footer p');
            if (footerText) {
                footerText.innerHTML = `Copyright © 2023 – ${currentYear} Felix Perfler.`;
            }
        });
});
