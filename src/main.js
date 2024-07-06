import './styles/style.css';
import { gsap } from "gsap";

document.addEventListener('DOMContentLoaded', () => {
  // Configurable variables for animation timing
  const threadsDuration = 0.2; // Duration of the hide and show animations for threads
  const garmentsDuration = 0.4; // Duration of the hide and show animations for garments
  const garmentsOverlap = 0.1; // Overlap time for synchronization for garments

  // Script for threads_title-item and threads_trigger-item
  const titles = document.querySelectorAll('.threads_title-item');
  const triggers = document.querySelectorAll('.threads_trigger-item');

  // Hide all title_wrap elements initially and set them above the viewport
  titles.forEach(item => {
    const titleWrap = item.querySelector('.title_wrap');
    gsap.set(titleWrap, { opacity: 0, y: '-100%', visibility: 'hidden' });
  });

  // Initialize the text scramble class
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }

    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => (this.resolve = resolve));
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 20);
        const end = start + Math.floor(Math.random() * 20);
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
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span>${char}</span>`;
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

  // Function to handle the scrambling effect
  const scrambleText = (el, newText) => {
    const fx = new TextScramble(el);
    return fx.setText(newText);
  };

  // Select the first trigger's corresponding content by default
  if (triggers.length > 0) {
    const firstTriggerId = triggers[0].getAttribute('data-threads-id');
    const defaultTarget = document.querySelector(`.threads_title-item[data-threads-id="${firstTriggerId}"] .title_wrap`);
    if (defaultTarget) {
      gsap.set(defaultTarget, { opacity: 1, y: '0%', visibility: 'visible' });
    }
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const id = trigger.getAttribute('data-threads-id');
      const target = document.querySelector(`.threads_title-item[data-threads-id="${id}"] .title_wrap`);

      if (target) {
        const newText = target.innerText;

        // Hide all current visible elements
        titles.forEach(item => {
          const titleWrap = item.querySelector('.title_wrap');
          if (titleWrap.style.visibility === 'visible') {
            gsap.to(titleWrap, { opacity: 0, y: '100%', duration: threadsDuration, onComplete: () => {
              titleWrap.style.visibility = 'hidden';
              titleWrap.innerText = ''; // Clear old text
            }});
          }
        });

        // Ensure the new target is visible before starting the scramble effect
        gsap.set(target, { opacity: 1, y: '0%', visibility: 'visible' });

        // Show the new target element with scramble effect
        scrambleText(target, newText).then(() => {
          gsap.set(target, { opacity: 1, y: '0%', visibility: 'visible' });
        });
      } else {
        console.error(`No matching target found with data-threads-id="${id}"`);
      }
    });
  });

  // Script for h-h6.is-info and paragraph.is-info
  const garmentItems = document.querySelectorAll('.garment_item');
  const headings = document.querySelectorAll('.h-h6.is-info');
  const paragraphs = document.querySelectorAll('.paragraph.is-info');

  // Hide all headings and paragraphs initially
  headings.forEach(heading => {
    gsap.set(heading, { opacity: 0, visibility: 'hidden', y: '-100%' });
  });

  paragraphs.forEach(paragraph => {
    gsap.set(paragraph, { opacity: 0, visibility: 'hidden', y: '-100%' });
  });

  // Show the first heading and paragraph by default
  if (garmentItems.length > 0) {
    const firstGarmentId = garmentItems[0].getAttribute('data-garment-id');
    const defaultHeading = document.querySelector(`.h-h6.is-info[data-garment-id="${firstGarmentId}"]`);
    const defaultParagraph = document.querySelector(`.paragraph.is-info[data-garment-id="${firstGarmentId}"]`);
    if (defaultHeading && defaultParagraph) {
      gsap.set(defaultHeading, { opacity: 1, visibility: 'visible', y: '0%' });
      gsap.set(defaultParagraph, { opacity: 1, visibility: 'visible', y: '0%' });
    }
  }

  garmentItems.forEach(item => {
    item.addEventListener('click', () => {
      const garmentId = item.getAttribute('data-garment-id');
      const targetHeading = document.querySelector(`.h-h6.is-info[data-garment-id="${garmentId}"]`);
      const targetParagraph = document.querySelector(`.paragraph.is-info[data-garment-id="${garmentId}"]`);

      if (targetHeading && targetParagraph) {
        const headingText = targetHeading.innerText;
        const paragraphText = targetParagraph.innerText;

        // Hide all current visible headings and paragraphs
        headings.forEach(heading => {
          if (heading.style.visibility === 'visible') {
            gsap.to(heading, { opacity: 0, y: '100%', duration: garmentsDuration, onComplete: () => {
              heading.style.visibility = 'hidden';
              heading.innerText = ''; // Clear old text
            }});
          }
        });

        paragraphs.forEach(paragraph => {
          if (paragraph.style.visibility === 'visible') {
            gsap.to(paragraph, { opacity: 0, y: '100%', duration: garmentsDuration, onComplete: () => {
              paragraph.style.visibility = 'hidden';
              paragraph.innerText = ''; // Clear old text
            }});
          }
        });

        // Ensure the new targets are visible before starting the scramble effect
        gsap.set(targetHeading, { opacity: 1, y: '0%', visibility: 'visible' });
        gsap.set(targetParagraph, { opacity: 1, y: '0%', visibility: 'visible' });

        // Show the new target heading and paragraph with scramble effect
        scrambleText(targetHeading, headingText).then(() => {
          gsap.set(targetHeading, { opacity: 1, y: '0%', visibility: 'visible' });
        });
        scrambleText(targetParagraph, paragraphText).then(() => {
          gsap.set(targetParagraph, { opacity: 1, y: '0%', visibility: 'visible' });
        });
      } else {
        console.error(`No matching elements found with data-garment-id="${garmentId}"`);
      }
    });
  });
});
