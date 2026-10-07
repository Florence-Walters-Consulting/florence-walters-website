function PageHeader({ title, heading, text }) {
	return <section className="fwc-page-header">
		<div className="fwc-page-header-content">
			{title && <span className="fwc-page-eyebrow">{title}</span>}
			{heading && <h1>{heading}</h1>}
			{text && <p>{text}</p>}
		</div>
	</section>;
}

export default PageHeader;
