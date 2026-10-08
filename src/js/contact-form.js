// Progressive-enhancement behaviour for the contact form:
// 1. Drives the custom "glass select" dropdown (open/close, keyboard, selection).
// 2. Reveals + requires the "Tell us your craft" field when "Other" is picked.
// 3. Blocks submit with a visible error if the budget select is left empty.

function init() {
  initGlassSelects();
  initNicheOther();
  initSubmitGuard();
  initSentModal();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function initGlassSelects() {
  document.querySelectorAll("[data-glass-select]").forEach((root) => {
    const trigger = root.querySelector(".glass-select__trigger");
    const panel = root.querySelector(".glass-select__panel");
    const valueEl = root.querySelector(".glass-select__value");
    const hiddenInput = root.querySelector('input[type="hidden"]');
    const options = Array.from(root.querySelectorAll(".glass-select__option"));
    const noteEl = root.querySelector(".glass-select__note");
    let activeIndex = -1;
    let noteTimer;

    // Fades the old caption out before swapping in the new one
    const showNote = (text) => {
      clearTimeout(noteTimer);
      noteEl.classList.remove("is-visible");
      noteTimer = setTimeout(() => {
        noteEl.textContent = text;
        noteEl.classList.add("is-visible");
      }, 200);
    };

    // Panel is portalled to <body> with fixed positioning so it can never be
    // clipped by the scrolling form column, which was blocking mouse clicks
    // on options while keyboard selection (which doesn't need visibility) still worked.
    document.body.appendChild(panel);

    const positionPanel = () => {
      const rect = trigger.getBoundingClientRect();
      const gap = 10;
      const margin = 12;
      panel.style.position = "fixed";
      panel.style.right = "auto";
      panel.style.left = `${rect.left}px`;
      panel.style.width = `${rect.width}px`;
      panel.style.maxHeight = "none";

      // Fixed panels can't be page-scrolled, so flip above or cap the height and scroll inside it
      const vh = window.innerHeight;
      const below = vh - rect.bottom - gap - margin;
      const above = rect.top - gap - margin;
      const needed = panel.offsetHeight;
      const flip = needed > below && above > below;
      const room = flip ? above : below;

      panel.style.maxHeight = `${Math.max(room, 120)}px`;
      panel.style.overflowY = "auto";
      panel.style.overscrollBehavior = "contain";
      if (flip) {
        panel.style.top = "auto";
        panel.style.bottom = `${vh - rect.top + gap}px`;
      } else {
        panel.style.bottom = "auto";
        panel.style.top = `${rect.bottom + gap}px`;
      }
    };

    const onScroll = (e) => {
      if (e.target !== panel) positionPanel();
    };

    const focusOption = (i) => {
      options.forEach((o) => o.classList.remove("is-focused"));
      if (options[i]) {
        options[i].classList.add("is-focused");
        activeIndex = i;
      }
    };

    const close = () => {
      panel.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      root.classList.remove("is-open");
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", positionPanel);
    };

    const open = () => {
      panel.hidden = false;
      positionPanel();
      trigger.setAttribute("aria-expanded", "true");
      root.classList.add("is-open");
      root.classList.remove("is-invalid");
      const selectedIndex = options.findIndex(
        (o) => o.getAttribute("aria-selected") === "true",
      );
      focusOption(selectedIndex >= 0 ? selectedIndex : 0);
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", positionPanel);
    };

    const selectOption = (option) => {
      options.forEach((o) => o.setAttribute("aria-selected", "false"));
      option.setAttribute("aria-selected", "true");
      valueEl.textContent = option.querySelector(
        ".glass-select__label",
      ).textContent;
      valueEl.classList.remove("is-placeholder");
      showNote(option.querySelector(".glass-select__hint").textContent.trim());
      hiddenInput.value = option.dataset.value;
      root.classList.remove("is-invalid");
      close();
      trigger.focus();
    };

    trigger.addEventListener("click", () => (panel.hidden ? open() : close()));

    options.forEach((option, i) => {
      option.addEventListener("click", () => selectOption(option));
      option.addEventListener("mouseenter", () => focusOption(i));
    });

    trigger.addEventListener("keydown", (e) => {
      if (["ArrowDown", "ArrowUp", "Enter", " ", "Escape"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowDown") {
        panel.hidden
          ? open()
          : focusOption(Math.min(activeIndex + 1, options.length - 1));
      } else if (e.key === "ArrowUp") {
        panel.hidden ? open() : focusOption(Math.max(activeIndex - 1, 0));
      } else if (e.key === "Enter" || e.key === " ") {
        panel.hidden ? open() : selectOption(options[activeIndex]);
      } else if (e.key === "Escape") {
        close();
      }
    });

    document.addEventListener("click", (e) => {
      if (!root.contains(e.target) && !panel.contains(e.target)) close();
    });
  });
}

function initNicheOther() {
  const radios = document.querySelectorAll('input[name="niche"]');
  const otherWrap = document.querySelector(".niche__other");
  const otherInput = document.getElementById("niche-other-input");
  if (!otherWrap || !otherInput) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Focusing while the wrapper is still collapsed (overflow: hidden, max-height: 0) makes the
  // browser scroll its clipped content, and the focus underline would animate while still clipped.
  // Waiting for the expand to finish makes it behave like every other field.
  const focusWhenExpanded = () => {
    if (reduceMotion.matches) {
      otherInput.focus();
      return;
    }
    const onEnd = (e) => {
      if (e.target !== otherWrap || e.propertyName !== "max-height") return;
      otherWrap.removeEventListener("transitionend", onEnd);
      if (otherInput.required) otherInput.focus();
    };
    otherWrap.addEventListener("transitionend", onEnd);
  };

  const sync = () => {
    const isOther = document.querySelector(
      'input[name="niche"][value="other"]',
    )?.checked;
    otherInput.required = !!isOther;
    otherWrap.classList.toggle("is-visible", !!isOther); // fallback for browsers without :has()
    if (isOther) {
      focusWhenExpanded();
    } else {
      otherInput.value = "";
    }
  };

  radios.forEach((radio) => radio.addEventListener("change", sync));
}

let sentModalLastFocus = null;

function openSentModal(name) {
  const modal = document.getElementById("sent-modal");
  if (!modal) return;

  modal.querySelector("#sent-title").textContent = name
    ? `Thank you, ${name}.`
    : "Thank you.";
  sentModalLastFocus = document.activeElement;
  modal.hidden = false;
  requestAnimationFrame(() => {
    modal.classList.add("is-open");
    modal.querySelector(".sent-modal__close").focus({ preventScroll: true });
  });
}

function closeSentModal() {
  const modal = document.getElementById("sent-modal");
  if (!modal || modal.hidden) return;

  modal.classList.remove("is-open");
  setTimeout(() => {
    modal.hidden = true;
    sentModalLastFocus?.focus?.();
  }, 400);
}

function initSentModal() {
  const modal = document.getElementById("sent-modal");
  if (!modal) return;

  modal
    .querySelectorAll("[data-close]")
    .forEach((el) => el.addEventListener("click", closeSentModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSentModal();
  });
}

function initSubmitGuard() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = form.querySelector(".contact__submit");
  const submitText = submitBtn.querySelector(".pill-text-submit");
  const status = form.querySelector(".contact__status");
  const defaultLabel = submitText.textContent;

  const showStatus = (msg, isError = false) => {
    status.textContent = msg;
    status.classList.toggle("is-error", isError);
    status.classList.add("is-visible");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Budget validation (custom select has no native validation)
    let valid = true;
    document.querySelectorAll("[data-glass-select]").forEach((root) => {
      const hidden = root.querySelector('input[type="hidden"]');
      if (hidden.hasAttribute("required") && !hidden.value) {
        valid = false;
        root.classList.add("is-invalid");
        root.querySelector(".glass-select__trigger").focus();
      }
    });
    if (!valid) return;

    // Honeypot tripped: pretend success, send nothing
    if (form.botcheck.checked) {
      showStatus("Thank you — we'll be in touch soon.");
      return;
    }

    submitBtn.disabled = true;
    submitText.textContent = "Sending…";
    status.classList.remove("is-visible");

    try {
      const data = Object.fromEntries(new FormData(form));
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        const firstName = (data.name || "").trim().split(/\s+/)[0];

        form.reset();
        resetGlassSelects();
        document.querySelector(".niche__other")?.classList.remove("is-visible");

        openSentModal(firstName);
      } else {
        throw new Error(json.message || "Submission failed");
      }
    } catch (err) {
      submitText.textContent = defaultLabel;
      showStatus(
        "Something went wrong. Please email agency@dyodigitals.com directly.",
        true,
      );
    } finally {
      submitBtn.disabled = false;
      setTimeout(() => (submitText.textContent = defaultLabel), 4000);
    }
  });
}

function resetGlassSelects() {
  document.querySelectorAll("[data-glass-select]").forEach((root) => {
    const valueEl = root.querySelector(".glass-select__value");
    valueEl.textContent = "Select an investment tier";
    valueEl.classList.add("is-placeholder");
    root
      .querySelectorAll(".glass-select__option")
      .forEach((o) => o.setAttribute("aria-selected", "false"));
    root.querySelector('input[type="hidden"]').value = "";
    root.querySelector(".glass-select__note")?.classList.remove("is-visible");
  });
}
