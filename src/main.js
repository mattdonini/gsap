import './styles/style.css';
import { gsap } from "gsap";

document.addEventListener('DOMContentLoaded', () => {
  const threadsDuration = 0.2;
  const garmentsDuration = 0.4;

  const titles = document.querySelectorAll('.threads_title-item');
  const triggers = document.querySelectorAll('.threads_trigger-item');

  titles.forEach(item => {
    const titleWrap = item.querySelector('.title_wrap');
    gsap.set(titleWrap, { opacity: 0, y: '-100%', visibility: 'hidden' });
  });

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
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
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

  const scrambleText = (el, newText) => {
    const fx = new TextScramble(el);
    return fx.setText(newText).then(() => {
      el.innerText = newText; // Ensure the final text is set
      gsap.set(el, { opacity: 1, visibility: 'visible' }); // Make sure the element stays visible
    });
  };

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

        const hidePromises = Array.from(titles).map(item => {
          const titleWrap = item.querySelector('.title_wrap');
          if (titleWrap.style.visibility === 'visible') {
            return gsap.to(titleWrap, { opacity: 0, y: '100%', duration: threadsDuration, visibility: 'hidden' }).then();
          }
        });

        Promise.all(hidePromises).then(() => {
          gsap.set(target, { opacity: 1, y: '0%', visibility: 'visible' });
          scrambleText(target, newText);
        });
      } else {
        console.error(`No matching target found with data-threads-id="${id}"`);
      }
    });
  });

  const garmentItems = document.querySelectorAll('.garment_item');
  const headings = document.querySelectorAll('.h-h6.is-info');
  const paragraphs = document.querySelectorAll('.paragraph.is-info');

  headings.forEach(heading => {
    gsap.set(heading, { opacity: 0, visibility: 'hidden', y: '-100%' });
  });

  paragraphs.forEach(paragraph => {
    gsap.set(paragraph, { opacity: 0, visibility: 'hidden', y: '-100%' });
  });

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

        const hideHeadingsPromises = Array.from(headings).map(heading => {
          if (heading.style.visibility === 'visible') {
            return gsap.to(heading, { opacity: 0, y: '100%', duration: garmentsDuration, visibility: 'hidden' }).then();
          }
        });

        const hideParagraphsPromises = Array.from(paragraphs).map(paragraph => {
          if (paragraph.style.visibility === 'visible') {
            return gsap.to(paragraph, { opacity: 0, y: '100%', duration: garmentsDuration, visibility: 'hidden' }).then();
          }
        });

        Promise.all([...hideHeadingsPromises, ...hideParagraphsPromises]).then(() => {
          gsap.set(targetHeading, { opacity: 1, y: '0%', visibility: 'visible' });
          gsap.set(targetParagraph, { opacity: 1, y: '0%', visibility: 'visible' });

          scrambleText(targetHeading, headingText);
          scrambleText(targetParagraph, paragraphText);
        });
      } else {
        console.error(`No matching elements found with data-garment-id="${garmentId}"`);
      }
    });
  });
});
