import {
	generateColor,
	type RGBColor,
	scaleByPixelRatio,
	wrap,
} from './splash-cursor-color';
import {
	type Blit,
	createBlit,
	createDoubleFBO,
	createFBO,
	type DoubleFBO,
	type FBO,
	getResolution,
	resizeDoubleFBO,
} from './splash-cursor-framebuffers';
import {
	advectionShaderSource,
	baseVertexShaderSource,
	clearShaderSource,
	copyShaderSource,
	curlShaderSource,
	displayShaderSource,
	divergenceShaderSource,
	gradientSubtractShaderSource,
	pressureShaderSource,
	splatShaderSource,
	vorticityShaderSource,
} from './splash-cursor-shaders';
import { runSimulationStep } from './splash-cursor-simulation-step';
import {
	compileShader,
	type GLContext,
	type GLExtensions,
	getWebGLContext,
	Material,
	Program,
} from './splash-cursor-webgl-core';

export class Pointer {
	id = -1;
	texcoordX = 0;
	texcoordY = 0;
	prevTexcoordX = 0;
	prevTexcoordY = 0;
	deltaX = 0;
	deltaY = 0;
	down = false;
	moved = false;
	color: RGBColor = { r: 0, g: 0, b: 0 };
}

export type SimulationConfig = {
	SIM_RESOLUTION: number;
	DYE_RESOLUTION: number;
	CAPTURE_RESOLUTION: number;
	DENSITY_DISSIPATION: number;
	VELOCITY_DISSIPATION: number;
	PRESSURE: number;
	PRESSURE_ITERATIONS: number;
	CURL: number;
	SPLAT_RADIUS: number;
	SPLAT_FORCE: number;
	SHADING: boolean;
	COLOR_UPDATE_SPEED: number;
	PAUSED: boolean;
	BACK_COLOR: RGBColor;
	TRANSPARENT: boolean;
	usePrimaryColors: boolean;
};

/** Encapsulates the WebGL fluid-simulation state and physics step; the
 * React component owns DOM lifecycle (rAF scheduling, visibility gating,
 * event wiring) and delegates rendering/input here. */
export class FluidSimulation {
	readonly pointers: Pointer[] = [new Pointer()];

	private readonly canvas: HTMLCanvasElement;
	// Package-internal (not `private`): read by ./splash-cursor-simulation-step,
	// which implements the physics step out-of-line to keep this file smaller.
	// Not part of the class's public API.
	readonly config: SimulationConfig;
	readonly gl: GLContext;
	readonly ext: GLExtensions;
	readonly blit: Blit;

	private readonly copyProgram: Program;
	readonly clearProgram: Program;
	private readonly splatProgram: Program;
	readonly advectionProgram: Program;
	readonly divergenceProgram: Program;
	readonly curlProgram: Program;
	readonly vorticityProgram: Program;
	readonly pressureProgram: Program;
	readonly gradientSubtractProgram: Program;
	readonly displayMaterial: Material;

	dye!: DoubleFBO;
	velocity!: DoubleFBO;
	divergence!: FBO;
	curl!: FBO;
	pressure!: DoubleFBO;

	private lastUpdateTime: number;
	private colorUpdateTimer = 0.0;

	constructor(canvas: HTMLCanvasElement, config: SimulationConfig) {
		this.canvas = canvas;
		this.config = config;

		const { gl, ext } = getWebGLContext(canvas);
		this.gl = gl;
		this.ext = ext;
		if (!ext.supportLinearFiltering) {
			this.config.DYE_RESOLUTION = 256;
			this.config.SHADING = false;
		}

		this.blit = createBlit(gl);

		const baseVertexShader = compileShader(
			gl,
			gl.VERTEX_SHADER,
			baseVertexShaderSource,
		);
		const copyShader = compileShader(gl, gl.FRAGMENT_SHADER, copyShaderSource);
		const clearShader = compileShader(
			gl,
			gl.FRAGMENT_SHADER,
			clearShaderSource,
		);
		const splatShader = compileShader(
			gl,
			gl.FRAGMENT_SHADER,
			splatShaderSource,
		);
		const advectionShader = compileShader(
			gl,
			gl.FRAGMENT_SHADER,
			advectionShaderSource,
			ext.supportLinearFiltering ? null : ['MANUAL_FILTERING'],
		);
		const divergenceShader = compileShader(
			gl,
			gl.FRAGMENT_SHADER,
			divergenceShaderSource,
		);
		const curlShader = compileShader(gl, gl.FRAGMENT_SHADER, curlShaderSource);
		const vorticityShader = compileShader(
			gl,
			gl.FRAGMENT_SHADER,
			vorticityShaderSource,
		);
		const pressureShader = compileShader(
			gl,
			gl.FRAGMENT_SHADER,
			pressureShaderSource,
		);
		const gradientSubtractShader = compileShader(
			gl,
			gl.FRAGMENT_SHADER,
			gradientSubtractShaderSource,
		);

		this.copyProgram = new Program(gl, baseVertexShader, copyShader);
		this.clearProgram = new Program(gl, baseVertexShader, clearShader);
		this.splatProgram = new Program(gl, baseVertexShader, splatShader);
		this.advectionProgram = new Program(gl, baseVertexShader, advectionShader);
		this.divergenceProgram = new Program(
			gl,
			baseVertexShader,
			divergenceShader,
		);
		this.curlProgram = new Program(gl, baseVertexShader, curlShader);
		this.vorticityProgram = new Program(gl, baseVertexShader, vorticityShader);
		this.pressureProgram = new Program(gl, baseVertexShader, pressureShader);
		this.gradientSubtractProgram = new Program(
			gl,
			baseVertexShader,
			gradientSubtractShader,
		);
		this.displayMaterial = new Material(
			gl,
			baseVertexShader,
			displayShaderSource,
		);

		this.updateKeywords();
		this.initFramebuffers();
		this.lastUpdateTime = Date.now();
	}

	private updateKeywords() {
		const displayKeywords = [];
		if (this.config.SHADING) displayKeywords.push('SHADING');
		this.displayMaterial.setKeywords(displayKeywords);
	}

	initFramebuffers() {
		const { gl, ext, config } = this;
		const simRes = getResolution(gl, config.SIM_RESOLUTION);
		const dyeRes = getResolution(gl, config.DYE_RESOLUTION);
		const texType = ext.halfFloatTexType;
		const rgba = ext.formatRGBA;
		const rg = ext.formatRG;
		const r = ext.formatR;
		const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
		gl.disable(gl.BLEND);

		if (!rgba || !rg || !r) {
			console.error('Required texture formats not supported');
			return;
		}

		if (!this.dye)
			this.dye = createDoubleFBO(
				gl,
				dyeRes.width,
				dyeRes.height,
				rgba.internalFormat,
				rgba.format,
				texType,
				filtering,
			);
		else
			this.dye = resizeDoubleFBO(
				gl,
				this.blit,
				this.copyProgram,
				this.dye,
				dyeRes.width,
				dyeRes.height,
				rgba.internalFormat,
				rgba.format,
				texType,
				filtering,
			);

		if (!this.velocity)
			this.velocity = createDoubleFBO(
				gl,
				simRes.width,
				simRes.height,
				rg.internalFormat,
				rg.format,
				texType,
				filtering,
			);
		else
			this.velocity = resizeDoubleFBO(
				gl,
				this.blit,
				this.copyProgram,
				this.velocity,
				simRes.width,
				simRes.height,
				rg.internalFormat,
				rg.format,
				texType,
				filtering,
			);

		this.divergence = createFBO(
			gl,
			simRes.width,
			simRes.height,
			r.internalFormat,
			r.format,
			texType,
			gl.NEAREST,
		);
		this.curl = createFBO(
			gl,
			simRes.width,
			simRes.height,
			r.internalFormat,
			r.format,
			texType,
			gl.NEAREST,
		);
		this.pressure = createDoubleFBO(
			gl,
			simRes.width,
			simRes.height,
			r.internalFormat,
			r.format,
			texType,
			gl.NEAREST,
		);
	}

	private resizeCanvas(): boolean {
		const width = scaleByPixelRatio(this.canvas.clientWidth);
		const height = scaleByPixelRatio(this.canvas.clientHeight);
		if (this.canvas.width !== width || this.canvas.height !== height) {
			this.canvas.width = width;
			this.canvas.height = height;
			return true;
		}
		return false;
	}

	/** Advances the internal clock; call once per animation frame regardless
	 * of visibility so `dt` stays small when rendering resumes. Returns the
	 * clamped delta time in seconds. */
	beginFrame(): number {
		const now = Date.now();
		let dt = (now - this.lastUpdateTime) / 1000;
		dt = Math.min(dt, 0.016666);
		this.lastUpdateTime = now;
		return dt;
	}

	/** Runs one simulation step and renders it. Call only while visible. */
	stepAndRender(dt: number): void {
		if (this.resizeCanvas()) this.initFramebuffers();
		this.updateColors(dt);
		this.applyInputs();
		runSimulationStep(this, dt);
	}

	private updateColors(dt: number): void {
		this.colorUpdateTimer += dt * this.config.COLOR_UPDATE_SPEED;
		if (this.colorUpdateTimer >= 1) {
			this.colorUpdateTimer = wrap(this.colorUpdateTimer, 0, 1);
			this.pointers.forEach((p) => {
				p.color = generateColor(this.config.usePrimaryColors);
			});
		}
	}

	private applyInputs() {
		this.pointers.forEach((p) => {
			if (p.moved) {
				p.moved = false;
				this.splatPointer(p);
			}
		});
	}

	splatPointer(pointer: Pointer): void {
		const dx = pointer.deltaX * this.config.SPLAT_FORCE;
		const dy = pointer.deltaY * this.config.SPLAT_FORCE;
		this.splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
	}

	clickSplat(pointer: Pointer): void {
		const color = generateColor(this.config.usePrimaryColors);
		color.r *= 10.0;
		color.g *= 10.0;
		color.b *= 10.0;
		const dx = 10 * (Math.random() - 0.5);
		const dy = 30 * (Math.random() - 0.5);
		this.splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
	}

	private splat(
		x: number,
		y: number,
		dx: number,
		dy: number,
		color: RGBColor,
	): void {
		const { gl, canvas, velocity, dye } = this;
		this.splatProgram.bind();
		gl.uniform1i(this.splatProgram.uniforms.uTarget, velocity.read.attach(0));
		gl.uniform1f(
			this.splatProgram.uniforms.aspectRatio,
			canvas.width / canvas.height,
		);
		gl.uniform2f(this.splatProgram.uniforms.point, x, y);
		gl.uniform3f(this.splatProgram.uniforms.color, dx, dy, 0.0);
		gl.uniform1f(
			this.splatProgram.uniforms.radius,
			this.correctRadius(this.config.SPLAT_RADIUS / 100.0),
		);
		this.blit(velocity.write);
		velocity.swap();

		gl.uniform1i(this.splatProgram.uniforms.uTarget, dye.read.attach(0));
		gl.uniform3f(this.splatProgram.uniforms.color, color.r, color.g, color.b);
		this.blit(dye.write);
		dye.swap();
	}

	private correctRadius(radius: number): number {
		const aspectRatio = this.canvas.width / this.canvas.height;
		if (aspectRatio > 1) radius *= aspectRatio;
		return radius;
	}

	updatePointerDownData(
		pointer: Pointer,
		id: number,
		posX: number,
		posY: number,
	): void {
		const { canvas } = this;
		pointer.id = id;
		pointer.down = true;
		pointer.moved = false;
		pointer.texcoordX = posX / canvas.width;
		pointer.texcoordY = 1.0 - posY / canvas.height;
		pointer.prevTexcoordX = pointer.texcoordX;
		pointer.prevTexcoordY = pointer.texcoordY;
		pointer.deltaX = 0;
		pointer.deltaY = 0;
		pointer.color = generateColor(this.config.usePrimaryColors);
	}

	updatePointerMoveData(
		pointer: Pointer,
		posX: number,
		posY: number,
		color: RGBColor,
	): void {
		const { canvas } = this;
		pointer.prevTexcoordX = pointer.texcoordX;
		pointer.prevTexcoordY = pointer.texcoordY;
		pointer.texcoordX = posX / canvas.width;
		pointer.texcoordY = 1.0 - posY / canvas.height;
		pointer.deltaX = this.correctDeltaX(
			pointer.texcoordX - pointer.prevTexcoordX,
		);
		pointer.deltaY = this.correctDeltaY(
			pointer.texcoordY - pointer.prevTexcoordY,
		);
		pointer.moved =
			Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
		pointer.color = color;
	}

	updatePointerUpData(pointer: Pointer): void {
		pointer.down = false;
	}

	private correctDeltaX(delta: number): number {
		const aspectRatio = this.canvas.width / this.canvas.height;
		if (aspectRatio < 1) delta *= aspectRatio;
		return delta;
	}

	private correctDeltaY(delta: number): number {
		const aspectRatio = this.canvas.width / this.canvas.height;
		if (aspectRatio > 1) delta /= aspectRatio;
		return delta;
	}
}
