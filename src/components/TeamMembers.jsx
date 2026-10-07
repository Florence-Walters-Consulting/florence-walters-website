import { useTeams } from '../hooks/useTeams';

export default function TeamMembers() {
	const { data, isLoading, error } = useTeams();
	const teams = data?.data ?? [];
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
			{isLoading && (
				<div className="about-team-loading" aria-label="Loading team members" />
			)}
			{error && (
				<p className="about-team-error">Unable to load team members.</p>
			)}
			<div className="about-team-grid">
				{teams.map((member) => (
					<article key={member.id}>
						<img
							className="about-team-photo"
							src={`/site_img/team/${member.picture}`}
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
