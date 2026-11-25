/**
 * Turns the public website into a folder of plain static files (no database, no admin, no server), for sharing
 * a review copy. Builds the site, starts it briefly, saves every public page as HTML, and copies the scripts,
 * fonts, images and video.
 *
 *   npm run snapshot            ->  ../dev-snapshot/   (upload that folder anywhere)
 *
 * Needs the local database running (the build reads your current content from it).
 * What does not work on the copy: forms send nothing (they show a demo message), and blog search/filters
 * do not filter. Everything else (carousels, menus, work gallery, animations) works.
 */
import { spawn } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const WEB = process.cwd();
const OUT = join(WEB, '..', 'dev-snapshot');
const PORT = 3199;
const BASE = `http://localhost:${PORT}`;
const env = { ...process.env, SITE_NOINDEX: 'true', SNAPSHOT_BUILD: 'true', NODE_ENV: 'production' };

const run = (cmd, args, opts = {}) =>
	new Promise((resolve, reject) => {
		const p = spawn(cmd, args, { cwd: WEB, env, stdio: 'inherit', ...opts });
		p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`))));
	});

const FILE_EXT = /\.(ico|png|jpe?g|webp|avif|svg|gif|webm|mp4|js|css|json|xml|txt|pdf|woff2?|map)$/i;
const SKIP = /^\/(_next|admin|api|media|site_img|img)(\/|$)/;

function linksIn(html) {
	const found = new Set();
	for (const m of html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
		const p = m[1].replace(/\/+$/, '') || '/';
		if (!SKIP.test(p) && !FILE_EXT.test(p)) found.add(p);
	}
	return found;
}

/**
 * next/image URLs (/_next/image?url=...&w=...) need the server; point them at the original file instead.
 * They appear in the HTML and again, with & written as \u0026, inside the page data the browser reads on load.
 */
function fixImages(html) {
	return html
		.replace(/\/_next\/image\?url=([^&"'\\\s]+)(?:&amp;|&|\\u0026)w=\d+(?:&amp;|&|\\u0026)q=\d+/g, (_m, enc) => decodeURIComponent(enc))
		.replaceAll(BASE, '')
		.replaceAll(BASE.replace('//', '\\/\\/'), '');
}

async function main() {
	console.log('1/4 Building the site...');
	await run('npx', ['next', 'build']);

	console.log('2/4 Starting it briefly and saving every public page...');
	const server = spawn('npx', ['next', 'start', '-p', String(PORT)], { cwd: WEB, env, stdio: 'ignore', detached: true });
	const stop = () => {
		try {
			process.kill(-server.pid, 'SIGTERM');
		} catch {}
	};
	process.on('exit', stop);
	try {
		for (let i = 0; i < 60; i++) {
			try {
				if ((await fetch(BASE)).ok) break;
			} catch {}
			await new Promise((r) => setTimeout(r, 500));
		}

		rmSync(OUT, { recursive: true, force: true });
		mkdirSync(OUT, { recursive: true });

		const queue = ['/'];
		const seen = new Set(queue);
		const saved = [];
		while (queue.length) {
			const route = queue.shift();
			const res = await fetch(BASE + route);
			if (!res.ok || !(res.headers.get('content-type') ?? '').includes('text/html')) {
				console.log(`   skipped ${route} (HTTP ${res.status})`);
				continue;
			}
			const html = await res.text();
			for (const l of linksIn(html)) {
				if (seen.has(l)) continue;
				seen.add(l);
				queue.push(l);
			}
			const file = route === '/' ? 'index.html' : join(route.slice(1), 'index.html');
			mkdirSync(dirname(join(OUT, file)), { recursive: true });
			writeFileSync(join(OUT, file), fixImages(html));
			saved.push(route);
		}
		// Next draws its 404 page in the browser, which does not work when the file is served at another address,
		// so the (self-contained) 404 is written out by hand as plain HTML.
		writeFileSync(
			join(OUT, '404.html'),
			'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
				'<meta name="robots" content="noindex"><title>Page not found</title></head>' +
				'<body style="margin:0"><main style="min-height:100vh;display:grid;place-items:center;padding:2rem;background:#161e33;color:#fff;font-family:system-ui,sans-serif;text-align:center">' +
				'<div><p style="margin:0;letter-spacing:.2em;font-size:13px;opacity:.6">404</p>' +
				'<h1 style="margin:12px 0;font-family:Georgia,serif;font-weight:400;font-size:40px">Page not found</h1>' +
				'<p style="margin:0 0 28px;opacity:.75">The page you are looking for does not exist.</p>' +
				'<a href="/" style="color:#161e33;background:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600">Back to home</a></div></main></body></html>',
		);
		console.log(`   saved ${saved.length} pages: ${saved.join(' ')}`);
	} finally {
		stop();
	}

	console.log('3/4 Copying scripts, fonts, images and video...');
	cpSync(join(WEB, '.next', 'static'), join(OUT, '_next', 'static'), { recursive: true });
	cpSync(join(WEB, 'public'), OUT, { recursive: true, dereference: true });
// `public/site_img` is a link to the uploads folder; the link itself must not end up in the output.
rmSync(join(OUT, 'site_img'), { recursive: true, force: true });
cpSync(join(WEB, '..', 'site_img'), join(OUT, 'site_img'), { recursive: true, dereference: true });
	for (const f of ['favicon.ico', 'icon.png', 'apple-icon.png']) cpSync(join(WEB, 'src', 'app', f), join(OUT, f));

	console.log('4/4 Adding the hosting settings...');
	writeFileSync(join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
	// Forms need a server. On this copy they answer with a clearly labelled demo message instead of an error.
	mkdirSync(join(OUT, 'api'), { recursive: true });
	writeFileSync(
		join(OUT, 'api', 'demo.js'),
		"module.exports = (req, res) => { res.setHeader('Cache-Control', 'no-store'); res.status(200).json({ success: true, data: { priority: false }, message: 'Review copy: nothing was sent or saved.' }); };\n",
	);
	writeFileSync(
		join(OUT, 'vercel.json'),
		JSON.stringify(
			{
				cleanUrls: true,
				trailingSlash: false,
				rewrites: [{ source: '/api/:path*', destination: '/api/demo' }],
				headers: [
					{ source: '/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
					{ source: '/_next/static/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
				],
			},
			null,
			2,
		) + '\n',
	);
	if (!existsSync(join(OUT, 'index.html'))) throw new Error('The snapshot has no index.html: something went wrong.');
	console.log(`\nDone. Upload this folder:  ${OUT}`);
}

main().catch((e) => {
	console.error('Snapshot failed:', e.message);
	process.exit(1);
});
