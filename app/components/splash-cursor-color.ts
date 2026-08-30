export type RGBColor = { r: number; g: number; b: number };

export function generateColor(usePrimaryColors: boolean): RGBColor {
	if (usePrimaryColors) {
		// Amber color palette
		const primaryColors: RGBColor[] = [
			{ r: 255 / 255, g: 251 / 255, b: 235 / 255 }, // #fffbeb
			{ r: 254 / 255, g: 243 / 255, b: 199 / 255 }, // #fef3c7
			{ r: 253 / 255, g: 230 / 255, b: 138 / 255 }, // #fde68a
			{ r: 252 / 255, g: 211 / 255, b: 77 / 255 }, // #fcd34d
			{ r: 245 / 255, g: 158 / 255, b: 11 / 255 }, // #f59e0b
			{ r: 217 / 255, g: 119 / 255, b: 6 / 255 }, // #d97706
			{ r: 180 / 255, g: 83 / 255, b: 9 / 255 }, // #b45309
			{ r: 146 / 255, g: 64 / 255, b: 14 / 255 }, // #92400e
			{ r: 120 / 255, g: 53 / 255, b: 15 / 255 }, // #78350f
		];

		// Select a random color from the palette
		const c = primaryColors[Math.floor(Math.random() * primaryColors.length)];

		// Apply intensity multiplier (adjust this value to make colors more/less vibrant)
		return {
			r: c.r * 0.15,
			g: c.g * 0.15,
			b: c.b * 0.15,
		};
	}

	// Use HSV color generation
	const c = HSVtoRGB(Math.random(), 1.0, 1.0);
	c.r *= 0.15;
	c.g *= 0.15;
	c.b *= 0.15;
	return c;
}

export function HSVtoRGB(h: number, s: number, v: number): RGBColor {
	let r = 0,
		g = 0,
		b = 0;
	const i = Math.floor(h * 6);
	const f = h * 6 - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		case 5:
			r = v;
			g = p;
			b = q;
			break;
		default:
			break;
	}
	return { r, g, b };
}

export function wrap(value: number, min: number, max: number): number {
	const range = max - min;
	if (range === 0) return min;
	return ((value - min) % range) + min;
}

export function scaleByPixelRatio(input: number): number {
	const pixelRatio = window.devicePixelRatio || 1;
	return Math.floor(input * pixelRatio);
}

export function hashCode(s: string): number {
	if (s.length === 0) return 0;
	let hash = 0;
	for (let i = 0; i < s.length; i++) {
		hash = (hash << 5) - hash + s.charCodeAt(i);
		hash |= 0;
	}
	return hash;
}
