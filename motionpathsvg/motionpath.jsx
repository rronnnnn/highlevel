console.clear();

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin);
gsap.defaults({ease: "none"});

function getPercentage(element) {
  console.log(element);
  console.log(DrawSVGPlugin.getPosition(element));
  console.log(DrawSVGPlugin.getLength(element));
    return Math.floor(DrawSVGPlugin.getPosition(element)[1] / (DrawSVGPlugin.getLength(element) / 100));
}

console.log(getPercentage('#track-svg'));
console.log(getPercentage('#main-path'));
console.log(getPercentage('#icon-1 circle'));


const pulses = gsap.timeline({
  defaults: {
    duration: 1, 
    autoAlpha: 1, 
    scale: 2, 
    transformOrigin: 'center', 
    ease: "elastic(2.5, 1)"
  }})
.to("#icon-1, #text-1", {id: 'test'}, 2) 
.to("#icon-2, #text-2", {}, 3.4) 
.to("#icon-3, #text-3", {}, 6.4)
.to('#circle9387, #text-4', {}, 9.8)

const action = gsap.timeline({defaults: {duration: 10},
  scrollTrigger: {
    trigger: "#main-path",
    scrub: 1.2,
    pin: 'svg',
    pinSpacing: false,
    start: "top center",
    end: "bottom+=6000px bottom",
    markers: true,
    // pin: true,
  }})

.to(".ball01", {duration: 0.01, autoAlpha: 1})
.from("#main-path", {stagger: 0.1, drawSVG: 0, id: 'drawLine'}, 0)
// .fromTo("#main-path", {drawSVG: 0}, {drawSVG: DrawSVGPlugin.getLength('#main-path')}, 0)
.to(".ball01", {motionPath: {
  path: "#main-path", 
  align:"#main-path",
  alignOrigin: [0.5, 0.5],
}}, 0)
.to('svg', {yPercent: -100, duration: 10, ease: 'none'}, 0)
.add(pulses, 0);


//GSDevTools.create();
