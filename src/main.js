import './styles/style.css';
import { gsap } from "gsap";
import Splitting from "splitting";

// Initialize Splitting.js
Splitting();

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

  // Select the first trigger's corresponding content by default
  if (triggers.length > 0) {
    const firstTriggerId = triggers[0].getAttribute('data-threads-id');
    const defaultTarget = document.querySelector(`.threads_title-item[data-threads-id="${firstTriggerId}"] .title_wrap`);
    console.log("Default Target:", defaultTarget);  // Debug output
    if (defaultTarget) {
      gsap.set(defaultTarget, { opacity: 1, y: '0%', visibility: 'visible' });
    } else {
      console.error(`No matching target found with data-threads-id="${firstTriggerId}"`);
    }
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const id = trigger.getAttribute('data-threads-id');
      const target = document.querySelector(`.threads_title-item[data-threads-id="${id}"] .title_wrap`);

      if (target) {
        // Hide currently visible elements
        titles.forEach(item => {
          const titleWrap = item.querySelector('.title_wrap');
          if (titleWrap.style.visibility === 'visible') {
            gsap.set(titleWrap, { opacity: 0, y: '-100%', visibility: 'hidden' });
          }
        });

        // Show the new target element
        gsap.set(target, { opacity: 1, y: '0%', visibility: 'visible' });
      } else {
        console.error(`No matching target found with data-threads-id="${id}"`);
      }
    });
  });

  // Script for h-h6.is-info and paragraph.is-info
  const garmentItems = document.querySelectorAll('.garment_item');
  const headings = document.querySelectorAll('.h-h6.is-info');
  const paragraphs = document.querySelectorAll('.paragraph.is-info');

  console.log('garmentItems:', garmentItems);
  console.log('headings:', headings);
  console.log('paragraphs:', paragraphs);

  // Hide all headings and paragraphs initially
  headings.forEach(heading => {
    gsap.set(heading, { opacity: 0, visibility: 'hidden', y: '-100%' });
  });

  paragraphs.forEach(paragraph => {
    gsap.set(paragraph, { opacity: 0, visibility: 'hidden', y: '-100%' });
    Splitting({ target: paragraph, by: 'lines' });
  });

  // Show the first heading and paragraph by default
  if (garmentItems.length > 0) {
    const firstGarmentId = garmentItems[0].getAttribute('data-garment-id');
    const defaultHeading = document.querySelector(`.h-h6.is-info[data-garment-id="${firstGarmentId}"]`);
    const defaultParagraph = document.querySelector(`.paragraph.is-info[data-garment-id="${firstGarmentId}"]`);
    console.log("Default Garment ID:", firstGarmentId);  // Debug output
    console.log("Default Heading:", defaultHeading);    // Debug output
    console.log("Default Paragraph:", defaultParagraph);  // Debug output
    if (defaultHeading && defaultParagraph) {
      gsap.set(defaultHeading, { opacity: 1, visibility: 'visible', y: '0%' });
      gsap.set(defaultParagraph, { opacity: 1, visibility: 'visible', y: '0%' });
    }
  }

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

  const showScrambleContent = (target, newText) => {
    const textScramble = new TextScramble(target);
    textScramble.setText(newText);
  };

  garmentItems.forEach(item => {
    item.addEventListener('click', () => {
      const garmentId = item.getAttribute('data-garment-id');
      console.log(`Clicked Garment Item with ID: ${garmentId}`);

      // Hide all headings and paragraphs
      headings.forEach(heading => {
        if (heading.style.visibility === 'visible') {
          heading.style.visibility = 'hidden';
          heading.innerText = ''; // Clear the text to avoid displaying it before scramble effect
        }
      });

      paragraphs.forEach(paragraph => {
        if (paragraph.style.visibility === 'visible') {
          paragraph.style.visibility = 'hidden';
          paragraph.innerText = ''; // Clear the text to avoid displaying it before scramble effect
        }
      });

      // Show the corresponding heading and paragraph with scramble effect
      const targetHeading = document.querySelector(`.h-h6.is-info[data-garment-id="${garmentId}"]`);
      const targetParagraph = document.querySelector(`.paragraph.is-info[data-garment-id="${garmentId}"]`);

      if (targetHeading) {
        targetHeading.style.visibility = 'visible';
        showScrambleContent(targetHeading, targetHeading.getAttribute('data-original-text'));
      } else {
        console.error(`No matching heading found with data-garment-id="${garmentId}"`);
      }

      if (targetParagraph) {
        targetParagraph.style.visibility = 'visible';
        showScrambleContent(targetParagraph, targetParagraph.getAttribute('data-original-text'));
      } else {
        console.error(`No matching paragraph found with data-garment-id="${garmentId}"`);
      }
    });
  });

  // Store the original text in a data attribute for scrambling effect
  headings.forEach(heading => {
    heading.setAttribute('data-original-text', heading.innerText);
  });

  paragraphs.forEach(paragraph => {
    paragraph.setAttribute('data-original-text', paragraph.innerText);
  });
});
