/*
    This js file is for the animations of shapes on the home page using Anime JS engine
*/

// first Shape animation
let animation1TimeLine = anime.timeline({
    delay: 100,
    loop: true
  });
  animation1TimeLine.add({
    targets: '.place1',
    translateX: {
      value: 10,
      duration: 800
    },
    translateY: {
      value: 10,
      duration: 800
    },
    scale: {
      value: 1.1,
      duration: 1600,
      delay: 800,
      easing: 'easeInOutQuart'
    },
    delay: 250
  });
  animation1TimeLine.add({
    targets: '.place1',
    scale: {
      value: 1,
      duration: 1600,
      delay: 800,
      easing: 'easeInOutQuart'
    },
    translateX: {
      value: 0,
      duration: 800
    },
    translateY: {
      value: 0,
      duration: 800
    },
    delay: 250,
  });
// second shape animation

  animation1TimeLine.add({
    targets: '.place2',
    translateX: {
      value: -60,
      duration: 500,
    },
    translateY: {
      value: 10,
      duration: 800
    },
    scale: {
      value: 1.3,
      duration: 1600,
      delay: 800,
      easing: 'easeInOutQuart'
    },
    delay: 250
  });
  animation1TimeLine.add({
    targets: '.place1',
    scale: {
      value: 1,
      duration: 1600,
      delay: 800,
      easing: 'easeInOutQuart'
    },
    translateX: {
      value: 0,
      duration: 800
    },
    translateY: {
      value: 0,
      duration: 800
    },
    delay: 250,
  });
  animation1TimeLine.add({
    targets: '.place2',
    scale: {
      value: 0.5,
      duration: 1600,
      delay: 800,
      easing: 'easeInOutQuart'
    },
    translateX: {
      value: 0,
      duration: 800
    },
    translateY: {
      value: 0,
      duration: 800
    },
    delay: 250
  });
  animation1TimeLine.add({
    targets: '.place2',
    scale: {
      value: 1,
      duration: 1600,
      delay: 800,
      easing: 'easeInOutQuart'
    },
    translateX: {
      value: 0,
      duration: 800
    },
    translateY: {
      value: 0,
      duration: 800
    },
    delay: 250
  });

  // third shape

  let animation2TimeLine = anime.timeline({
    delay: 100,
    loop: true
  });

  animation2TimeLine.add({
    targets: '.place3',
    scale: {
      value: 0.6,
      duration: 1600,
      delay: 800,
      easing: 'easeInOutQuart'
    },
    translateX: {
      value: -50,
      duration: 800
    },
    translateY: {
      value: -30,
      duration: 800
    },
    delay: 250
  });

  animation2TimeLine.add({
    targets: '.place3',
    scale: {
      value: 1.1,
      duration: 500,
      easing: 'easeInOutQuart'
    },
    translateX: {
      value: -20,
      duration: 80
    },
    translateY: {
      value: 30,
      duration: 80
    },
    delay: 250
  });

  animation2TimeLine.add({
    targets: '.place4',
    scale: {
      value: 0.5,
      duration: 600,
      delay: 400,
      easing: 'easeInOutCubic'
    },
    translateX: {
      value: -30,
      duration: 800
    },
    translateY: {
      value: 30,
      duration: 800
    },
    delay: 250
  });

  animation2TimeLine.add({
    targets: '.place3',
    scale: {
      value: 1,
      duration: 1600,
      delay: 800,
      easing: 'easeInOutQuart'
    },
    translateX: {
      value: 0,
      duration: 800
    },
    translateY: {
      value: 0,
      duration: 800
    },
    delay: 250
  });

  animation2TimeLine.add({
    targets: '.place4',
    scale: {
      value: 1.3,
      duration: 1000,
      delay: 400,
      easing: 'easeInOutCubic'
    },
    translateX: {
      value: -30,
      duration: 800
    },
    translateY: {
      value: 30,
      duration: 800
    },
    delay: 250
  });

   animation2TimeLine.add({
    targets: '.place4',
    scale: {
      value: 1,
      duration: 1400,
      delay: 400,
      easing: 'easeInOutCubic'
    },
    translateX: {
      value: -30,
      duration: 800
    },
    translateY: {
      value: 30,
      duration: 800
    },
    delay: 250
  });

  animation2TimeLine.add({
    targets: '.place4',
    scale: {
      value: 1,
      duration: 1400,
      delay: 400,
      easing: 'easeInOutCubic'
    },
    translateX: {
      value: 0,
      duration: 800
    },
    translateY: {
      value: 0,
      duration: 800
    },
    delay: 250
  });


    let paused = false;

    function addEventMsg(text) {
      // create a message on the html
      let messageElement = document.getElementById('message-event');
        messageElement.innerHTML = text;
        messageElement.className = "message-event";
        messageElement.addEventListener('animationend', () => {
          messageElement.className = "";
          messageElement.innerHTML = "";
        });
    }

 
  let onFocus = false; // change true only if an input field or textarea field is focused to disable the animation events

  function isOnFocus() {
    // set the varible onFocus to true
    onFocus = true;
  }

  function isOutFocus() {
    // set the varible onFocus to false
    onFocus = false;
  }

  // pause replay and reverse animation
  document.body.onkeyup = (event) => {
    
    const path = window.location.pathname;
    if (path == "/"){
    if (event.keyCode == 32 && paused == false && !onFocus /* 32 space letter code */) {
        animation1TimeLine.pause(); // pause animation
        animation2TimeLine.pause();
        paused = true;
        addEventMsg(localStorage.getItem("pause"));
        return 0;
    } else if (event.keyCode == 82 && !onFocus /* 82 'r' letter code */) {
        animation1TimeLine.reverse();
        animation2TimeLine.reverse();
        addEventMsg(localStorage.getItem("reverse"));
        return 0;
    } else if (event.keyCode == 32 && paused == true && !onFocus) {
        animation1TimeLine.play(); // resume the animlanimation
        animation2TimeLine.play();
        paused = false;
        addEventMsg(localStorage.getItem("play"));
        return 0;
    }
  }
  };


  /*
      Animations for loading (spinner and dots animations)
  */

  
anime({
	targets: '.spinner-rotation',
	easing: 'easeOutQuart',
	auto: true,
	loop: true,
	rotate: '360deg',
	delay: 300,
	duration: 1000
});

let dotsElements = document.querySelectorAll('.dots-loading > div');


anime({
	targets: dotsElements,
	scale: 0,
	duration: 1000,
	easing: 'easeOutQuart',
	delay: anime.stagger(800, {}),
	loop: true,
	auto: true,
	background: {
		value: '#2ecc71',
		duration: 400
	},
	loopComplete: (anim) =>{
		anim.reverse();

	}
});
