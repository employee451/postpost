/** @jsxImportSource npm:react@18.2.0 */
import { Kort, renTekst } from "./og_kort.jsx";

export default function (data) {
	const { titel, beskrivelse } = data;
	const forsiden = !titel || titel === "postpost";

	return (
		<Kort
			titel={forsiden ? "Et åbent, kollektivt, ikke-fysisk værelse for kunst" : renTekst(titel, 110)}
			tekst={renTekst(forsiden ? "Lyd, video, grafik, tekst, musik, essay, maleri, digt, råb, prosa …" : beskrivelse, 200)}
		/>
	);
}
