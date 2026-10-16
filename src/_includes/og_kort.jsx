/** @jsxImportSource npm:react@18.2.0 */
// Fælles opbygning af og-billederne (de billeder der vises, når et link deles).
// Bruges af og_billede_opslag.jsx, og_billede_kunstner.jsx og og_billede_normal_side.jsx.

import { create } from "lume/deps/sharp.ts";

const lilla = "#6d28d9"; // violet-700, som postpost-logoet
const lillaMoerk = "#4c1d95"; // violet-900
const tekst = "#18181b"; // zinc-900
const tekstSvag = "#3f3f46"; // zinc-700
const ramme = "#52525b"; // zinc-600

// Gør html/markdown/entiteter i titler og tekster til ren tekst
export function renTekst(vaerdi, maks) {
	if (!vaerdi) return "";
	let s = String(vaerdi)
		.replace(/<[^>]+>/g, " ")
		.replace(/(\*\*|\*|__|_)(\S(?:.*?\S)?)\1/g, "$2")
		.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&quot;/g, '"')
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/\s+/g, " ")
		.trim();
	if (maks && s.length > maks) {
		s = s.slice(0, maks).replace(/\s+\S*$/, "") + " …";
	}
	return s;
}

const billedCache = new Map();

// Læser et billede fra src/, beskærer det og returnerer det som data-URL til satori
export async function billedeSomDataUrl(sti, bredde, hoejde = bredde) {
	if (!sti || !sti.startsWith("/") || sti.endsWith(".svg")) return undefined;
	const noegle = `${sti}:${bredde}x${hoejde}`;
	if (billedCache.has(noegle)) return billedCache.get(noegle);

	let dataUrl;
	try {
		const fil = await Deno.readFile(new URL(`../${decodeURI(sti).slice(1)}`, import.meta.url));
		// Fritlagte billeder (med gennemsigtighed) skal ikke beskæres, men passes ind
		const { hasAlpha } = await create(fil).metadata();
		const png = await create(fil)
			.resize(bredde, hoejde, {
				fit: hasAlpha ? "contain" : "cover",
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			})
			.png()
			.toBuffer();
		dataUrl = `data:image/png;base64,${png.toString("base64")}`;
	} catch {
		dataUrl = undefined;
	}
	billedCache.set(noegle, dataUrl);
	return dataUrl;
}

// Samme logik som Kunstnerbillede-komponenten: CMS-billede, gif eller /billeder/kunstnere/{id}.*
export async function kunstnerportraet(kunstner, stoerrelse) {
	if (!kunstner) return undefined;
	const muligheder = kunstner.billede
		? [kunstner.billede]
		: kunstner.gif
		? [`/billeder/kunstnere/${kunstner.id}.gif`]
		: ["jpg", "jpeg", "png", "webp"].map((e) => `/billeder/kunstnere/${kunstner.id}.${e}`);
	for (const sti of muligheder) {
		const url = await billedeSomDataUrl(sti, stoerrelse);
		if (url) return url;
	}
}

// Opslagets billede: "ogbillede" i front matter (en sti, eller "nej" for intet billede),
// ellers den første billedblok fra CMS'et eller det første <img> i skabelonen
export function opslagetsBillede(data) {
	if (data.ogbillede === "nej" || data.ogbillede === false) return undefined;
	if (data.ogbillede) return data.ogbillede;
	const blok = data.afsnit?.find?.((b) => b.type === "billede" && b.fil);
	if (blok) return blok.fil;
	const match = String(data.content ?? "").match(
		/<img[^>]+src="(\/billeder\/[^"{}]+\.(?:jpe?g|png|webp))"/i,
	);
	return match?.[1];
}

function Ordmaerke({ stoerrelse = 52 }) {
	return (
		<div
			style={{
				display: "flex",
				fontSize: stoerrelse,
				lineHeight: 1,
				backgroundImage: `linear-gradient(to bottom, ${lilla}, ${lillaMoerk})`,
				backgroundClip: "text",
				color: "transparent",
				paddingBottom: 8,
			}}
		>
			postpost
		</div>
	);
}

function Rundt({ src, stoerrelse }) {
	return (
		<img
			src={src}
			width={stoerrelse}
			height={stoerrelse}
			style={{
				width: stoerrelse,
				height: stoerrelse,
				borderRadius: stoerrelse,
				backgroundColor: lillaMoerk,
			}}
		/>
	);
}

function titelStoerrelse(titel, smal) {
	const n = titel.length;
	const basis = smal ? 64 : 76;
	if (n > 90) return basis - 24;
	if (n > 55) return basis - 14;
	return basis;
}

// Selve kortet. Alle felter er valgfrie undtagen titel.
export function Kort({ titel, tekst: broedtekst, kunstnernavn, portraet, billede, stortPortraet }) {
	const smal = Boolean(billede || stortPortraet);
	return (
		<div
			style={{
				display: "flex",
				width: "100%",
				height: "100%",
				padding: 36,
				backgroundColor: "#d4d4d8",
				fontFamily: "garamond",
			}}
		>
			<div
				style={{
					display: "flex",
					width: "100%",
					height: "100%",
					borderRadius: 24,
					border: `10px solid ${ramme}`,
					backgroundImage: "linear-gradient(to bottom, #d4d4d8, #a1a1aa)",
					padding: 48,
					gap: 48,
				}}
			>
				<div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
					<Ordmaerke />

					<div style={{ display: "flex", alignItems: "center", gap: 40 }}>
						{stortPortraet && <Rundt src={stortPortraet} stoerrelse={200} />}
						<div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
							<div style={{ display: "flex", fontSize: titelStoerrelse(titel, smal), lineHeight: 1.1, color: tekst }}>
								{titel}
							</div>
							{broedtekst && (
								<div style={{ display: "flex", fontSize: 30, lineHeight: 1.4, color: tekstSvag, marginTop: 20 }}>
									{broedtekst}
								</div>
							)}
						</div>
					</div>

					{kunstnernavn
						? (
							<div style={{ display: "flex", alignItems: "center", gap: 20 }}>
								{portraet && <Rundt src={portraet} stoerrelse={84} />}
								<div style={{ display: "flex", fontSize: 34, color: tekst }}>{kunstnernavn}</div>
							</div>
						)
						: <div style={{ display: "flex" }} />}
				</div>

				{billede && (
					<div style={{ display: "flex", alignItems: "center" }}>
						<img
							src={billede}
							width={440}
							height={440}
							style={{ width: 440, height: 440, borderRadius: 16 }}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
