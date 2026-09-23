/**
 * "Choose your favorite coffee" slider.

 */
(function initSlider() {
  const section = document.querySelector('.favorites');

  if (!section) {
    return;
  }

  const viewport = section.querySelector('.slider__viewport');
  const track = section.querySelector('.slider__track');
  const slides = Array.from(section.querySelectorAll('.slider__slide'));
  const dots = Array.from(section.querySelectorAll('.slider__dot'));
  const prevButton = section.querySelector('.slider__arrow--prev');
  const nextButton = section.querySelector('.slider__arrow--next');

  const SWIPE_THRESHOLD = 50;
  const pauseReasons = new Set();

  let current = 0;
  let pointerStartX = null;
  let pointerStartY = null;

  function updatePause() {
    section.classList.toggle('favorites--paused', pauseReasons.size > 0);
  }

  function pause(reason) {
    pauseReasons.add(reason);
    updatePause();
  }

  function resume(reason) {
    pauseReasons.delete(reason);
    updatePause();
  }

  function goTo(index) {
    const count = slides.length;
    const next = (index + count) % count;

    if (next === current) {
      return;
    }

    current = next;
    track.style.transform = `translateX(-${current * 100}%)`;

    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', String(i !== current));
    });

    dots.forEach((dot, i) => {
      const isActive = i === current;

      dot.classList.toggle('slider__dot--active', isActive);

      if (isActive) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  }

  function showNext() {
    goTo(current + 1);
  }

  function showPrev() {
    goTo(current - 1);
  }

  prevButton.addEventListener('click', showPrev);
  nextButton.addEventListener('click', showNext);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goTo(index));

    // The progress bar of the active dot has finished filling up
    dot.addEventListener('animationend', () => {
      if (dot.classList.contains('slider__dot--active')) {
        showNext();
      }
    });
  });

  // Pause on mouse hover over the slide
  viewport.addEventListener('mouseenter', () => pause('hover'));
  viewport.addEventListener('mouseleave', () => resume('hover'));

  // Pause while keyboard focus is inside the slider (arrows, dots)
  section.addEventListener('focusin', (event) => {
    if (event.target.matches(':focus-visible')) {
      pause('focus');
    }
  });
  section.addEventListener('focusout', () => resume('focus'));

  // Touch: pause while holding the slide, switch on swipe
  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') {
      return;
    }

    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    pause('touch');
  });

  function finishPointer(event) {
    if (pointerStartX === null) {
      return;
    }

    const deltaX = event.clientX - pointerStartX;
    const deltaY = event.clientY - pointerStartY;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        showNext();
      } else {
        showPrev();
      }
    }

    pointerStartX = null;
    pointerStartY = null;
    resume('touch');
  }

  viewport.addEventListener('pointerup', finishPointer);
  viewport.addEventListener('pointercancel', () => {
    pointerStartX = null;
    pointerStartY = null;
    resume('touch');
  });

  // Keyboard arrows when a slider control is focused
  section.addEventListener('keydown', (event) => {
    if (!event.target.closest('.slider__arrow, .slider__dot')) {
      return;
    }

    if (event.key === 'ArrowRight') {
      showNext();
    } else if (event.key === 'ArrowLeft') {
      showPrev();
    }
  });
})();
