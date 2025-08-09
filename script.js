

const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});


function firstPageAnim(){
  var tl = gsap.timeline();
  tl.from("#nav", {
    y: '-10',
    opacity: 0,
    duration: 1.5,
    ease: Expo.easeInOut
  })
    .to(".boundinglem", {
      y: 0,
      ease: Expo.easeInOut,
      duration: 2,
      stagger: .2,
      delay: -1
    })
    .from("#heroFooter", {
      y: -10,
      opacity: 0,
      ease: Expo.easeInOut,
      duration: 1.5,
      delay: -1
      
    })

}

var timeout;

function circleChaptaKaro() {
  // define default scale value
  var xscale = 1;
  var yscale = 1;

  var xprev = 0;
  var yprev = 0;

  window.addEventListener("mousemove", function(dets){
    this.clearTimeout(timeout)
    xscale = gsap.utils.clamp(.8,1.2, dets.clientX - xprev);
    yscale = gsap.utils.clamp(.8,1.2, dets.clientY - yprev);

    xprev = dets.clientX;
    yprev = dets.clientY;

    circleMouseFollower(xscale, yscale);
    timeout = setTimeout(function(){
         document.querySelector("#minicircle").style.transform= `translate(${dets.clientX}px, ${dets.clientY}px) scale(1,1)`;
  
    },100)
   
  });
}
circleChaptaKaro();

function circleMouseFollower(xscale, yscale) {
  window.addEventListener("mousemove", function (dets) {
    // console.log(dets.clientX, dets.clientY);
    
    document.querySelector("#minicircle").style.transform= `translate(${dets.clientX}px, ${dets.clientY}px) scale(${xscale}, ${yscale})`;
  });
}

circleChaptaKaro();
circleMouseFollower(1,1);
firstPageAnim();

document.querySelectorAll(".elem").forEach(function (elem) {
  
  elem.addEventListener("mousemove", function (details) {
    const img = elem.querySelector("img");
    gsap.to(img, {
      opacity: 1,
      x: details.clientX - elem.getBoundingClientRect().left,
      y: details.clientY - elem.getBoundingClientRect().top,
      ease: "power3.out",
      duration: 0.3
    });
  });

  elem.addEventListener("mouseleave", function () {
    gsap.to(elem.querySelector("img"), {
      opacity: 0,
      duration: 0.3
    });
  });

});