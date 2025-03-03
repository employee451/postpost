import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import relations from "lume/plugins/relations.ts";
import sitemap from "lume/plugins/sitemap.ts";
import date from "lume/plugins/date.ts";
import { da } from "npm:date-fns/locale/da";
import transformImages from "lume/plugins/transform_images.ts";
import robots from "lume/plugins/robots.ts";

const site = lume({
	src: './src',
	location: new URL("https://post-post.dk")
});

site.use(tailwindcss({
	extensions: ['.vto', '.html']
}));
site.use(postcss());
site.use(sitemap());
site.use(date({
	locales: { da },
}));

site.copy("kodederskalgoereting-2025-03-04.js");

site.use(transformImages());

site.use(relations({
	foreignKeys: {
		opslag: "opslag_id",
		person: "person_id",
	  }
}));

site.use(robots());

site.copy("vejret/maane.svg");
site.copy("vejret/regnsky.svg");
site.copy("vejret/regnskyogsol.svg");
site.copy("vejret/sky.svg");
site.copy("vejret/skyogmaane.svg");
site.copy("vejret/skyogsol.svg");
site.copy("vejret/sneogsol.svg");
site.copy("vejret/sol.svg");

export default site;
