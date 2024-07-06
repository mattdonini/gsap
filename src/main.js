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

  // Hide all title_wrap elements initially
  titles.forEach(item => {
    const titleWrap = item.querySelector('.title_wrap');
    titleWrap.style.visibility = 'hidden';
  });

  // Scramble text effect for threads title and number
  const scrambleInThreads = (target, duration) => {
    const textScramble = new TextScramble(target, duration);
    return textScramble.setText(target.dataset.text);
  };

  const scrambleOutThreads = (target) => {
    target.style.visibility = 'hidden';
  };

  // Apply scramble effect to elements with specified classes for threads
  const applyScrambleEffectThreads = (element, duration) => {
    const eyebrow = element.querySelector('.is-eyebrow');
    const h3 = element.querySelector('.h-h3');

    if (eyebrow && h3) {
      eyebrow.style.visibility = 'visible';
      eyebrow.dataset.text = eyebrow.innerText;
      h3.style.visibility = 'visible';
      h3.dataset.text = h3.innerText;

      scrambleInThreads(eyebrow, duration);
      scrambleInThreads(h3, duration);
    }
  };

  // Select the first trigger's corresponding content by default
  if (triggers.length > 0) {
    const firstTriggerId = triggers[0].getAttribute('data-threads-id');
    const defaultTarget = document.querySelector(`.threads_title-item[data-threads-id="${firstTriggerId}"] .title_wrap`);
    console.log("Default Target:", defaultTarget);  // Debug output
    if (defaultTarget) {
      defaultTarget.style.visibility = 'visible';
      applyScrambleEffectThreads(defaultTarget.parentNode, 30); // Set duration for threads here
    } else {
      console.error(`No matching target found with data-threads-id="${firstTriggerId}"`);
    }
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const id = trigger.getAttribute('data-threads-id');
      const target = document.querySelector(`.threads_title-item[data-threads-id="${id}"] .title_wrap`);

      if (target) {
        // Scramble out currently visible elements
        titles.forEach(item => {
          const titleWrap = item.querySelector('.title_wrap');
          const eyebrow = titleWrap.querySelector('.is-eyebrow');
          const h3 = titleWrap.querySelector('.h-h3');

          if (eyebrow && eyebrow.style.visibility === 'visible') {
            scrambleOutThreads(eyebrow);
          }

          if (h3 && h3.style.visibility === 'visible') {
            scrambleOutThreads(h3);
          }
        });

        // Scramble in the new target element
        target.style.visibility = 'visible';
        applyScrambleEffectThreads(target.parentNode, 30); // Set duration for threads here
      } else {
        console.error(`No matching target found with data-threads-id="${id}"`);
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

  const garmentScrambleIn = (target, duration) => {
    const textScramble = new TextScramble(target, duration);
    return textScramble.setText(target.dataset.text);
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
      garmentScrambleIn(defaultHeading, 60); // Set duration for garments here
      garmentScrambleIn(defaultParagraph, 60); // Set duration for garments here
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
            scrambleOutThreads(heading);
          }
        });

        paragraphs.forEach((paragraph) => {
          if (paragraph.style.visibility === 'visible') {
            scrambleOutThreads(paragraph);
          }
        });

        targetHeading.style.visibility = 'visible';
        targetHeading.dataset.text = targetHeading.innerText;
        targetParagraph.style.visibility = 'visible';
        targetParagraph.dataset.text = targetParagraph.innerText;
        garmentScrambleIn(targetHeading, 60); // Set duration for garments here
        garmentScrambleIn(targetParagraph, 60); // Set duration for garments here
      } else {
        console.error(
          `No matching heading or paragraph found with data-garment-id="${garmentId}"`
        );
      }
    });
  });
});
