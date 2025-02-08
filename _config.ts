import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import relations from "lume/plugins/relations.ts";
import sitemap from "lume/plugins/sitemap.ts";

const site = lume({
	src: './src',
	location: new URL("https://post-post.dk")
});

site.use(tailwindcss({
	extensions: ['.vto', '.html']
}));
site.use(postcss());
site.use(sitemap())

site.use(relations({
	foreignKeys: {
		opslag: "opslag_id",
		person: "person_id",
	  }
}));

export default site;
