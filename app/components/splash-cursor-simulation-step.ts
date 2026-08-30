import type { FluidSimulation } from './splash-cursor-simulation';

/** The fluid-physics pipeline (curl -> vorticity -> divergence -> pressure
 * -> gradient subtract -> advection) plus the final display render. Split
 * out of ./splash-cursor-simulation to keep that file smaller; operates on
 * a FluidSimulation instance's package-internal fields. */
export function runSimulationStep(sim: FluidSimulation, dt: number): void {
	const { gl, velocity, curl, divergence, pressure, dye, config, ext } = sim;
	gl.disable(gl.BLEND);

	sim.curlProgram.bind();
	gl.uniform2f(
		sim.curlProgram.uniforms.texelSize,
		velocity.texelSizeX,
		velocity.texelSizeY,
	);
	gl.uniform1i(sim.curlProgram.uniforms.uVelocity, velocity.read.attach(0));
	sim.blit(curl);

	sim.vorticityProgram.bind();
	gl.uniform2f(
		sim.vorticityProgram.uniforms.texelSize,
		velocity.texelSizeX,
		velocity.texelSizeY,
	);
	gl.uniform1i(
		sim.vorticityProgram.uniforms.uVelocity,
		velocity.read.attach(0),
	);
	gl.uniform1i(sim.vorticityProgram.uniforms.uCurl, curl.attach(1));
	gl.uniform1f(sim.vorticityProgram.uniforms.curl, config.CURL);
	gl.uniform1f(sim.vorticityProgram.uniforms.dt, dt);
	sim.blit(velocity.write);
	velocity.swap();

	sim.divergenceProgram.bind();
	gl.uniform2f(
		sim.divergenceProgram.uniforms.texelSize,
		velocity.texelSizeX,
		velocity.texelSizeY,
	);
	gl.uniform1i(
		sim.divergenceProgram.uniforms.uVelocity,
		velocity.read.attach(0),
	);
	sim.blit(divergence);

	sim.clearProgram.bind();
	gl.uniform1i(sim.clearProgram.uniforms.uTexture, pressure.read.attach(0));
	gl.uniform1f(sim.clearProgram.uniforms.value, config.PRESSURE);
	sim.blit(pressure.write);
	pressure.swap();

	sim.pressureProgram.bind();
	gl.uniform2f(
		sim.pressureProgram.uniforms.texelSize,
		velocity.texelSizeX,
		velocity.texelSizeY,
	);
	gl.uniform1i(sim.pressureProgram.uniforms.uDivergence, divergence.attach(0));
	for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
		gl.uniform1i(
			sim.pressureProgram.uniforms.uPressure,
			pressure.read.attach(1),
		);
		sim.blit(pressure.write);
		pressure.swap();
	}

	sim.gradientSubtractProgram.bind();
	gl.uniform2f(
		sim.gradientSubtractProgram.uniforms.texelSize,
		velocity.texelSizeX,
		velocity.texelSizeY,
	);
	gl.uniform1i(
		sim.gradientSubtractProgram.uniforms.uPressure,
		pressure.read.attach(0),
	);
	gl.uniform1i(
		sim.gradientSubtractProgram.uniforms.uVelocity,
		velocity.read.attach(1),
	);
	sim.blit(velocity.write);
	velocity.swap();

	sim.advectionProgram.bind();
	gl.uniform2f(
		sim.advectionProgram.uniforms.texelSize,
		velocity.texelSizeX,
		velocity.texelSizeY,
	);
	if (!ext.supportLinearFiltering)
		gl.uniform2f(
			sim.advectionProgram.uniforms.dyeTexelSize,
			velocity.texelSizeX,
			velocity.texelSizeY,
		);
	const velocityId = velocity.read.attach(0);
	gl.uniform1i(sim.advectionProgram.uniforms.uVelocity, velocityId);
	gl.uniform1i(sim.advectionProgram.uniforms.uSource, velocityId);
	gl.uniform1f(sim.advectionProgram.uniforms.dt, dt);
	gl.uniform1f(
		sim.advectionProgram.uniforms.dissipation,
		config.VELOCITY_DISSIPATION,
	);
	sim.blit(velocity.write);
	velocity.swap();

	if (!ext.supportLinearFiltering)
		gl.uniform2f(
			sim.advectionProgram.uniforms.dyeTexelSize,
			dye.texelSizeX,
			dye.texelSizeY,
		);
	gl.uniform1i(
		sim.advectionProgram.uniforms.uVelocity,
		velocity.read.attach(0),
	);
	gl.uniform1i(sim.advectionProgram.uniforms.uSource, dye.read.attach(1));
	gl.uniform1f(
		sim.advectionProgram.uniforms.dissipation,
		config.DENSITY_DISSIPATION,
	);
	sim.blit(dye.write);
	dye.swap();

	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.BLEND);
	drawDisplay(sim);
}

function drawDisplay(sim: FluidSimulation): void {
	const { gl } = sim;
	const width = gl.drawingBufferWidth;
	const height = gl.drawingBufferHeight;
	sim.displayMaterial.bind();
	if (sim.config.SHADING)
		gl.uniform2f(
			sim.displayMaterial.uniforms.texelSize,
			1.0 / width,
			1.0 / height,
		);
	gl.uniform1i(sim.displayMaterial.uniforms.uTexture, sim.dye.read.attach(0));
	sim.blit(null);
}
