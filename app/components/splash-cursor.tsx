'use client';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { generateColor, scaleByPixelRatio } from './splash-cursor-color';
import {
	FluidSimulation,
	type SimulationConfig,
} from './splash-cursor-simulation';

function SplashCursor({
	SIM_RESOLUTION = 128,
	DYE_RESOLUTION = 800,
	CAPTURE_RESOLUTION = 512,
	DENSITY_DISSIPATION = 3.5,
	VELOCITY_DISSIPATION = 2,
	PRESSURE = 0.1,
	PRESSURE_ITERATIONS = 20,
	CURL = 3,
	SPLAT_RADIUS = 0.2,
	SPLAT_FORCE = 6000,
	SHADING = true,
	COLOR_UPDATE_SPEED = 10,
	BACK_COLOR = { r: 0.5, g: 0, b: 0 },
	TRANSPARENT = true,
	usePrimaryColors = false,
	children,
	className,
	containerClassName,
}: {
	SIM_RESOLUTION?: number;
	DYE_RESOLUTION?: number;
	CAPTURE_RESOLUTION?: number;
	DENSITY_DISSIPATION?: number;
	VELOCITY_DISSIPATION?: number;
	PRESSURE?: number;
	PRESSURE_ITERATIONS?: number;
	CURL?: number;
	SPLAT_RADIUS?: number;
	SPLAT_FORCE?: number;
	SHADING?: boolean;
	COLOR_UPDATE_SPEED?: number;
	BACK_COLOR?: { r: number; g: number; b: number };
	TRANSPARENT?: boolean;
	usePrimaryColors?: boolean;
	children?: React.ReactNode;
	className?: string;
	containerClassName?: string;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const container = containerRef.current;
		if (!canvas || !container) return;

		const config: SimulationConfig = {
			SIM_RESOLUTION,
			DYE_RESOLUTION,
			CAPTURE_RESOLUTION,
			DENSITY_DISSIPATION,
			VELOCITY_DISSIPATION,
			PRESSURE,
			PRESSURE_ITERATIONS,
			CURL,
			SPLAT_RADIUS,
			SPLAT_FORCE,
			SHADING,
			COLOR_UPDATE_SPEED,
			PAUSED: false,
			BACK_COLOR,
			TRANSPARENT,
			usePrimaryColors,
		};

		const simulation = new FluidSimulation(canvas, config);
		const pointer = simulation.pointers[0];

		let splashVisible = true;
		const splashVisObserver = new IntersectionObserver(
			([entry]) => {
				splashVisible = entry.isIntersecting;
			},
			{ threshold: 0 },
		);
		splashVisObserver.observe(container);

		function updateFrame() {
			const dt = simulation.beginFrame();
			if (!splashVisible || document.hidden) {
				requestAnimationFrame(updateFrame);
				return;
			}
			simulation.stepAndRender(dt);
			requestAnimationFrame(updateFrame);
		}

		// Helper to check if element should skip splash cursor
		function shouldSkipSplash(target: EventTarget | null): boolean {
			if (!target || !(target instanceof Element)) return false;

			// Check if the target or any parent has data-skip-splash-cursor
			let element: Element | null = target;
			while (element) {
				if (element.hasAttribute('data-skip-splash-cursor')) {
					return true;
				}
				element = element.parentElement;
			}
			return false;
		}

		// Helper to get position relative to container
		function getRelativePosition(clientX: number, clientY: number) {
			// container is guaranteed to be non-null due to early return check above
			// biome-ignore lint/style/noNonNullAssertion: container is checked for null at useEffect entry
			const rect = container!.getBoundingClientRect();
			return {
				x: clientX - rect.left,
				y: clientY - rect.top,
			};
		}

		const handleMouseDown = (e: MouseEvent) => {
			if (shouldSkipSplash(e.target)) return;

			const pos = getRelativePosition(e.clientX, e.clientY);
			const posX = scaleByPixelRatio(pos.x);
			const posY = scaleByPixelRatio(pos.y);
			simulation.updatePointerDownData(pointer, -1, posX, posY);
			simulation.clickSplat(pointer);
		};

		let firstMouseMove = true;
		const handleMouseMove = (e: MouseEvent) => {
			if (shouldSkipSplash(e.target)) return;

			const pos = getRelativePosition(e.clientX, e.clientY);
			const posX = scaleByPixelRatio(pos.x);
			const posY = scaleByPixelRatio(pos.y);

			if (firstMouseMove) {
				const color = generateColor(usePrimaryColors);
				simulation.updatePointerMoveData(pointer, posX, posY, color);
				firstMouseMove = false;
			} else {
				const color = pointer.color;
				simulation.updatePointerMoveData(pointer, posX, posY, color);
			}
		};

		const handleTouchStart = (e: TouchEvent) => {
			if (shouldSkipSplash(e.target)) return;

			const touches = e.targetTouches;
			for (let i = 0; i < touches.length; i++) {
				const pos = getRelativePosition(touches[i].clientX, touches[i].clientY);
				const posX = scaleByPixelRatio(pos.x);
				const posY = scaleByPixelRatio(pos.y);
				simulation.updatePointerDownData(
					pointer,
					touches[i].identifier,
					posX,
					posY,
				);
			}
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (shouldSkipSplash(e.target)) return;

			const touches = e.targetTouches;
			for (let i = 0; i < touches.length; i++) {
				const pos = getRelativePosition(touches[i].clientX, touches[i].clientY);
				const posX = scaleByPixelRatio(pos.x);
				const posY = scaleByPixelRatio(pos.y);
				simulation.updatePointerMoveData(pointer, posX, posY, pointer.color);
			}
		};

		const handleTouchEnd = (e: TouchEvent) => {
			const touches = e.changedTouches;
			for (let i = 0; i < touches.length; i++) {
				simulation.updatePointerUpData(pointer);
			}
		};

		// Attach event listeners to container
		container.addEventListener('mousedown', handleMouseDown);
		container.addEventListener('mousemove', handleMouseMove);
		container.addEventListener('touchstart', handleTouchStart);
		container.addEventListener('touchmove', handleTouchMove, false);
		container.addEventListener('touchend', handleTouchEnd);

		updateFrame();

		// Cleanup
		return () => {
			container.removeEventListener('mousedown', handleMouseDown);
			container.removeEventListener('mousemove', handleMouseMove);
			container.removeEventListener('touchstart', handleTouchStart);
			container.removeEventListener('touchmove', handleTouchMove);
			container.removeEventListener('touchend', handleTouchEnd);
			splashVisObserver.disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		SIM_RESOLUTION,
		DYE_RESOLUTION,
		CAPTURE_RESOLUTION,
		DENSITY_DISSIPATION,
		VELOCITY_DISSIPATION,
		PRESSURE,
		PRESSURE_ITERATIONS,
		CURL,
		SPLAT_RADIUS,
		SPLAT_FORCE,
		SHADING,
		COLOR_UPDATE_SPEED,
		BACK_COLOR,
		TRANSPARENT,
		usePrimaryColors,
	]);

	return (
		<div
			ref={containerRef}
			className={classNames('relative overflow-hidden', containerClassName)}
		>
			<canvas
				ref={canvasRef}
				id='fluid'
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					pointerEvents: 'none',
					zIndex: 0,
				}}
			/>
			<div className={classNames('relative z-10', className)}>{children}</div>
		</div>
	);
}

export default SplashCursor;
