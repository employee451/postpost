/** @jsxImportSource npm:react@18.2.0 */
import { Kort, kunstnerportraet, renTekst } from "./og_kort.jsx";

export default async function (data) {
	const { titel, hurtigtekst, id, billede, gif } = data;
	const portraet = await kunstnerportraet({ id, billede, gif }, 400);

	return (
		<Kort
			titel={renTekst(titel, 80)}
			tekst={renTekst(hurtigtekst, portraet ? 130 : 200)}
			stortPortraet={portraet}
		/>
	);
}
