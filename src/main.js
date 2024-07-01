import './styles/style.css';
import { gsap } from "gsap";

document.addEventListener('DOMContentLoaded', () => {
  // Configurable variables for animation timing
  const threadsDuration = 0.2; // Duration of the hide and show animations for threads
  const garmentsDuration = 0.5; // Duration of the hide and show animations for garments
  const garmentsOverlap = 0.1; // Overlap time for synchronization for garments

  // Script for threads_title-item and threads_trigger-item
  const titles = document.querySelectorAll('.threads_title-item');
  const triggers = document.querySelectorAll('.threads_trigger-item');

  // Hide all title_wrap elements initially and set them above the viewport
  titles.forEach(item => {
    const titleWrap = item.querySelector('.title_wrap');
    gsap.set(titleWrap, { opacity: 0, y: '-100%', visibility: 'hidden' });
  });

  const slideIn = (target) => {
    gsap.killTweensOf(target);
    gsap.fromTo(target, 
      { opacity: 0, y: '-30%', visibility: 'visible' }, 
      { opacity: 1, y: '0%', duration: threadsDuration, ease: 'power2.out' });
  };

  const slideOut = (target) => {
    gsap.killTweensOf(target);
    return gsap.to(target,
      { opacity: 0, y: '30%', duration: threadsDuration, ease: 'power2.in', onComplete: () => {
        target.style.visibility = 'hidden';
      }});
  };

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
        // Create a timeline to sequence the slide out and slide in animations
        const tl = gsap.timeline();

        // Slide out currently visible elements
        titles.forEach(item => {
          const titleWrap = item.querySelector('.title_wrap');
          if (titleWrap.style.visibility === 'visible') {
            tl.add(slideOut(titleWrap));
          }
        });

        // Slide in the new target element after the slide out is complete
        tl.add(() => slideIn(target));
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
    gsap.set(heading, { opacity: 0, visibility: 'hidden', x: '-100%' });
  });

  paragraphs.forEach(paragraph => {
    gsap.set(paragraph, { opacity: 0, visibility: 'hidden', x: '-100%' });
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
      gsap.set(defaultHeading, { opacity: 1, visibility: 'visible', x: '0%' });
      gsap.set(defaultParagraph, { opacity: 1, visibility: 'visible', x: '0%' });
    }
  }

  const showContent = (target) => {
    gsap.killTweensOf(target);
    gsap.fromTo(target, 
      { opacity: 0, x: '100%', visibility: 'visible' }, 
      { opacity: 1, x: '0%', duration: garmentsDuration, ease: 'power2.out' });
  };

  const hideContent = (target) => {
    gsap.killTweensOf(target);
    return gsap.to(target, 
      { opacity: 0, x: '-100%', duration: garmentsDuration, ease: 'power2.in', onComplete: () => {
        target.style.visibility = 'hidden';
      }});
  };

  garmentItems.forEach(item => {
    item.addEventListener('click', () => {
      const garmentId = item.getAttribute('data-garment-id');
      console.log(`Clicked Garment Item with ID: ${garmentId}`);

      // Create a timeline to sequence the hide and show animations
      const tl = gsap.timeline();

      // Hide all headings and paragraphs
      headings.forEach(heading => {
        if (heading.style.visibility === 'visible') {
          tl.add(hideContent(heading), 0);  // Ensure they hide at the same time
        }
      });

      paragraphs.forEach(paragraph => {
        if (paragraph.style.visibility === 'visible') {
          tl.add(hideContent(paragraph), 0);  // Ensure they hide at the same time
        }
      });

      // Show the corresponding heading and paragraph
      const targetHeading = document.querySelector(`.h-h6.is-info[data-garment-id="${garmentId}"]`);
      const targetParagraph = document.querySelector(`.paragraph.is-info[data-garment-id="${garmentId}"]`);

      if (targetHeading) {
        tl.add(() => showContent(targetHeading), `-=${garmentsOverlap}`);  // Start showing with overlap
      } else {
        console.error(`No matching heading found with data-garment-id="${garmentId}"`);
      }

      if (targetParagraph) {
        tl.add(() => showContent(targetParagraph), `-=${garmentsOverlap}`);  // Start showing with overlap
      } else {
        console.error(`No matching paragraph found with data-garment-id="${garmentId}"`);
      }
    });
  });
});
