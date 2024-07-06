import './styles/style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Configurable variables for animation timing
  const threadsDuration = 0.2; // Duration of the hide and show animations for threads
  const garmentsDuration = 0.4; // Duration of the hide and show animations for garments
  const garmentsOverlap = 0.1; // Overlap time for synchronization for garments

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
  titles.forEach((item) => {
    const titleWrap = item.querySelector('.title_wrap');
    titleWrap.style.visibility = 'hidden';
  });

  const scrambleIn = (target) => {
    const textScramble = new TextScramble(target);
    return textScramble.setText(target.dataset.text);
  };

  const scrambleOut = (target) => {
    target.style.visibility = 'hidden';
  };

  // Select the first trigger's corresponding content by default
  if (triggers.length > 0) {
    const firstTriggerId = triggers[0].getAttribute('data-threads-id');
    const defaultTarget = document.querySelector(
      `.threads_title-item[data-threads-id="${firstTriggerId}"] .title_wrap`
    );
    if (defaultTarget) {
      defaultTarget.style.visibility = 'visible';
      defaultTarget.dataset.text = defaultTarget.innerText;
      scrambleIn(defaultTarget);
    } else {
      console.error(
        `No matching target found with data-threads-id="${firstTriggerId}"`
      );
    }
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const id = trigger.getAttribute('data-threads-id');
      const target = document.querySelector(
        `.threads_title-item[data-threads-id="${id}"] .title_wrap`
      );

      if (target) {
        const tl = gsap.timeline();

        titles.forEach((item) => {
          const titleWrap = item.querySelector('.title_wrap');
          if (titleWrap.style.visibility === 'visible') {
            scrambleOut(titleWrap);
          }
        });

        target.style.visibility = 'visible';
        target.dataset.text = target.innerText;
        tl.add(() => scrambleIn(target));
      } else {
        console.error(
          `No matching target found with data-threads-id="${id}"`
        );
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
      scrambleIn(defaultHeading);
      scrambleIn(defaultParagraph);
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
        const tl = gsap.timeline();

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
        tl.add(() => scrambleIn(targetHeading), `-=${garmentsOverlap}`);
        tl.add(() => scrambleIn(targetParagraph), `-=${garmentsOverlap}`);
      } else {
        console.error(
          `No matching heading or paragraph found with data-garment-id="${garmentId}"`
        );
      }
    });
  });
});
