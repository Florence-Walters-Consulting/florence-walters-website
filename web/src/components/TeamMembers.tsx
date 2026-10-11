import { getTeam } from '@/db/queries/content';
import { imageUrl } from '@/lib/images';

export default async function TeamMembers() {
	const teams = await getTeam();

	return (
		<section className="about-team">
			<div className="about-team-head">
				<span className="eyebrow eyebrow-with-line">OUR TEAM</span>
				<h2>Meet Our Experts</h2>
				<p>
					We are a team of experienced professionals dedicated to
					<br />
					helping businesses succeed.
				</p>
			</div>
			<div className="about-team-grid">
				{teams.map((member) => (
					<article key={member.id}>
						<img
							className="about-team-photo"
							src={imageUrl('team', member.picture)}
							alt={member.name}
							loading="lazy"
						/>
						<div className="about-team-info">
							<div>
								<h3>{member.name}</h3>
								<p>{member.position}</p>
							</div>
							{member.link && (
								<a
									href={member.link}
									target="_blank"
									rel="noreferrer"
									aria-label={`${member.name} on LinkedIn`}>
									in
								</a>
							)}
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
