import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('click-flow-license worker', () => {
	it('responds with health status', async () => {
		const request = new IncomingRequest('http://example.com/health');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);

		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({
			ok: true,
			service: 'click-flow-license',
		});
	});

	it('returns the default app config', async () => {
		const response = await SELF.fetch('https://example.com/config');

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({
			enabled: true,
			licenseRequired: false,
			minVersion: '1.0.0',
		});
	});
});
