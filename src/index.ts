type AppConfig = {
	enabled: boolean;
	licenseRequired: boolean;
	minVersion: string;
	notice: string;
	cacheTtlHours: number;
	freeLimits: {
		maxProfiles: number;
		maxPoints: number;
	};
};

const defaultConfig: AppConfig = {
	enabled: true,
	licenseRequired: false,
	minVersion: '1.0.0',
	notice: '',
	cacheTtlHours: 24,
	freeLimits: {
		maxProfiles: 999,
		maxPoints: 9999,
	},
};

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders() });
		}

		if (request.method !== 'GET') {
			return json({ error: 'Method not allowed' }, 405);
		}

		if (url.pathname === '/' || url.pathname === '/health') {
			return json({ ok: true, service: 'click-flow-license' });
		}

		if (url.pathname === '/apikeymap' || url.pathname === '/shree52388401163814apikeymap') {
			return json([{ key: 'shree', apikey: 'xxxxx' }]);
		}

		if (url.pathname !== '/config') {
			return json({ error: 'Not found' }, 404);
		}

		const config = await env.APP_CONFIG.get<AppConfig>('app-config', 'json');
		return json(config ?? defaultConfig);
	},
} satisfies ExportedHandler<Env>;

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': 'no-store',
			...corsHeaders(),
		},
	});
}

function corsHeaders(): HeadersInit {
	return {
		'access-control-allow-origin': '*',
		'access-control-allow-methods': 'GET, OPTIONS',
		'access-control-allow-headers': 'content-type',
	};
}
