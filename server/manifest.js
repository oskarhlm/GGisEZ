const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".nojekyll","favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.d2590c64.js","imports":["_app/immutable/entry/start.d2590c64.js","_app/immutable/chunks/index.d7db5ae4.js","_app/immutable/chunks/singletons.5501d12e.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.33f9cdd8.js","imports":["_app/immutable/entry/app.33f9cdd8.js","_app/immutable/chunks/index.d7db5ae4.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./chunks/0-986eb0af.js'),
			() => import('./chunks/1-4ea6bfbc.js'),
			() => import('./chunks/2-ee5917c4.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};

const prerendered = new Set(["/"]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
