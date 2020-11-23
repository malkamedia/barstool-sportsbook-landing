import { padStart } from 'lodash';
gsap.registerPlugin(ScrollToPlugin);

const controller = new ScrollMagic.Controller();

export default class BarstoolScene {
    constructor(el) {
        const sections = [...el.querySelectorAll('.section')];
        const hashes = sections.map(section => (section.id));
        const pagination = el.querySelector('.custom-pagination');
        const controls = [...document.querySelectorAll('.custom-button-prev, .custom-button-next')];
        const duration = 0.8;
        const ease = Power3.easeOut;

        window.addEventListener('hashchange', e => {
            e.stopImmediatePropagation();
            e.preventDefault();
        });

        controls.forEach((control, index) => {
            control.addEventListener('click', e => {
                const dir = index === 0 ? -1 : 1;
                const hashIndex = hashes.indexOf(location.hash.substr(1));
                const hash = hashes[hashIndex + dir];
                if(hash) {
                    // console.log(hash)
                    // location.hash = hash;
                    if(dir === -1) {
                        const y = hashes.indexOf(hash) * window.innerHeight;
                        gsap.to(window, { duration, ease, scrollTo: {y} });
    
                    } else {
                        gsap.to(window, {duration, ease, scrollTo: `#${hash}`});
                    }
                }

            })
        })

        // const hashes = sections.map(section => (section.id));
        sections.forEach((section, index) => {
            // if(index !== 0) {
                new ScrollMagic.Scene({
                    triggerElement: section,
                    triggerHook: 'onLeave',
                    // offset: -window.innerHeight/2,
                })
                    // .addIndicators({})
                    .setPin(section) // pins the element for the the scene's duration
                    .on('enter', e => {
                        location.hash = section.id;
                        const index = sections.indexOf(section) + 1;
                        pagination.innerText = `${padStart(index, 2, '0')} / ${padStart(sections.length, 2, '0')}`;
                    })
                    .on('leave', e => {
                        
                        if (e.scrollDirection === 'REVERSE') {
                            const index = sections.indexOf(section);
                            location.hash = sections[index - 1].id
                            pagination.innerText = `${padStart(index, 2, '0')} / ${padStart(sections.length, 2, '0')}`;
                        }

                        // location.hash = section;
                    })
                    .addTo(controller); // assign the scene to the controller
            // }

        });
    }
}