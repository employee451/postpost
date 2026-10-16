import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import relations from "lume/plugins/relations.ts";
import sitemap from "lume/plugins/sitemap.ts";
import date from "lume/plugins/date.ts";
import { da } from "npm:date-fns/locale/da";
import transformImages from "lume/plugins/transform_images.ts";
import robots from "lume/plugins/robots.ts";
import ogImages from "lume/plugins/og_images.ts";
import { read } from "lume/core/utils/read.ts";
import metas from "lume/plugins/metas.ts";
import jsonLd from "lume/plugins/json_ld.ts";
import googleFonts from "lume/plugins/google_fonts.ts";
import picture from "lume/plugins/picture.ts";
import feed from "lume/plugins/feed.ts";
import checkUrls from "lume/plugins/check_urls.ts";
import { markdownIt } from "lume/deps/markdown_it.ts";

// Skift navnet her (og omdøb filen i src/) når browsere skal hente et nyt stilark
const stilark = "/kodederskalsmukkificereting-2026-08-20.css";

const site = lume({
	src: './src',
	location: new URL("https://post-post.dk")
}, {
	markdown: { options: { breaks: true } },
});

site.data("stilark", stilark);

site.add(stilark);
site.add("kodederskalgoereting-2025-03-04.js");
site.add("billeder");
site.add("vejret");
site.add("musik");
site.add("videoer");
site.add("fonte");
site.add("labyrint.gltf");
site.add("opslag/tandem.htm");
site.add("vedtaegter.pdf");

site.use(googleFonts({
	cssFile: stilark,
	placeholder: "/* google-fonte */",
	subsets: ["latin", "latin-ext"],
	fonts: {
		dinfarshvidvin: "https://fonts.google.com/share?selection.family=Montaga",
		garamond: "https://fonts.google.com/share?selection.family=EB+Garamond",
	},
}));

site.use(tailwindcss({ minify: true }));
site.use(robots({
	allow: [],
	rules: [
		{
			userAgent: "*",
			disallow: "/nyt",
		},
	],
}));
site.use(sitemap({
	query: "unlisted!=true udgivet!=nej",
	items: {
		lastmod: (data) => data.dato ?? data.date,
	},
}));
site.use(date({
	locales: { da },
}));
// Billederne der vises, når et link deles. Layouts ligger i src/_includes/og_*.jsx
const garamond = "https://cdn.jsdelivr.net/npm/@fontsource/eb-garamond@5.3.0/files/eb-garamond";
site.use(ogImages({
	options: {
		width: 1200,
		height: 630,
		fonts: await Promise.all(
			[400, 700].flatMap((weight) =>
				["latin", "latin-ext"].map(async (subset) => ({
					name: "garamond",
					weight: weight as 400 | 700,
					data: (await read(`${garamond}-${subset}-${weight}-normal.woff`, true)).buffer,
				}))
			),
		),
	},
}));
site.use(metas());

// RSS- og JSON-feed med de samme opslag som forsiden
site.use(feed({
	output: ["/feed.xml", "/feed.json"],
	query: "type=opslag|svar udgivet=ja",
	sort: "dato=desc",
	limit: 20,
	info: {
		title: "postpost",
		description: "postpost er en samling af kunst. Et sted at kaste dine projekter og idéer hen.",
		lang: "da",
	},
	items: {
		title: "=titel",
		description: "=uddrag || =korrespondance.uddrag",
		published: "=dato",
		content: "$article .overflow-x-hidden",
		image: "=metas.image",
		authorName: "=kunstner.titel",
	},
}));

// Giv et <img> eller <picture> attributten transform-images="webp jpg 300@2",
// så laves de mindre versioner og <picture>-markuppen automatisk. Skal stå før transformImages.
site.use(picture());
site.use(transformImages());

// Tekst-afsnit fra CMS'et: *kursiv*, **fed** og links virker, men ellers vises teksten præcis som skrevet
// (kun inline-markdown, så "- " og "* " i starten af en linje ikke bliver til lister).
// Mellemrum i starten af en linje gøres faste, ellers fjerner markdown dem.
const tekstMarkdown = markdownIt({ html: true });
site.filter("tekst", (tekst = "") =>
	tekstMarkdown.renderInline(
		String(tekst).replace(/^[ \t]+/gm, (indryk) =>
			indryk.replaceAll(" ", "\u00a0").replaceAll("\t", "\u00a0".repeat(8))
		),
	)
);

// Finder et kunstnerbillede ud fra id'et, uanset filendelse. Bruges af Kunstnerbillede-komponenten.
site.filter("kunstnerbillede", (id: string) => {
	for (const endelse of ["jpg", "jpeg", "png", "webp"]) {
		try {
			Deno.statSync(site.src("billeder/kunstnere", `${id}.${endelse}`));
			return `/billeder/kunstnere/${id}.${endelse}`;
		} catch {
			// prøv næste endelse
		}
	}
});

// Lume 3 udgiver også originalerne af de transformerede billeder (flere MB, med EXIF-data).
// Kunstner- og musikbilleder vises kun i de små versioner, så deres originaler fjernes.
// Gif'er og alle andre billeder (fx fra CMS'ets afsnit) udgives stadig.
site.process([".jpg", ".jpeg", ".png", ".webp"], (pages, allPages) => {
	for (const page of pages) {
		const original = page.data.transformImages &&
			/^\/billeder\/(kunstnere|musik)\//.test(page.data.url);
		if (original) {
			allPages.splice(allPages.indexOf(page), 1);
		}
	}
});

site.use(jsonLd());

site.use(relations({
	foreignKeys: {
		opslag: "opslag_id",
		korrespondance: "korrespondance_id",
		kunstner: "kunstner_id",
	  }
}));

// Korrespondance-svar oprettet i CMS'et får id og titel ud fra filnavnet:
// opslag/korrespondance-1/svar-8.vto -> id "korrespondance-1-8", titel "Korrespondance #1.8"
site.preprocess([".vto"], (pages, allPages) => {
	for (const page of pages) {
		const { data } = page;
		const nummer = page.src.path.match(/\/svar-(\d+)$/)?.[1];
		if (data.type !== "svar" || !nummer) continue;

		data.id ??= `${data.korrespondance_id}-${nummer}`;
		if (!data.titel) {
			const korrespondance = allPages.find((p) =>
				p.data.type === "korrespondance" && p.data.id === data.korrespondance_id
			);
			data.titel = `${korrespondance?.data.titel ?? data.korrespondance_id}.${nummer}`;
		}
	}
});

// Advarer om døde links i terminalen, når siden bygges
site.use(checkUrls({ anchors: true }));

export default site;
