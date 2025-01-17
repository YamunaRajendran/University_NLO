// "use client";

// import { useEffect, useRef } from 'react';

// interface Particle {
//   x: number;
//   y: number;
//   radius: number;
//   vx: number;
//   vy: number;
//   opacity: number;
//   connections: number[];
// }

// const NetworkBackground = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const particles: Particle[] = [];
//     const particleCount = 40; 
//     const maxRadius = 2; 
//     const minRadius = 1;
//     const connectionDistance = 250; 
//     const maxConnections = 20; 

//     const resizeCanvas = () => {
//       if (!canvas) return;
//       const scale = window.devicePixelRatio || 1;
//       canvas.width = window.innerWidth * scale;
//       canvas.height = window.innerHeight * scale;
//       ctx.scale(scale, scale);
//       canvas.style.width = window.innerWidth + 'px';
//       canvas.style.height = window.innerHeight + 'px';
//     };

//     const createParticles = () => {
//       if (!canvas) return;
//       particles.length = 0;
//       for (let i = 0; i < particleCount; i++) {
//         particles.push({
//           x: Math.random() * canvas.width,
//           y: Math.random() * canvas.height,
//           radius: minRadius + Math.random() * (maxRadius - minRadius),
//           vx: (Math.random() - 0.5) * 0.1, 
//           vy: (Math.random() - 0.5) * 0.1,
//           opacity: 0.15 + Math.random() * 0.2, 
//           connections: []
//         });
//       }
//     };

//     const drawParticles = () => {
//       if (!canvas || !ctx) return;
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       ctx.lineCap = 'round'; 
//       particles.forEach((particle, i) => {
//         particles.forEach((other, j) => {
//           if (i < j) { 
//             const dx = particle.x - other.x;
//             const dy = particle.y - other.y;
//             const distance = Math.sqrt(dx * dx + dy * dy);

//             if (distance < connectionDistance) {
//               const opacity = 0.08 * (1 - distance / connectionDistance); 
              
//               ctx.beginPath();
//               ctx.moveTo(particle.x, particle.y);
//               ctx.lineTo(other.x, other.y);
//               ctx.strokeStyle = `rgba(78, 201, 237, ${opacity})`;
//               ctx.lineWidth = 1.5; 
//               ctx.stroke();

//               ctx.beginPath();
//               ctx.moveTo(particle.x, particle.y);
//               ctx.lineTo(other.x, other.y);
//               ctx.strokeStyle = `rgba(78, 201, 237, ${opacity * 0.3})`;
//               ctx.lineWidth = 3; 
//               ctx.stroke();
//             }
//           }
//         });
//       });

//       particles.forEach(particle => {
//         particle.x += particle.vx;
//         particle.y += particle.vy;

//         if (particle.x < 0) particle.x = canvas.width;
//         if (particle.x > canvas.width) particle.x = 0;
//         if (particle.y < 0) particle.y = canvas.height;
//         if (particle.y > canvas.height) particle.y = 0;

//         ctx.beginPath();
//         ctx.arc(particle.x, particle.y, particle.radius + 1, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(78, 201, 237, ${particle.opacity * 0.3})`;
//         ctx.fill();

//         ctx.beginPath();
//         ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(78, 201, 237, ${particle.opacity})`;
//         ctx.fill();
//       });

//       requestAnimationFrame(drawParticles);
//     };

//     window.addEventListener('resize', resizeCanvas);
//     resizeCanvas();
//     createParticles();
//     drawParticles();

//     return () => {
//       window.removeEventListener('resize', resizeCanvas);
//     };
//   }, []);

//   return (
//     <>
//       <svg className="fixed inset-0 -z-20 w-screen h-screen" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
//         <defs>
//           <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" style={{ stopColor: '#235C7C', stopOpacity: 1 }} />
//             <stop offset="35%" style={{ stopColor: '#21265E', stopOpacity: 1 }} />
//             <stop offset="100%" style={{ stopColor: '#21265E', stopOpacity: 1 }} />
//           </linearGradient>
//         </defs>
//         <rect width="100%" height="100%" fill="url(#backgroundGradient)" />
//       </svg>
//       <canvas
//         ref={canvasRef}
//         className="fixed inset-0 -z-10 w-screen h-screen"
//         style={{
//           minWidth: '100vw',
//           minHeight: '100vh',
//           objectFit: 'cover'
//         }}
//       />
//     </>
//   );
// };

// export default NetworkBackground;


"use client";

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const NetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    const particleCount = 50;
    const connectionDistance = 100;
    const particleSize = 2;

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      if (!canvas) return;
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2
        });
      }
    };

    const drawParticles = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(44, 217, 255, 0.6)';
        ctx.fill();

        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const opacity = (1 - distance / connectionDistance) * 0.5;
            ctx.strokeStyle = `rgba(44, 217, 255, ${opacity})`;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createParticles();
    drawParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
        <>
          <svg className="fixed inset-0 -z-20 w-screen h-screen" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#235C7C', stopOpacity: 1 }} />
                <stop offset="35%" style={{ stopColor: '#21265E', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#21265E', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#backgroundGradient)" />
          </svg>
          <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 w-screen h-screen"
            style={{
              minWidth: '100vw',
              minHeight: '100vh',
              objectFit: 'cover'
            }}
          />
        </>
      );
    };
export default NetworkBackground;
