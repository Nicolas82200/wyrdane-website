import { useState, type FormEvent } from "react";

import api from "../api";
import { useLanguage } from "../i18n/useLanguage";
import { CONTACT_CONTENT, type ContactCategory } from "../i18n/contact";
import "./ContentPage.css";
import "./Contact.css";

type Status = "idle" | "submitting" | "success" | "error";

const Contact = () => {
	const { language } = useLanguage();
	const t = CONTACT_CONTENT[language];

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [category, setCategory] = useState<ContactCategory>("bug");
	const [portfolioLink, setPortfolioLink] = useState("");
	const [message, setMessage] = useState("");
	const [website, setWebsite] = useState("");
	const [status, setStatus] = useState<Status>("idle");

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setStatus("submitting");
		try {
			await api.post("/contact", {
				name,
				email,
				category,
				portfolioLink: category === "illustrator" ? portfolioLink : undefined,
				message,
				website,
			});
			setStatus("success");
			setName("");
			setEmail("");
			setPortfolioLink("");
			setMessage("");
		} catch {
			setStatus("error");
		}
	};

	return (
		<div className="content-page">
			<div className="content-panel contact-panel">
				<h1>{t.title}</h1>
				<p className="content-subtitle">{t.subtitle}</p>
				<hr className="content-sep" />

				<form className="contact-form" onSubmit={handleSubmit}>
					<div className="item">
						<label htmlFor="contact-name">{t.nameLabel}</label>
						<input
							id="contact-name"
							type="text"
							placeholder={t.namePlaceholder}
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>

					<div className="item">
						<label htmlFor="contact-email">{t.emailLabel}</label>
						<input
							id="contact-email"
							type="email"
							placeholder={t.emailPlaceholder}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div className="item">
						<label htmlFor="contact-category">{t.categoryLabel}</label>
						<select
							id="contact-category"
							value={category}
							onChange={(e) => setCategory(e.target.value as ContactCategory)}
						>
							{Object.entries(t.categories).map(([value, label]) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</select>
					</div>

					{category === "illustrator" && (
						<div className="item">
							<label htmlFor="contact-portfolio">{t.portfolioLabel}</label>
							<input
								id="contact-portfolio"
								type="text"
								placeholder={t.portfolioPlaceholder}
								value={portfolioLink}
								onChange={(e) => setPortfolioLink(e.target.value)}
							/>
						</div>
					)}

					<div className="item">
						<label htmlFor="contact-message">{t.messageLabel}</label>
						<textarea
							id="contact-message"
							placeholder={t.messagePlaceholder}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							rows={6}
							required
						/>
					</div>

					{/* Honeypot anti-spam : masqué en CSS, jamais rempli par un humain */}
					<div className="contact-honeypot" aria-hidden="true">
						<label htmlFor="contact-website">Website</label>
						<input
							id="contact-website"
							type="text"
							tabIndex={-1}
							autoComplete="off"
							value={website}
							onChange={(e) => setWebsite(e.target.value)}
						/>
					</div>

					{status === "success" && <p className="contact-success">{t.success}</p>}
					{status === "error" && <p className="contact-error">{t.error}</p>}

					<input
						type="submit"
						value={status === "submitting" ? t.submitting : t.submit}
						disabled={status === "submitting"}
					/>
				</form>
			</div>
		</div>
	);
};

export default Contact;
