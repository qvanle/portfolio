'use client';
import { useEffect, useRef } from 'react';

export default function ParticleNetwork({
	particleCount = 45,
	connectionDistance = 120,
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

		const ctx = canvas.getContext('2d', { alpha: true });
		if (!ctx) return;

		let animationId: number;
		let w = 0;
		let h = 0;
		let dark = document.documentElement.classList.contains('dark');
		let lastFrame = 0;
		let visible = true;
		const isMobile = window.innerWidth < 768;
		const count = isMobile ? Math.min(particleCount, 20) : particleCount;
		const dist = isMobile
			? Math.min(connectionDistance, 100)
			: connectionDistance;
		const frameInterval = 1000 / (isMobile ? 24 : 30);

		const px = new Float32Array(count);
		const py = new Float32Array(count);
		const vx = new Float32Array(count);
		const vy = new Float32Array(count);
		const radii = new Float32Array(count);

		const themeObserver = new MutationObserver(() => {
			dark = document.documentElement.classList.contains('dark');
		});
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		const visibilityObserver = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
			},
			{ threshold: 0 },
		);
		visibilityObserver.observe(container);

		function resize() {
			const rect = container!.getBoundingClientRect();
			const dpr = window.devicePixelRatio || 1;
			w = rect.width;
			h = rect.height;
			canvas!.width = w * dpr;
			canvas!.height = h * dpr;
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		function init() {
			for (let i = 0; i < count; i++) {
				const angle = Math.random() * Math.PI * 2;
				const speed = particleSpeed * (0.5 + Math.random());
				px[i] = Math.random() * w;
				py[i] = Math.random() * h;
				vx[i] = Math.cos(angle) * speed;
				vy[i] = Math.sin(angle) * speed;
				radii[i] = 1.5 + Math.random() * 3.5;
			}
		}

		function animate(now: number) {
			animationId = requestAnimationFrame(animate);

			if (!visible || document.hidden) return;
			const delta = now - lastFrame;
			if (delta < frameInterval) return;
			lastFrame = now - (delta % frameInterval);

			ctx!.clearRect(0, 0, w, h);

			for (let i = 0; i < count; i++) {
				px[i] += vx[i];
				py[i] += vy[i];
				if (px[i] < 0 || px[i] > w) vx[i] = -vx[i];
				if (py[i] < 0 || py[i] > h) vy[i] = -vy[i];
			}

			const maxD = dist;
			const maxD2 = maxD * maxD;
			const c = dark ? 255 : 0;

			ctx!.lineWidth = 0.8;
			ctx!.beginPath();
			for (let i = 0; i < count; i++) {
				const xi = px[i];
				const yi = py[i];
				for (let j = i + 1; j < count; j++) {
					const dx = xi - px[j];
					if (dx > maxD || dx < -maxD) continue;
					const dy = yi - py[j];
					if (dy > maxD || dy < -maxD) continue;
					const d2 = dx * dx + dy * dy;
					if (d2 < maxD2) {
						ctx!.moveTo(xi, yi);
						ctx!.lineTo(px[j], py[j]);
					}
				}
			}
			ctx!.strokeStyle = `rgba(${c},${c},${c},${lineOpacity * 0.6})`;
			ctx!.stroke();

			ctx!.fillStyle = `rgba(${c},${c},${c},0.7)`;
			ctx!.beginPath();
			for (let i = 0; i < count; i++) {
				ctx!.moveTo(px[i] + radii[i], py[i]);
				ctx!.arc(px[i], py[i], radii[i], 0, Math.PI * 2);
			}
			ctx!.fill();
		}

		resize();
		init();
		animationId = requestAnimationFrame(animate);

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(container);

		return () => {
			cancelAnimationFrame(animationId);
			resizeObserver.disconnect();
			themeObserver.disconnect();
			visibilityObserver.disconnect();
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
