import { BadgeCheck, Check, Tag } from 'lucide-react';

const waves = [0, -0.2, -0.5, -0.1, -0.7, -0.3, -0.9, -0.4, -0.6, -0.15];
const line = (w: number, light = 'bg-mist-deep') => <span className={`block h-2 rounded ${light}`} style={{ width: `${w}%` }} />;

/** The animated scenes of "How we work", adapted from Busola's concept. Scene `i` belongs to step `i`. Give each a `key` so it replays. */
export function HowScene({ i }: { i: number }) {
	if (i === 0) {
		return (
			<div className="scene-pop relative w-[19rem] rounded-3xl bg-white p-6 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] [transform:rotateY(-10deg)_rotateX(6deg)] sm:w-[22rem]">
				<div className="flex justify-between text-xs font-bold tracking-wide text-ink-soft"><span>STEP 1 OF 4</span><span>~5 MIN</span></div>
				<div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-mist-deep"><div className="h-full w-1/4 origin-left rounded-full bg-accent-btn [animation:fwc-fill_1.2s_both]" /></div>
				<p className="mt-5 text-xl leading-tight font-black text-ink">Where is your business today?</p>
				<div className="mt-4 grid gap-2.5 text-[0.9375rem] font-semibold">
					<span className="rounded-xl border-[1.5px] border-ink/15 px-4 py-3 text-ink">Idea / pre-launch</span>
					<span className="scene-pick relative rounded-xl border-[1.5px] border-ink/15 px-4 py-3">
						Operating, 1–5 years
						<svg className="scene-cursor absolute right-8 -bottom-2" width="22" height="22" viewBox="0 0 24 24" aria-hidden><path d="M4 2l16 9-7 2-3 7z" fill="#1b1b1b" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>
					</span>
					<span className="rounded-xl border-[1.5px] border-ink/15 px-4 py-3 text-ink">Foreign entity entering Nigeria</span>
				</div>
			</div>
		);
	}
	if (i === 1) {
		return (
			<div className="scene-pop grid w-[19rem] justify-items-center gap-5 sm:w-[22rem]">
				<div className="flex items-center gap-4 rounded-full bg-accent-btn py-2.5 pr-6 pl-2.5 text-white shadow-[0_20px_40px_-14px_rgb(0_0_0/0.6)]">
					<span className="relative grid size-12 place-items-center rounded-full bg-white">
						<span className="scene-ring absolute inset-0 rounded-full border-2 border-white" />
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b57ee" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
					</span>
					<span><span className="block text-sm font-black">Discovery call</span><span className="block text-xs font-semibold">15:00 · we listen</span></span>
					<span className="flex h-6 items-center gap-[3px]">{waves.map((d) => <span key={d} className="scene-wave h-6 w-[3px] rounded bg-white" style={{ animationDelay: `${d}s` }} />)}</span>
				</div>
				<p className="rounded-2xl bg-white/10 px-5 py-3 text-center text-sm font-semibold text-white/85">Free · no hard sell · we ask, you talk</p>
			</div>
		);
	}
	if (i === 2) {
		return (
			<div className="scene-pop w-[19rem] rounded-3xl bg-white p-6 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] sm:w-[21rem]">
				<div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-accent/15 text-accent-deep"><Tag className="size-5" /></span><div><p className="text-[0.6875rem] font-black tracking-[0.14em] text-accent-deep">DIAGNOSTIC REPORT</p><p className="text-lg font-black text-ink">Fee confirmed first</p></div></div>
				<div className="mt-5 grid gap-2">{line(100)}{line(86)}{line(64)}</div>
				<div className="mt-6 flex items-center justify-between rounded-2xl bg-mist p-3.5 text-sm font-bold text-ink">
					<span>Your go-ahead</span>
					<span className="relative h-7 w-12 rounded-full bg-accent-btn"><span className="absolute top-0.5 right-0.5 grid size-6 place-items-center rounded-full bg-white text-accent-deep [animation:fwc-pop_0.6s_0.8s_both]"><Check className="size-3.5" strokeWidth={3} /></span></span>
				</div>
				<p className="mt-3 text-xs text-ink-soft">Nothing starts until you say go.</p>
			</div>
		);
	}
	if (i === 3) {
		return (
			<div className="scene-pop relative h-[20rem] w-[19rem] sm:w-[21rem]">
				<div className="absolute top-8 left-6 h-64 w-60 rotate-[-6deg] rounded-2xl bg-[#e9e9f7] p-5 shadow-2xl"><p className="text-[0.6875rem] font-black tracking-[0.14em] text-ink-soft">SERVICES &amp; PRICING</p><div className="mt-3 grid gap-2">{line(90, 'bg-[#cfcfe8]')}{line(70, 'bg-[#cfcfe8]')}</div></div>
				<div className="absolute top-8 left-14 h-64 w-60 rotate-[5deg] rounded-2xl bg-[#f4f4fc] p-5 shadow-2xl"><p className="text-[0.6875rem] font-black tracking-[0.14em] text-ink-soft">THE SOLUTION</p><div className="mt-3 grid gap-2">{line(85, 'bg-[#d9d9ee]')}{line(60, 'bg-[#d9d9ee]')}</div></div>
				<div className="absolute top-8 left-10 flex h-64 w-60 flex-col rounded-2xl bg-white p-5 shadow-[0_30px_60px_-24px_rgb(0_0_0/0.6)]">
					<p className="text-[0.6875rem] font-black tracking-[0.14em] text-accent-deep">DIAGNOSTIC REPORT</p>
					<p className="mt-2 text-xl font-black text-ink">The problem</p>
					<div className="mt-3 grid gap-2">{line(100)}{line(88)}{line(94)}{line(60)}</div>
					<div className="mt-auto flex items-center justify-between text-[0.8125rem] font-bold text-ink"><span>Fee</span><span className="text-accent-deep">Agreed before work</span></div>
				</div>
			</div>
		);
	}
	return (
		<div className="relative h-[20rem] w-[20rem] sm:w-[23rem]">
			<div className="scene-pop absolute top-4 left-2 flex h-72 w-56 -rotate-[4deg] flex-col rounded-2xl bg-white p-5 shadow-[0_30px_60px_-24px_rgb(0_0_0/0.6)]">
				<p className="text-[0.6875rem] font-black tracking-[0.14em] text-ink-soft">ENGAGEMENT AGREEMENT</p>
				<div className="mt-3 grid gap-2">{line(100)}{line(92)}{line(96)}{line(70)}</div>
				<svg className="scene-sign mt-auto" width="170" height="44" viewBox="0 0 180 50" aria-hidden><path d="M4 36c14-20 22-26 26-18s-8 22 0 18 14-24 20-16-2 18 6 14 10-14 16-10 4 10 12 8 18-10 30-12 30 2 56-4" fill="none" stroke="#1f2a44" strokeWidth="2.4" strokeLinecap="round" /></svg>
				<span className="h-px bg-ink/25" /><p className="mt-1.5 text-[0.6875rem] text-ink-soft">Signed by client &amp; FWC</p>
			</div>
			<div className="absolute top-14 right-0 flex h-64 w-48 flex-col rounded-2xl border border-ink/10 bg-white p-5 shadow-[0_40px_80px_-24px_rgb(0_0_0/0.7)] [animation:fwc-pop_0.9s_1s_both]">
				<p className="text-[0.625rem] font-black tracking-[0.14em] text-accent-deep">SECURED BY FWC</p>
				<p className="mt-4 text-[0.625rem] font-semibold tracking-[0.18em] text-ink-soft">CERTIFICATE</p>
				<p className="mt-1 text-2xl leading-tight font-black text-ink">Your licence</p>
				<span className="scene-stamp mt-auto grid size-[5.5rem] place-items-center self-end rounded-full border-[3px] border-accent-btn text-center text-xs font-black tracking-widest text-accent-deep"><span><BadgeCheck className="mx-auto mb-0.5 size-5" />ISSUED</span></span>
			</div>
		</div>
	);
}
