import { useLanguage } from "../i18n/useLanguage";
import { COMMON } from "../i18n/common";
import { useAuth } from "../auth/useAuth";
import Portal from "./Portal";
import "./FirstLoginRewardPopup.css";

// Popup de bienvenue affichée une seule fois, la toute première fois qu'un
// joueur se connecte (jeu ou site, peu importe lequel des deux déclenche le
// crédit en premier - voir currencyModel.claimFirstLoginReward, idempotent
// côté backend). AuthProvider ne pose firstLoginReward que lorsque le
// backend répond credited:true, donc ce popup ne peut apparaître qu'une
// seule fois dans la vie d'un compte, jamais sur les connexions suivantes.
const FirstLoginRewardPopup = () => {
	const { language } = useLanguage();
	const t = COMMON[language];
	const { firstLoginReward, dismissFirstLoginReward } = useAuth();

	if (firstLoginReward === null) return null;

	return (
		<Portal>
			<div className="first-login-reward-overlay" onClick={dismissFirstLoginReward}>
				<div className="first-login-reward-modal" onClick={(e) => e.stopPropagation()}>
					<h2>{t.firstLoginRewardTitle}</h2>
					<p>{t.firstLoginRewardText.replace("{amount}", String(firstLoginReward))}</p>
					<button type="button" className="btn btn-primary" onClick={dismissFirstLoginReward}>
						{t.firstLoginRewardClaim}
					</button>
				</div>
			</div>
		</Portal>
	);
};

export default FirstLoginRewardPopup;
