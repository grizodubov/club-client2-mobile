/* EXPORT: openEventRegistrationPopup */
export function openEventRegistrationPopup() {
    const p = document.getElementById('event-registration-popup');
    if (p) {
        p.style.setProperty('display', 'flex');
        setTimeout(() => {
            p.classList.add('show');
        }, 10);
    }
};


/* EXPORT: closeEventRegistrationPopup */
export function closeEventRegistrationPopup() {
    const p = document.getElementById('event-registration-popup');
    if (p) {
        p.classList.remove('show');
        setTimeout(() => {
            p.style.setProperty('display', 'none');
        }, 210);
    }
};
