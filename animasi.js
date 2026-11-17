/* Small, dependency-free interactions shared by the login and sign-up pages. */
(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const form = document.querySelector('.login-form');

    // Reveal the page in a short sequence so the card feels intentional, not abrupt.
    if (!reduceMotion) {
        document.documentElement.classList.add('motion-ready');
        // Two frames ensure the browser paints the hidden state before revealing it.
        requestAnimationFrame(() => requestAnimationFrame(() => {
            document.documentElement.classList.add('page-visible');
        }));
    }

    // Ensure content remains visible if a browser blocks or delays animation frames.
    window.setTimeout(() => document.documentElement.classList.add('page-visible'), 700);

    // Fields lift into place and get a clear focus response as the user moves through the form.
    if (!reduceMotion) {
        document.querySelectorAll('.input-wrap').forEach((field, index) => {
            field.style.setProperty('--field-order', index);
            field.addEventListener('focusin', () => field.classList.add('field-active'));
            field.addEventListener('focusout', () => field.classList.remove('field-active'));
        });
    }

    // Add a quick confirmation motion while keeping normal browser validation intact.
    if (form) {
        form.addEventListener('submit', (event) => {
            if (!form.reportValidity()) {
                event.preventDefault();
                return;
            }
            const button = form.querySelector('.submit-button');
            if (button) {
                button.classList.add('is-pressed');
                window.setTimeout(() => button.classList.remove('is-pressed'), 220);
            }
        });
    }

    // Gentle pointer response on larger screens; disabled for touch and reduced-motion users.
    const card = document.querySelector('.login-layout');
    if (card && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        card.addEventListener('pointermove', (event) => {
            const bounds = card.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width;
            const y = (event.clientY - bounds.top) / bounds.height;
            card.style.setProperty('--pointer-x', `${Math.round(x * 100)}%`);
            card.style.setProperty('--pointer-y', `${Math.round(y * 100)}%`);
        });
    }
})();
