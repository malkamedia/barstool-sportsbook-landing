import { extend, bindModuleMethods } from './utils';

const Cover = {
    setTranslate() {
        const swiper = this;
        const { slides } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
            const $slideEl = swiper.slides.eq(i);
            const offset = $slideEl[0].swiperSlideOffset;
            let tx = -offset;
            if (!swiper.params.virtualTranslate) tx -= swiper.translate;
            let ty = 0;
            if (!swiper.isHorizontal()) {
                ty = tx;
                tx = 0;
            }
            const slideOpacity = swiper.params.fadeEffect.crossFade
                ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
                : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
            $slideEl
                .css({
                    opacity: slideOpacity,
                })
                .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
    },
    setTransition(duration) {
        const swiper = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
            let eventTriggered = false;
            slides.transitionEnd(() => {
                if (eventTriggered) return;
                if (!swiper || swiper.destroyed) return;
                eventTriggered = true;
                swiper.animating = false;
                const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
                for (let i = 0; i < triggerEvents.length; i += 1) {
                    $wrapperEl.trigger(triggerEvents[i]);
                }
            });
        }
    },
};

export default {
    name: 'effect-cover',
    params: {
        coverEffect: {
            crossFade: false,
        },
    },
    create() {
        const swiper = this;
        bindModuleMethods(swiper, {
            coverEffect: {
                ...Cover,
            },
        });
    },
    on: {
        beforeInit(swiper) {
            console.log(swiper.params.effect);
            if (swiper.params.effect !== 'cover') return;
            swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
            const overwriteParams = {
                slidesPerView: 1,
                slidesPerColumn: 1,
                slidesPerGroup: 1,
                watchSlidesProgress: true,
                spaceBetween: 0,
                virtualTranslate: true,
            };
            extend(swiper.params, overwriteParams);
            extend(swiper.originalParams, overwriteParams);
        },
        setTranslate(swiper) {
            if (swiper.params.effect !== 'cover') return;
            swiper.fadeEffect.setTranslate();
        },
        setTransition(swiper, duration) {
            if (swiper.params.effect !== 'cover') return;
            swiper.fadeEffect.setTransition(duration);
        },
    },
};