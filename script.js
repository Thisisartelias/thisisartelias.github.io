const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const revealTargets = [...document.querySelectorAll("[data-reveal]")];
const forms = [...document.querySelectorAll("form[action]")];

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

forms.forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const successMessage = form.querySelector(".form-success") || form.parentElement.querySelector(".form-success");
    const submitButton = form.querySelector("button[type='submit']");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      form.reset();

      if (successMessage) {
        successMessage.hidden = false;
      }

      if (submitButton) {
        submitButton.textContent = "Sent";
        submitButton.disabled = true;

        window.setTimeout(() => {
          submitButton.textContent = "Send Enquiry";
          submitButton.disabled = false;
        }, 2500);
      }
    } catch (error) {
      window.alert("There was a problem sending your message. Please try again.");
    }
  });
});
