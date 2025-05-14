import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
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

const site = lume({
	src: './src',
	location: new URL("https://post-post.dk")
});

site.use(tailwindcss({
	extensions: ['.vto', '.html']
}));
site.use(postcss());
site.use(sitemap({
	query: "isRedirect!=true udgivet!=nej"
}));
site.use(date({
	locales: { da },
}));
site.use(ogImages({
	satori: {
		width: 1200,
		height: 600,
		fonts: [
			{
				name: "georgia",
				weight: 400,
				data: await read(
					"https://github.com/collinhover/learn/raw/refs/heads/master/css/webfonts/georgia.woff",
					true
				),
			},
		],
	},
	cache: true
}));
site.use(metas());

site.copy("kodederskalgoereting-2025-03-04.js");
site.copy("vejret");
site.copy("musik");

site.copy("videoer");

site.use(transformImages());
site.use(jsonLd());

site.use(relations({
	foreignKeys: {
		opslag: "opslag_id",
		korrespondance: "korrespondance_id",
		kunstner: "kunstner_id",
	  }
}));

site.use(robots({
	rules: [
		{
			userAgent: "*",
			disallow: "/nyt",
		},
	],
}));

export default site;
