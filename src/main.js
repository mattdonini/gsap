import './styles/style.css';
import { gsap } from "gsap";

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  const titles = document.querySelectorAll('.threads_title-item');
  const triggers = document.querySelectorAll('.threads_trigger-item');

  console.log('titles:', titles);
  console.log('triggers:', triggers);

  // Hide all title_wrap elements initially and set them above the viewport
  titles.forEach(item => {
    const titleWrap = item.querySelector('.title_wrap');
    const title = titleWrap.querySelector('.title');
    const threadNumber = titleWrap.querySelector('.thread-number');

    if (!titleWrap) {
      console.error('No title_wrap found in item:', item);
    }
    if (!title) {
      console.error('No .title element found in titleWrap:', titleWrap);
    }
    if (!threadNumber) {
      console.error('No .thread-number element found in titleWrap:', titleWrap);
    }

    gsap.set(titleWrap, { opacity: 0, visibility: 'hidden' });
    gsap.set(title, { y: '-100%' });
    gsap.set(threadNumber, { y: '-50%' });
  });

  const slideIn = (target) => {
    const title = target.querySelector('.title');
    const threadNumber = target.querySelector('.thread-number');

    if (!title) {
      console.error('No .title element found in target:', target);
    }
    if (!threadNumber) {
      console.error('No .thread-number element found in target:', target);
    }

    gsap.killTweensOf(target);
    gsap.fromTo(target, 
      { opacity: 0, visibility: 'visible' }, 
      { opacity: 1, duration: 0.2, ease: 'power2.out' });

    gsap.fromTo(title, 
      { y: '-100%' }, 
      { y: '0%', duration: 0.3, ease: 'power2.out' });

    gsap.fromTo(threadNumber, 
      { y: '-50%' }, 
      { y: '0%', duration: 0.4, ease: 'power2.out' });
  };

  const slideOut = (target) => {
    const title = target.querySelector('.title');
    const threadNumber = target.querySelector('.thread-number');

    if (!title) {
      console.error('No .title element found in target:', target);
    }
    if (!threadNumber) {
      console.error('No .thread-number element found in target:', target);
    }

    gsap.killTweensOf(target);
    return gsap.to(target, 
      { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => {
        target.style.visibility = 'hidden';
      }});

    gsap.to(title, 
      { y: '100%', duration: 0.3, ease: 'power2.in' });

    gsap.to(threadNumber, 
      { y: '50%', duration: 0.4, ease: 'power2.in' });
  };

  // Select the first trigger's corresponding content by default
  if (triggers.length > 0) {
    const firstTriggerId = triggers[0].getAttribute('data-threads-id');
    console.log("First Trigger ID:", firstTriggerId);
    const defaultTarget = document.querySelector(`.threads_title-item[data-threads-id="${firstTriggerId}"] .title_wrap`);
    console.log("Default Target:", defaultTarget);  // Debug output
    if (defaultTarget) {
      gsap.set(defaultTarget, { opacity: 1, y: '0%', visibility: 'visible' });
      gsap.set(defaultTarget.querySelector('.title'), { y: '0%' });
      gsap.set(defaultTarget.querySelector('.thread-number'), { y: '0%' });
    } else {
      console.error(`No matching target found with data-threads-id="${firstTriggerId}"`);
    }
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const id = trigger.getAttribute('data-threads-id');
      console.log(`Clicked Trigger ID: ${id}`);
      const target = document.querySelector(`.threads_title-item[data-threads-id="${id}"] .title_wrap`);

      if (target) {
        console.log(`Animating target with id: ${id}`);
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
});
