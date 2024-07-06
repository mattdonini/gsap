import './styles/style.css';
import { gsap } from "gsap";

document.addEventListener('DOMContentLoaded', () => {
  // TextScramble class
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

  // Script for threads_title-item and threads_trigger-item
  const titles = document.querySelectorAll('.threads_title-item');
  const triggers = document.querySelectorAll('.threads_trigger-item');

  // Hide all title_wrap elements initially
  titles.forEach(item => {
    const titleWrap = item.querySelector('.title_wrap');
    titleWrap.style.visibility = 'hidden';
  });

  // Scramble text effect
  const scrambleIn = (target) => {
    const textScramble = new TextScramble(target);
    return textScramble.setText(target.dataset.text);
  };

  const scrambleOut = (target) => {
    target.style.visibility = 'hidden';
  };

  // Apply scramble effect to elements with specified classes
  const applyScrambleEffect = (element) => {
    const eyebrow = element.querySelector('.is-eyebrow');
    const h3 = element.querySelector('.h-h3');

    if (eyebrow && h3) {
      eyebrow.style.visibility = 'visible';
      eyebrow.dataset.text = eyebrow.innerText;
      h3.style.visibility = 'visible';
      h3.dataset.text = h3.innerText;

      scrambleIn(eyebrow);
      scrambleIn(h3);
    }
  };

  // Select the first trigger's corresponding content by default
  if (triggers.length > 0) {
    const firstTriggerId = triggers[0].getAttribute('data-threads-id');
    const defaultTarget = document.querySelector(`.threads_title-item[data-threads-id="${firstTriggerId}"] .title_wrap`);
    console.log("Default Target:", defaultTarget);  // Debug output
    if (defaultTarget) {
      defaultTarget.style.visibility = 'visible';
      applyScrambleEffect(defaultTarget.parentNode);
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
            scrambleOut(eyebrow);
          }

          if (h3 && h3.style.visibility === 'visible') {
            scrambleOut(h3);
          }
        });

        // Scramble in the new target element
        target.style.visibility = 'visible';
        applyScrambleEffect(target.parentNode);
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

  const garmentScrambleIn = (target) => {
    const textScramble = new TextScramble(target);
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
      garmentScrambleIn(defaultHeading);
      garmentScrambleIn(defaultParagraph);
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
        garmentScrambleIn(targetHeading);
        garmentScrambleIn(targetParagraph);
      } else {
        console.error(
          `No matching heading or paragraph found with data-garment-id="${garmentId}"`
        );
      }
    });
  });
});
