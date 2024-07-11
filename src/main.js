import './styles/style.css';
import { gsap } from "gsap";

document.addEventListener('DOMContentLoaded', () => {
  // Easing function (easeOutExpo)
  const easeOutExpo = (t) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  // TextScramble class with easing and duration
  class TextScramble {
    constructor(el, duration = 60) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
      this.duration = duration; // Duration in frames
    }

    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => (this.resolve = resolve));
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 10);
        const end = start + this.duration;
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }

    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        const progress = Math.min(Math.max((this.frame - start) / (end - start), 0), 1);
        const easedProgress = easeOutExpo(progress);

        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          if (easedProgress < 1) {
            output += `<span>${char}</span>`;
          } else {
            output += to;
          }
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }

    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  // Script for threads_title-item and threads_trigger-item
  const titles = document.querySelectorAll('.threads_title-item');
  const triggers = document.querySelectorAll('.threads_trigger-item');

  // Hide all h3 and is-eyebrow elements initially
  titles.forEach(item => {
    const eyebrow = item.querySelector('.is-eyebrow');
    const h3 = item.querySelector('.h-h3');
    gsap.set(eyebrow, { opacity: 0, y: '-100%', visibility: 'hidden' });
    gsap.set(h3, { opacity: 0, y: '-100%', visibility: 'hidden' });
  });

  let isAnimating = false; // To track animation state
  let currentTimeline = null; // To track the current timeline
  let visibleElements = { eyebrow: null, h3: null }; // To track the currently visible elements

  const slideIn = (eyebrow, h3) => {
    return gsap.timeline()
      .fromTo(eyebrow, 
        { opacity: 0, y: '-100%', visibility: 'visible' }, 
        { opacity: 1, y: '0%', duration: 0.30, ease: 'power2.out' }, 0)
      .fromTo(h3, 
        { opacity: 0, y: '-100%', visibility: 'visible' }, 
        { opacity: 1, y: '0%', duration: 0.30, ease: 'power2.out' }, 0);
  };

  const slideOut = (eyebrow, h3) => {
    return gsap.timeline()
      .to(eyebrow,
        { opacity: 0, y: '100%', duration: 0.30, ease: 'power2.in', onComplete: () => {
          eyebrow.style.visibility = 'hidden';
        }}, 0)
      .to(h3,
        { opacity: 0, y: '100%', duration: 0.30, ease: 'power2.in', onComplete: () => {
          h3.style.visibility = 'hidden';
        }}, 0);
  };

  // Select the first trigger's corresponding content by default
  if (triggers.length > 0) {
    const firstTriggerId = triggers[0].getAttribute('data-threads-id');
    const defaultEyebrow = document.querySelector(`.threads_title-item[data-threads-id="${firstTriggerId}"] .is-eyebrow`);
    const defaultH3 = document.querySelector(`.threads_title-item[data-threads-id="${firstTriggerId}"] .h-h3`);
    console.log("Default Target:", defaultEyebrow, defaultH3);  // Debug output
    if (defaultEyebrow && defaultH3) {
      gsap.set(defaultEyebrow, { opacity: 1, y: '0%', visibility: 'visible' });
      gsap.set(defaultH3, { opacity: 1, y: '0%', visibility: 'visible' });
      visibleElements = { eyebrow: defaultEyebrow, h3: defaultH3 };
    } else {
      console.error(`No matching target found with data-threads-id="${firstTriggerId}"`);
    }
  }

  // Function to fade in a target element
  const fadeIn = (target) => {
    return gsap.fromTo(target, 
      { opacity: 0, visibility: 'visible' }, 
      { opacity: 1, duration: 0.5, ease: 'power2.out' });
  };

  // Function to fade out a target element
  const fadeOut = (target) => {
    return gsap.to(target, 
      { opacity: 0, duration: 0.5, ease: 'power2.in', onComplete: () => {
        target.style.visibility = 'hidden';
      }});
  };

  // Select all touchpoint_wrap elements
  const touchpoints = document.querySelectorAll('.touchpoint_wrap.is-holographic, .touchpoint_wrap.is-prism, .touchpoint_wrap.is-metallic');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      if (isAnimating) {
        if (currentTimeline) {
          currentTimeline.kill(); // Kill the current timeline if it exists and is playing
        }
        if (visibleElements.eyebrow && visibleElements.h3) {
          // Immediately hide the currently visible elements
          gsap.set(visibleElements.eyebrow, { opacity: 0, y: '100%', visibility: 'hidden' });
          gsap.set(visibleElements.h3, { opacity: 0, y: '100%', visibility: 'hidden' });
        }
      }

      isAnimating = true;

      const id = trigger.getAttribute('data-threads-id');
      const targetEyebrow = document.querySelector(`.threads_title-item[data-threads-id="${id}"] .is-eyebrow`);
      const targetH3 = document.querySelector(`.threads_title-item[data-threads-id="${id}"] .h-h3`);
      const targetTouchpoint = document.querySelector(`.touchpoint_wrap[data-threads-id="${id}"]`);

      if (targetEyebrow && targetH3 && targetTouchpoint) {
        // Create a timeline to sequence the slide out and slide in animations
        currentTimeline = gsap.timeline({
          onComplete: () => {
            isAnimating = false; // Reset animation state after completion
            visibleElements = { eyebrow: targetEyebrow, h3: targetH3 };
          }
        });

        // Slide out currently visible elements
        if (visibleElements.eyebrow && visibleElements.h3) {
          currentTimeline.add(slideOut(visibleElements.eyebrow, visibleElements.h3), 0);
        }

        // Slide in the new target elements after the slide out is complete
        currentTimeline.add(() => slideIn(targetEyebrow, targetH3), '+=0.1'); // Add slight delay to ensure slideOut completes

        // Fade out all touchpoints
        touchpoints.forEach(touchpoint => {
          if (touchpoint.style.visibility === 'visible') {
            fadeOut(touchpoint);
          }
        });

        // Fade in the target touchpoint
        fadeIn(targetTouchpoint);
      } else {
        console.error(`No matching target found with data-threads-id="${id}"`);
        isAnimating = false; // Reset animation state if no matching target found
      }
    });
  });

  // Script for h-h6.is-info and paragraph.is-info
  const garmentItems = document.querySelectorAll('.garment_item');
  const headings = document.querySelectorAll('.h-h6.is-info');
  const paragraphs = document.querySelectorAll('.paragraph.is-info');

  headings.forEach((heading) => {
    heading.style.visibility = 'hidden';
  });

  paragraphs.forEach((paragraph) => {
    paragraph.style.visibility = 'hidden';
  });

  const scrambleIn = (target, duration) => {
    const textScramble = new TextScramble(target, duration);
    return textScramble.setText(target.dataset.text);
  };

  const scrambleOut = (target) => {
    target.style.visibility = 'hidden';
  };

  if (garmentItems.length > 0) {
    const firstGarmentId = garmentItems[0].getAttribute('data-garment-id');
    const defaultHeading = document.querySelector(
      `.h-h6.is-info[data-garment-id="${firstGarmentId}"]`
    );
    const defaultParagraph = document.querySelector(
      `.paragraph.is-info[data-garment-id="${firstGarmentId}"]`
    );
    if (defaultHeading && defaultParagraph) {
      defaultHeading.style.visibility = 'visible';
      defaultHeading.dataset.text = defaultHeading.innerText;
      defaultParagraph.style.visibility = 'visible';
      defaultParagraph.dataset.text = defaultParagraph.innerText;
      scrambleIn(defaultHeading, 24); // Set duration for garments here
      scrambleIn(defaultParagraph, 24); // Set duration for garments here
    }
  }

  garmentItems.forEach((item) => {
    item.addEventListener('click', () => {
      const garmentId = item.getAttribute('data-garment-id');
      const targetHeading = document.querySelector(
        `.h-h6.is-info[data-garment-id="${garmentId}"]`
      );
      const targetParagraph = document.querySelector(
        `.paragraph.is-info[data-garment-id="${garmentId}"]`
      );

      if (targetHeading && targetParagraph) {
        headings.forEach((heading) => {
          if (heading.style.visibility === 'visible') {
            scrambleOut(heading);
          }
        });

        paragraphs.forEach((paragraph) => {
          if (paragraph.style.visibility === 'visible') {
            scrambleOut(paragraph);
          }
        });

        targetHeading.style.visibility = 'visible';
        targetHeading.dataset.text = targetHeading.innerText;
        targetParagraph.style.visibility = 'visible';
        targetParagraph.dataset.text = targetParagraph.innerText;
        scrambleIn(targetHeading, 24); // Set duration for garments here
        scrambleIn(targetParagraph, 24); // Set duration for garments here
      } else {
        console.error(
          `No matching heading or paragraph found with data-garment-id="${garmentId}"`
        );
      }
    });
  });
});