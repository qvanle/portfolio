import { hashCode } from './splash-cursor-color';

export type GLContext = WebGL2RenderingContext | WebGLRenderingContext;

export type GLExtensions = {
	formatRGBA: { internalFormat: number; format: number } | null;
	formatRG: { internalFormat: number; format: number } | null;
	formatR: { internalFormat: number; format: number } | null;
	halfFloatTexType: number;
	supportLinearFiltering: unknown;
};

export function getWebGLContext(canvas: HTMLCanvasElement): {
	gl: GLContext;
	ext: GLExtensions;
} {
	const params = {
		alpha: true,
		depth: false,
		stencil: false,
		antialias: false,
		preserveDrawingBuffer: false,
	};
	let gl: GLContext | null = canvas.getContext(
		'webgl2',
		params,
	) as WebGL2RenderingContext | null;
	const isWebGL2 = !!gl;
	if (!isWebGL2)
		gl =
			(canvas.getContext('webgl', params) as WebGLRenderingContext | null) ||
			(canvas.getContext(
				'experimental-webgl',
				params,
			) as WebGLRenderingContext | null);

	if (!gl) {
		throw new Error('WebGL not supported');
	}

	let halfFloat: OES_texture_half_float | null = null;
	let supportLinearFiltering:
		| OES_texture_float_linear
		| OES_texture_half_float_linear
		| null;
	if (isWebGL2) {
		gl.getExtension('EXT_color_buffer_float');
		supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
	} else {
		halfFloat = gl.getExtension('OES_texture_half_float');
		supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
	}
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	const halfFloatTexType =
		(isWebGL2
			? (gl as WebGL2RenderingContext).HALF_FLOAT
			: halfFloat?.HALF_FLOAT_OES) ?? gl.UNSIGNED_BYTE;
	let formatRGBA: { internalFormat: number; format: number } | null;
	let formatRG: { internalFormat: number; format: number } | null;
	let formatR: { internalFormat: number; format: number } | null;

	if (isWebGL2) {
		const gl2 = gl as WebGL2RenderingContext;
		formatRGBA = getSupportedFormat(
			gl,
			gl2.RGBA16F,
			gl2.RGBA,
			halfFloatTexType,
		);
		formatRG = getSupportedFormat(gl, gl2.RG16F, gl2.RG, halfFloatTexType);
		formatR = getSupportedFormat(gl, gl2.R16F, gl2.RED, halfFloatTexType);
	} else {
		formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
		formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
		formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
	}

	return {
		gl,
		ext: {
			formatRGBA,
			formatRG,
			formatR,
			halfFloatTexType,
			supportLinearFiltering,
		},
	};
}

export function getSupportedFormat(
	gl: GLContext,
	internalFormat: number,
	format: number,
	type: number,
): { internalFormat: number; format: number } | null {
	if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
		const gl2 = gl as WebGL2RenderingContext;
		switch (internalFormat) {
			case gl2.R16F:
				return getSupportedFormat(gl, gl2.RG16F, gl2.RG, type);
			case gl2.RG16F:
				return getSupportedFormat(gl, gl2.RGBA16F, gl2.RGBA, type);
			default:
				return null;
		}
	}
	return { internalFormat, format };
}

export function supportRenderTextureFormat(
	gl: GLContext,
	internalFormat: number,
	format: number,
	type: number,
): boolean {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
	const fbo = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
	gl.framebufferTexture2D(
		gl.FRAMEBUFFER,
		gl.COLOR_ATTACHMENT0,
		gl.TEXTURE_2D,
		texture,
		0,
	);
	const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	return status === gl.FRAMEBUFFER_COMPLETE;
}

export function addKeywords(
	source: string,
	keywords?: string[] | null,
): string {
	if (!keywords) return source;
	let keywordsString = '';
	keywords.forEach((keyword) => {
		keywordsString += `#define ${keyword}\n`;
	});
	return keywordsString + source;
}

export function compileShader(
	gl: GLContext,
	type: number,
	source: string,
	keywords?: string[] | null,
): WebGLShader {
	source = addKeywords(source, keywords);
	const shader = gl.createShader(type);
	if (!shader) {
		throw new Error('Failed to create WebGL shader');
	}
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
		console.trace(gl.getShaderInfoLog(shader));
	return shader;
}

export function createProgram(
	gl: GLContext,
	vertexShader: WebGLShader,
	fragmentShader: WebGLShader,
): WebGLProgram {
	const program = gl.createProgram();
	if (!program) {
		throw new Error('Failed to create WebGL program');
	}
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS))
		console.trace(gl.getProgramInfoLog(program));
	return program;
}

export function getUniforms(
	gl: GLContext,
	program: WebGLProgram,
): Record<string, WebGLUniformLocation | null> {
	const uniforms: Record<string, WebGLUniformLocation | null> = {};
	const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
	for (let i = 0; i < uniformCount; i++) {
		const uniform = gl.getActiveUniform(program, i);
		if (!uniform) {
			continue;
		}
		const uniformName = uniform.name;
		uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
	}
	return uniforms;
}

export class Material {
	vertexShader: WebGLShader;
	fragmentShaderSource: string;
	programs: Record<number, WebGLProgram> = {};
	activeProgram: WebGLProgram | null = null;
	uniforms: Record<string, WebGLUniformLocation | null> = {};

	constructor(
		private gl: GLContext,
		vertexShader: WebGLShader,
		fragmentShaderSource: string,
	) {
		this.vertexShader = vertexShader;
		this.fragmentShaderSource = fragmentShaderSource;
	}
	setKeywords(keywords: string[]) {
		let hash = 0;
		for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);
		let program = this.programs[hash];
		if (program == null) {
			const fragmentShader = compileShader(
				this.gl,
				this.gl.FRAGMENT_SHADER,
				this.fragmentShaderSource,
				keywords,
			);
			program = createProgram(this.gl, this.vertexShader, fragmentShader);
			this.programs[hash] = program;
		}
		if (program === this.activeProgram) return;
		this.uniforms = getUniforms(this.gl, program);
		this.activeProgram = program;
	}
	bind() {
		// biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL API call, not a React hook
		this.gl.useProgram(this.activeProgram);
	}
}

export class Program {
	program: WebGLProgram;
	uniforms: Record<string, WebGLUniformLocation | null> = {};

	constructor(
		private gl: GLContext,
		vertexShader: WebGLShader,
		fragmentShader: WebGLShader,
	) {
		this.program = createProgram(gl, vertexShader, fragmentShader);
		this.uniforms = getUniforms(gl, this.program);
	}
	bind() {
		// biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL API call, not a React hook
		this.gl.useProgram(this.program);
	}
}
