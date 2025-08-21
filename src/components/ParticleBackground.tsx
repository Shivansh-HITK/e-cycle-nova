import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    particlesJS: any;
  }
}

const ParticleBackground = () => {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.async = true;
    
    script.onload = () => {
      if (window.particlesJS && particlesRef.current) {
        window.particlesJS('particles-js', {
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: ['#00D4FF', '#4ADE80', '#A855F7']
            },
            shape: {
              type: ['circle', 'triangle'],
              stroke: {
                width: 0,
                color: '#000000'
              }
            },
            opacity: {
              value: 0.5,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
              }
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#00D4FF',
              opacity: 0.2,
              width: 1
            },
            move: {
              enable: true,
              speed: 2,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
              }
            }
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: true,
                mode: 'repulse'
              },
              onclick: {
                enable: true,
                mode: 'push'
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 140,
                line_linked: {
                  opacity: 1
                }
              },
              bubble: {
                distance: 200,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
              },
              repulse: {
                distance: 100,
                duration: 0.4
              },
              push: {
                particles_nb: 4
              },
              remove: {
                particles_nb: 2
              }
            }
          },
          retina_detect: true
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      id="particles-js"
      ref={particlesRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};

export default ParticleBackground;