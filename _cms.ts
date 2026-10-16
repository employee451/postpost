import "jsr:@std/dotenv/load";
import lumeCMS from "lume/cms/mod.ts";
import type Site from "lume/core/site.ts";

const brugere = Object.fromEntries(
	(Deno.env.get("CMS_BRUGERE") ?? "")
		.split(",")
		.map((bruger) => bruger.trim().split(":"))
		.filter(([navn, kode]) => navn && kode),
);

const cms = lumeCMS({
	site: {
		name: "postpost redaktionen",
		url: "https://post-post.dk",
		body: `
		<p>halllooooo. dette er vores indholdsmanagementsystem, hvilket er et virkelig kedeligt ord. håber alt virker, og ellers så smid mig en besked. kh aske<3</p>
		`,
	},
	auth: Object.keys(brugere).length
		? { method: "basic", users: brugere }
		: undefined,
});

cms.git();

// Uploads -------------------------------------------------------------------

cms.upload({
	name: "billeder",
	label: "billeder",
	store: "src:billeder/**/*.{jpg,jpeg,png,gif,webp,svg,avif,JPG,JPEG,PNG,GIF}",
});

cms.upload({
	name: "kunstnerbilleder",
	label: "kunstnerbilleder",
	store: "src:billeder/kunstnere/*.{jpg,jpeg,png,gif,webp,JPG,JPEG,PNG,GIF}",
});

cms.upload({
	name: "lyd",
	label: "lyd",
	store: "src:musik/*.{mp3,wav,ogg,m4a}",
});

cms.upload({
	name: "videoer",
	label: "videoer",
	store: "src:videoer/*.{mp4,mov,webm}",
});

// Felter der går igen -------------------------------------------------------

function site(content: { data: Record<string, unknown> }): Site {
	return content.data.site as Site;
}

const titel = {
	name: "titel",
	type: "text",
	label: "titel",
	attributes: { required: true },
} satisfies Lume.CMS.Field;

const dato = {
	name: "dato",
	type: "date",
	label: "dato",
	init(field, _content, data) {
		// Nye opslag får dags dato
		if (!data) field.value = new Date().toISOString().slice(0, 10);
	},
} satisfies Lume.CMS.Field;

const udgivet = {
	name: "udgivet",
	type: "select",
	label: "udgivet",
	value: "nej",
	options: ["nej", "ja"],
} satisfies Lume.CMS.Field;

const uddrag = {
	name: "uddrag",
	type: "textarea",
	label: "uddrag",
} satisfies Lume.CMS.Field;

const kunstner = {
	name: "kunstner_id",
	type: "select",
	label: "kunstner",
	options: [],
	init(field, content) {
		field.options = [
			{ value: "", label: "ingen" },
			...site(content).search.pages("type=kunstner", "titel")
				.map((k) => ({ value: String(k.id), label: String(k.titel) })),
		];
	},
} satisfies Lume.CMS.Field;

const sang = {
	name: "sang",
	type: "text",
	label: "sang",
} satisfies Lume.CMS.Field;

const tekststoerrelse = {
	name: "tekststoerrelse",
	type: "select",
	label: "tekststørrelse",
	options: [
		{ value: "", label: "normal" },
		{ value: "lille", label: "lille" },
	],
} satisfies Lume.CMS.Field;

const linjeafstande = ["1", "1.1", "1.15", "1.25", "1.5", "1.625", "1.75", "2", "2.5", "3"]
	.map((value) => ({ value, label: value.replace(".", ",") }));

const linjeafstand = {
	name: "linjeafstand",
	type: "select",
	label: "linjeafstand",
	options: [
		{ value: "", label: "normal (1,625)" },
		...linjeafstande.filter(({ value }) => value !== "1.625"),
	],
} satisfies Lume.CMS.Field;

const afsnit = {
	name: "afsnit",
	type: "choose-list",
	label: "indhold",
	fields: [
		{
			name: "tekst",
			type: "object",
			label: "tekst",
			fields: [
				{ name: "titel", type: "text", label: "overskrift" },
				{ name: "tekst", type: "markdown", label: "tekst", upload: "billeder" },
				{
					name: "linjeafstand",
					type: "select",
					label: "linjeafstand",
					options: [{ value: "", label: "som opslaget" }, ...linjeafstande],
				},
			],
		},
		{
			name: "billede",
			type: "object",
			label: "billede",
			fields: [
				{ name: "fil", type: "file", label: "billede", upload: "billeder" },
				{ name: "alt", type: "text", label: "alt-tekst" },
				{ name: "billedtekst", type: "text", label: "billedtekst" },
			],
		},
		{
			name: "lyd",
			type: "object",
			label: "lyd",
			fields: [
				{ name: "fil", type: "file", label: "lyd", upload: "lyd" },
			],
		},
		{
			name: "video",
			type: "object",
			label: "video",
			fields: [
				{ name: "fil", type: "file", label: "video", upload: "videoer" },
				{ name: "autoplay", type: "checkbox", label: "autoplay" },
			],
		},
		{
			name: "kasse",
			type: "object",
			label: "ny kasse",
			fields: [{ name: "overskrift", type: "text", label: "overskrift" }],
		},
		{
			name: "skillelinje",
			type: "object",
			label: "skillelinje",
			fields: [],
		},
		{
			name: "html",
			type: "object",
			label: "html",
			fields: [
				{ name: "html", type: "code", label: "html", attributes: { data: { language: "HTML" } } },
			],
		},
	],
} satisfies Lume.CMS.Field;

const intro = {
	name: "intro",
	type: "textarea",
	label: "intro",
} satisfies Lume.CMS.Field;

const itsanamechanger = {
	name: "itsanamechanger",
	type: "text",
	label: "itsanamechanger",
	view: "avanceret",
} satisfies Lume.CMS.Field;

const html = {
	name: "content",
	type: "code",
	label: "html",
	view: "avanceret",
	attributes: { data: { language: "HTML" } },
} satisfies Lume.CMS.Field;

function filnavn(mappe: string, tekst: string): string {
	const slug = tekst
		.replace(/<[^>]*>/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9æøå]+/g, "-")
		.replace(/^-+|-+$/g, "") || "opslag";

	for (let n = 1; ; n++) {
		const navn = n === 1 ? `${slug}.vto` : `${slug}-${n}.vto`;
		try {
			Deno.statSync(new URL(`./src/${mappe}/${navn}`, import.meta.url));
		} catch {
			return navn;
		}
	}
}

// Opslag --------------------------------------------------------------------

cms.collection({
	name: "opslag",
	label: "opslag",
	store: "src:opslag/*.vto",
	documentName: (data) => filnavn("opslag", String(data.titel ?? "")),
	documentLabel: (name) => name.replace(/\.vto$/, ""),
	views: [],
	fields: [
		titel,
		dato,
		kunstner,
		udgivet,
		uddrag,
		intro,
		afsnit,
		tekststoerrelse,
		linjeafstand,
		sang,
		itsanamechanger,
		html,
	],
});

// Korrespondancer -----------------------------------------------------------

cms.collection({
	name: "korrespondancer",
	label: "korrespondancer",
	store: "src:opslag/*/index.vto",
	documentName: (data) => `${data.id}/index.vto`,
	documentLabel: (name) => name.replace(/\/index\.vto$/, ""),
	views: [],
	fields: [
		{ name: "type", type: "hidden", value: "korrespondance" },
		{
			name: "id",
			type: "text",
			label: "id",
			attributes: { required: true, pattern: "[a-z0-9\\-]+" },
		},
		titel,
		dato,
		udgivet,
		uddrag,
		afsnit,
		sang,
		html,
	],
});

cms.collection({
	name: "korrespondance-svar",
	label: "svar",
	store: "src:opslag/*/svar-*.vto",
	documentName(data) {
		// Næste ledige nummer i korrespondancens mappe: svar-1.vto, svar-2.vto, ...
		const mappe = String(data.korrespondance_id);
		for (let n = 1; ; n++) {
			try {
				Deno.statSync(new URL(`./src/opslag/${mappe}/svar-${n}.vto`, import.meta.url));
			} catch {
				return `${mappe}/svar-${n}.vto`;
			}
		}
	},
	documentLabel: (name) => name.replace(/\.vto$/, "").replace("/svar-", " · svar "),
	rename: false,
	views: [],
	fields: [
		{ name: "type", type: "hidden", value: "svar" },
		{
			name: "korrespondance_id",
			type: "select",
			label: "korrespondance",
			options: [],
			attributes: { required: true },
			init(field, content) {
				field.options = site(content).search.pages("type=korrespondance", "dato=desc")
					.map((k) => ({ value: String(k.id), label: String(k.titel) }));
			},
		},
		{ ...titel, attributes: {} },
		dato,
		kunstner,
		udgivet,
		afsnit,
		tekststoerrelse,
		linjeafstand,
		html,
	],
});

// Kunstnere -----------------------------------------------------------------

cms.collection({
	name: "kunstnere",
	label: "kunstnere",
	store: "src:kunstnere/*.vto",
	documentName: "{id}.vto",
	documentLabel: (name) => name.replace(/\.vto$/, ""),
	fields: [
		{
			name: "id",
			type: "text",
			label: "id",
			attributes: { required: true, pattern: "[a-z0-9_\\-]+" },
		},
		{ name: "titel", type: "text", label: "navn", attributes: { required: true } },
		{ name: "billede", type: "file", label: "billede", upload: "kunstnerbilleder" },
		{ name: "hurtigtekst", type: "markdown", label: "hurtigtekst", upload: false },
		{ name: "content", type: "markdown", label: "tekst", upload: "billeder" },
		udgivet,
	],
});

// Indstillinger -------------------------------------------------------------

cms.document({
	name: "indstillinger",
	label: "indstillinger",
	store: "src:_data.yml",
	fields: [sang],
});

export default cms;
