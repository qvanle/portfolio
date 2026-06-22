'use client';
import { useEffect, useRef } from 'react';

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	radius: number;
}

export default function ParticleNetwork({
	particleCount = 60,
	connectionDistance = 150,
	particleSpeed = 0.3,
	lineOpacity = 0.15,
}: {
	particleCount?: number;
	connectionDistance?: number;
	particleSpeed?: number;
	lineOpacity?: number;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const container = containerRef.current;
		if (!canvas || !container) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animationId: number;
		const particles: Particle[] = [];
		let w = 0;
		let h = 0;

		function resize() {
			const rect = container!.getBoundingClientRect();
			const dpr = window.devicePixelRatio || 1;
			w = rect.width;
			h = rect.height;
			canvas!.width = w * dpr;
			canvas!.height = h * dpr;
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		function initParticles() {
			particles.length = 0;
			for (let i = 0; i < particleCount; i++) {
				const angle = Math.random() * Math.PI * 2;
				const speed = particleSpeed * (0.5 + Math.random());
				particles.push({
					x: Math.random() * w,
					y: Math.random() * h,
					vx: Math.cos(angle) * speed,
					vy: Math.sin(angle) * speed,
					radius: 1.5 + Math.random() * 3.5,
				});
			}
		}

		function isDark() {
			return document.documentElement.classList.contains('dark');
		}

		function animate() {
			ctx!.clearRect(0, 0, w, h);

			const dark = isDark();
			const rgb = dark ? '255, 255, 255' : '0, 0, 0';
			const dotAlpha = dark ? 0.7 : 0.7;

			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;

				if (p.x < 0 || p.x > w) p.vx *= -1;
				if (p.y < 0 || p.y > h) p.vy *= -1;
				p.x = Math.max(0, Math.min(w, p.x));
				p.y = Math.max(0, Math.min(h, p.y));
			}

			const distSq = connectionDistance * connectionDistance;
			ctx!.lineWidth = 0.8;
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const d2 = dx * dx + dy * dy;
					if (d2 < distSq) {
						const opacity =
							(1 - Math.sqrt(d2) / connectionDistance) * lineOpacity;
						ctx!.beginPath();
						ctx!.strokeStyle = `rgba(${rgb}, ${opacity})`;
						ctx!.moveTo(particles[i].x, particles[i].y);
						ctx!.lineTo(particles[j].x, particles[j].y);
						ctx!.stroke();
					}
				}
			}

			ctx!.fillStyle = `rgba(${rgb}, ${dotAlpha})`;
			for (const p of particles) {
				ctx!.beginPath();
				ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
				ctx!.fill();
			}

			animationId = requestAnimationFrame(animate);
		}

		resize();
		initParticles();
		animate();

		const observer = new ResizeObserver(() => {
			resize();
		});
		observer.observe(container);

		return () => {
			cancelAnimationFrame(animationId);
			observer.disconnect();
		};
	}, [particleCount, connectionDistance, particleSpeed, lineOpacity]);

	return (
		<div
			ref={containerRef}
			style={{
				position: 'absolute',
				inset: 0,
				pointerEvents: 'none',
				zIndex: 1,
			}}
		>
			<canvas
				ref={canvasRef}
				style={{
					width: '100%',
					height: '100%',
					display: 'block',
				}}
			/>
		</div>
	);
}
