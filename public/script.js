// ThisIsArtElias — plain static site behaviour
// Mobile nav toggle + fake contact form submission. No framework, no build step.

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.querySelector('.nav-mobile');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var form = document.querySelector('.contact-form');
  if (form) {
    var successBox = form.querySelector('.form-success');
    var submitBtn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (successBox) {
        successBox.classList.add('is-visible');
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Message Sent';
        setTimeout(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
          if (successBox) successBox.classList.remove('is-visible');
          form.reset();
        }, 5000);
      }
    });
  }
});
