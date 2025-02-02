import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import relations from "lume/plugins/relations.ts";
import sitemap from "lume/plugins/sitemap.ts";

const site = lume({
	src: './src',
});

site.use(tailwindcss({
	extensions: ['.vto', '.html']
}));
site.use(postcss());
site.use(sitemap({
	hostname: "https://www.kristianmandrup.dk",
	prettyUrls: true,
}))

site.use(relations({
	foreignKeys: {
		opslag: "opslag_id",
		person: "person_id",
	  }
}));

export default site;
