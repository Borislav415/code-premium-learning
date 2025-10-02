// Set current year
const yearEl = document.querySelector('.year');
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

//
//
//
//
//

// Make mobile navigation work
const btnNavEl = document.querySelector('.btn-mobile-nav');
const headerEl = document.querySelector('.header');

btnNavEl.addEventListener('click', function () {
  headerEl.classList.toggle('nav-open');
});

// Smooth scrolling animation
const allLinks = document.querySelectorAll('a:link');

allLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    const href = link.getAttribute('href');
    if (href.startsWith('https://') || href.startsWith('tel') || href.startsWith('mailto')) return;

    e.preventDefault();

    // Scroll back to top
    if (href === '#')
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

    // Scroll to other links
    if (href !== '#' && href.startsWith('#')) {
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({ behavior: 'smooth' });
    }

    // Close mobile naviagtion
    if (link.classList.contains('main-nav-link')) headerEl.classList.toggle('nav-open');
  });
});

// Sticky navigation
const sectionHeroEl = document.querySelector('.section-hero');

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];

    if (ent.isIntersecting === false) {
      document.body.classList.add('sticky');
    }

    if (ent.isIntersecting === true) {
      document.body.classList.remove('sticky');
    }
  },
  {
    root: null,
    threshold: 0,
    rootMargin: '-80px',
  }
);
obs.observe(sectionHeroEl);

//
//
//
//
//

// Brevo
const form = document.querySelector('.cta-form');
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    'api-key': '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',
  },
};

// Email validation function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = form.querySelector('#full-name').value.trim();
  const email = form.querySelector('#email').value.trim();
  const opt = form.querySelector('#select-where').value;

  // Validate name and email
  if (!name) {
    alert('Моля, въведете пълното си име.');
    return;
  }

  if (!validateEmail(email)) {
    alert('Моля, въведете валиден имейл адрес.');
    return;
  }

  try {
    // First email to the user
    const userEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      body: JSON.stringify({
        to: [{ name, email }],
        replyTo: {
          name: 'Martin Georgiev',
          email: 'support@codemasterclass.net',
        },
        templateId: 1,
        params: {
          name,
          email,
          opt,
        },
      }),
      ...options,
    });

    const userEmailResult = await userEmailResponse.json();
    console.log('Имейл до потребителя е изпратен:', userEmailResult);

    // Second email back to support notifying appointment set
    const supportEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      body: JSON.stringify({
        to: [{ name: 'Martin Georgiev', email: 'support@codemasterclass.net' }],
        replyTo: {
          name,
          email,
        },
        templateId: 2,
        params: {
          name,
          email,
          opt,
        },
      }),
      ...options,
    });

    const supportEmailResult = await supportEmailResponse.json();
    // console.log('Имейл до поддръжката е изпратен:', supportEmailResult);

    alert('Срещата е успешно насрочена!');

    // Reset form fields
    form.reset();
  } catch (error) {
    // console.error('Грешка:', error);
    alert('Възникна грешка при изпращането на имейлите. Моля, опитайте отново.');
  }
});
