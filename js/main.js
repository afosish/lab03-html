document.addEventListener('DOMContentLoaded', init);

function init() {
    initActiveNav();
    initMenuToggle();
    initThemeToggle();
    initBackToTop();
    initFooterYear();
    initAccordion();
    initFilters();
    initModal();
    initContactForm();
}

function initActiveNav() {
    const links = document.querySelectorAll('.nav-list a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentPath)) {
            link.classList.add('active');
        }
    });
}

function initMenuToggle() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-list');
    
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('is-open');
            const isExpanded = nav.classList.contains('is-open');
            burger.setAttribute('aria-expanded', isExpanded);
        });
    }
}

function initThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('siteTheme');
    
    if (savedTheme === 'dark') {
        body.classList.add('theme-dark');
    }

    if (btn) {
        btn.addEventListener('click', () => {
            body.classList.toggle('theme-dark');
            const isDark = body.classList.contains('theme-dark');
            localStorage.setItem('siteTheme', isDark ? 'dark' : 'light');
        });
    }
}

function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (btn) {
        window.addEventListener('scroll', () => {
            btn.hidden = window.scrollY < 300;
        });
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function initFooterYear() {
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');
           
            document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.accordion-content').forEach(c => c.hidden = true);
            
            if (!isActive) {
                header.classList.add('active');
                content.hidden = false;
            }
        });
    });
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.filter-item');
    
    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.filter;
            items.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.hidden = false;
                } else {
                    item.hidden = true;
                }
            });
        });
    });
}

function initModal() {
    const modal = document.querySelector('.modal');
    const modalImg = document.querySelector('.modal-img');
    const closeBtn = document.querySelector('.modal-close');
    const triggers = document.querySelectorAll('.modal-trigger');

    if (!modal || triggers.length === 0) return;

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (trigger.tagName === 'IMG') {
                modalImg.src = trigger.src;
            }
            modal.hidden = false;
        });
    });

    closeBtn?.addEventListener('click', () => modal.hidden = true);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.hidden = true;
    });
}

function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    const nameInput = form.querySelector('#username');
    const emailInput = form.querySelector('#useremail');
    const msgInput = form.querySelector('#message');
    const charCount = form.querySelector('.char-count');
    const successMsg = document.querySelector('.form-success');
    const draftKey = 'contactDraft';

    const savedDraft = JSON.parse(localStorage.getItem(draftKey) || '{}');
    if (savedDraft.username && nameInput) nameInput.value = savedDraft.username;
    if (savedDraft.useremail && emailInput) emailInput.value = savedDraft.useremail;
    if (savedDraft.message && msgInput) {
        msgInput.value = savedDraft.message;
        updateCharCount();
    }

    function updateCharCount() {
        if (charCount && msgInput) {
            charCount.textContent = `${msgInput.value.length} / 500 символів`;
        }
    }
    
    if (msgInput) {
        msgInput.addEventListener('input', updateCharCount);
    }

    form.addEventListener('input', () => {
        const draft = {
            username: nameInput?.value || '',
            useremail: emailInput?.value || '',
            message: msgInput?.value || ''
        };
        localStorage.setItem(draftKey, JSON.stringify(draft));
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

        if (nameInput.value.trim().length < 2) {
            document.querySelector('#username-error').textContent = 'Ім\'я має містити мінімум 2 символи.';
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            document.querySelector('#useremail-error').textContent = 'Введіть коректний email.';
            isValid = false;
        }
        
        if (msgInput.value.trim().length === 0) {
            document.querySelector('#message-error').textContent = 'Повідомлення не може бути порожнім.';
            isValid = false;
        }

        if (isValid) {
            const formData = new FormData(form);
            const dataObj = Object.fromEntries(formData.entries());
            console.log('Дані готові до відправки:', dataObj);
            
            form.hidden = true;
            successMsg.hidden = false;
         
            localStorage.removeItem(draftKey);
        }
    });
}