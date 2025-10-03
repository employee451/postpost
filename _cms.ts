import "jsr:@std/dotenv/load";
import lumeCMS from "lume/cms/mod.ts";
import GitHub from "lume/cms/storage/github.ts";

const cms = lumeCMS({
	site: {
		name: "postpost redaktionen",
		url: "https://post-post.dk",
		body: `
		<p>halllooooo. dette er vores indholdsmanagementsystem, hvilket er et virkelig kedeligt ord. håber alt virker, og ellers så smid mig en besked. kh aske<3</p>
		`,
	},
	auth: {
		method: "basic",
		users: {
			sigurd: "sigurdersej",
			aske: "askeersej",
			julius: "juliusersej",
		},
	},
});

const token = Deno.env.get("GITHUB_ACCESS_TOKEN");
cms.storage("gh", GitHub.create("employee451/postpost", token!));

cms.collection("opslag", "src:opslag/*.vto", [
  "titel: text",
  "dato: date",
  "kunstner_id: text",
  "udgivet: checkbox",
  "uddrag: textarea",
  "content: markdown",
]);

cms.collection("opslag", "src:opslag/*.vto", [
  "titel: text",
  "dato: date",
  "kunstner_id: text",
  "udgivet: checkbox",
  "uddrag: textarea",
  "content: markdown",
]);

cms.collection("kunstnere", "src:kunstnere/*.vto", [
  "id: text",
  "titel: text",
  "hurtigtekst: textarea",
  "udgivet: checkbox",
  "content: markdown",
]);

export default cms;