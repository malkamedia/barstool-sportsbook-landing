import { padStart, throttle } from 'lodash';
gsap.registerPlugin(ScrollToPlugin);

const controller = new ScrollMagic.Controller();

export default class BarstoolScene {
    constructor(el) {
        const sections = [...el.querySelectorAll('.section')];
        const hashes = sections.map(section => (section.id));
        const pagination = el.querySelector('.custom-pagination');
        const controls = [...document.querySelectorAll('.custom-button-prev, .custom-button-next')];
        const buttons = [...document.querySelectorAll('.button__control')];
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
                    if(dir === -1) {
                        const y = hashes.indexOf(hash) * window.innerHeight;
                        gsap.to(window, { duration, ease, scrollTo: {y} });
    
                    } else {
                        gsap.to(window, {duration, ease, scrollTo: `#${hash}`});
                    }
                }

            })
        });

        const clearAllButtons = () => {
            buttons.forEach(button => {
                if (button.classList.contains('active')) button.classList.remove('active');
            })
        }

        buttons.forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();
                const hash = e.currentTarget.href.split(`${location.origin}/#`).pop();
                const y = hashes.indexOf(hash) * window.innerHeight;
                gsap.to(window, { duration, ease, scrollTo: { y } });
            })
        });

        let buttonPositions = [];


        const onResize = () => {
            buttonPositions = buttons.map(el => (el.offsetLeft));
        }

        const onEnter = section => {
            el.dataset.activeView = section.id;
        }

        const onPin = section => {
            location.hash = section.id;
            onHashChange();
            const index = sections.indexOf(section);
            pagination.innerText = `${padStart(index + 1, 2, '0')} / ${padStart(sections.length, 2, '0')}`;
        }

        const onLeave = section => {
            const index = sections.indexOf(section);
            el.dataset.activeView = sections[index - 1].id;
            location.hash = sections[index - 1].id
            onHashChange();
            pagination.innerText = `${padStart(index, 2, '0')} / ${padStart(sections.length, 2, '0')}`;
        }

        const onHashChange = e => {
            console.log(location.hash);
            clearAllButtons();
            const button = buttons.find(button => {
                return (button.href.split(`${location.origin}/`).pop() === location.hash);
            })
            button.classList.add('active');
            const index = [...button.parentElement.children].indexOf(button);
            gsap.to(button.parentElement, {duration: 0.4, force3D: true, ease: Power4.easeOut, x:-buttonPositions[index] + 72})
            // console.log(index)

        }

        window.addEventListener('resize', throttle(onResize, 50));
        window.addEventListener('hashchange', onHashChange, false);
        onResize();
        onHashChange();

        // const hashes = sections.map(section => (section.id));
        sections.forEach((section, index) => {
            // if(index !== 0) {

                new ScrollMagic.Scene({
                    triggerElement: section,
                    triggerHook: 'onEnter',
                }).on('enter', e => {
                    onEnter(section);
                }).addTo(controller);

                new ScrollMagic.Scene({
                    triggerElement: section,
                    triggerHook: 'onLeave',
                })
                    .setPin(section) // pins the element for the the scene's duration
                    .on('enter', e => { onPin(section) })
                    .on('leave', e => {                         
                        if (e.scrollDirection === 'REVERSE') {
                            onLeave(section);
                        }
                    })
                    .addTo(controller); // assign the scene to the controller
            // }

        });
    }
}