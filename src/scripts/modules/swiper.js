import { padStart } from 'lodash';

class CoverEfect {
    constructor(){
        this.currentTransitionSpeed = 0;
    }
    getTransitionSpeed() {
        const transitionSpeed = this.currentTransitionSpeed;
        // don't forget to reset the variable for future calls
        this.currentTransitionSpeed = 0;
        return transitionSpeed;
    }

    /*
    A weird way to find this out but I've found no other.
    Checks if the progress on the active slide is 1 or -1 which happens when swiper navigates to next/previous slide on click and keybord navigation.
  If not then the slider is being dragged, so we get the right index by finding the startTranslate from touchEvents in array of transitions the swiper snaps to.
  The startTranslate doesn't exist on initial load so we use the initialSlide index instead.
    */
    getActiveIndexBeforeTransitionStart(swiper, slides) {
        const isDragging = !Math.abs(slides[swiper.activeIndex].progress === 1);
        if (isDragging) {
            return swiper.slidesGrid.indexOf(
                -swiper.touchEventsData.startTranslate || swiper.params.initialSlide
            );
        } else {
            return swiper.activeIndex;
        }
    }

    getDirection(animationProgress) {
        if (animationProgress === 0) {
            return "NONE";
        } else if (animationProgress > 0) {
            return "NEXT";
        } else {
            return "BACK";
        }
    }

    progress(swiper, progress) {
        /* 
        if you need to change something for each progress
        do it here (progress variable is always in range from 0 to 1) representing progress of the whole slider 
        */
    }

    /*
     this is a function for the setTransition swiper event. Can be used for setting the CSS transition duration on slides or wrapper. Sometimes called when the change is supposed to be animated, sometimes not called if the change should be immediate (e.g. dragging the slider)
    */
    setTransition = transitionSpeed => {
        this.currentTransitionSpeed = transitionSpeed;
        // console.log("transition", transitionSpeed);
    }

    setTranslate = swiper => {
        let {
            slides,
            wrapperEl
        } = swiper;

        

        TweenMax.set(wrapperEl, { x: 0, y: 0 });
        slides = [...slides];
        slides.forEach(slide => {
            console.log(slide.progress);
            const y = Math.max(1 - Math.abs(slide.progress), 0) * window.innerHeight;
            TweenMax.to(slide, 1, { x: 0, y, force3D:true});
        })
    }
}

const effect = new CoverEfect();

export default class SwiperModule {
    constructor(el) {
        
        let index = 0;
        const swiper = new Swiper(el, {
            // Optional parameters
            direction: 'vertical',
            loop: false,

            // If we need pagination
            pagination: {
                el: '.custom-pagination',
                type: 'fraction',
                formatFractionCurrent: number => {
                    return padStart(number, 2, '0');
                },
                formatFractionTotal: number => {
                    return padStart(number, 2, '0');
                }
            },

            // Navigation arrows
            navigation: {
                nextEl: '.custom-button-next',
                prevEl: '.custom-button-prev',
            },

            effect: 'cover',
            speed: 1000,
            watchSlidesProgress: true,
            // virtualTranslate: true,

            on: {
                progress: swiper => {
                    if (swiper.params.effect !== "cover") return;
                    // console.log(swiper.params.effect);
                    // const swiper = this;
                    // effect.progress(swiper, progress);
                },
                setTransition: swiper => {
                    if (swiper.params.effect !== "cover") return;
                    // console.log(swiper.params.effect);
                    // const swiper = this;
                    // if (swiper.params.effect !== "myCustomTransition") return;
                    console.log(swiper);
                    effect.setTransition(swiper.params.speed);
                },
                setTranslate: swiper => {
                    if (swiper.params.effect !== "cover") return;
                    // console.log(swiper.params.effect);
                    // const swiper = this;
                    // if (swiper.params.effect !== "myCustomTransition") return;
                    // console.log()
                    effect.setTranslate(swiper);
                },
                slideChange: swiper => {
                    const {
                        activeIndex,
                        el,
                        slides,
                    } = swiper;
                    
                    let className = slides[index].id;
                    if (el.classList.contains(className)) {
                        el.classList.remove(className);
                    }

                    className = slides[activeIndex].id;
                    el.classList.add(className);
                    index = activeIndex;
                }
            }
        })
    }
}