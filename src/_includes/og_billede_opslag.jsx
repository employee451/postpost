/** @jsxImportSource npm:react@18.2.0 */
import { billedeSomDataUrl, Kort, kunstnerportraet, opslagetsBillede, renTekst } from "./og_kort.jsx";

export default async function (data) {
	const { titel, uddrag, kunstner, korrespondance } = data;
	const billede = await billedeSomDataUrl(opslagetsBillede(data), 440);
	const tekst = renTekst(uddrag || korrespondance?.uddrag, billede ? 120 : 170);

	return (
		<Kort
			titel={renTekst(titel, 110)}
			tekst={tekst}
			kunstnernavn={renTekst(kunstner?.titel)}
			portraet={await kunstnerportraet(kunstner, 168)}
			billede={billede}
		/>
	);
}
