export const layout = "index-layout-nyt.vto";
export const titel = "postpost";
export const openGraphLayout = "/og_billede_normal_side.jsx";

export default function* ({ search, paginate }) {
  const posts = search.pages("type=opslag|svar udgivet=nej", "dato=desc");
  const options = {
    url: (n) => n === 1 ? '/nyt/index.html' : `/nyt/side/${n}/`,
    size: 5,
  };

  for (const page of paginate(posts, options)) {
    yield page;
  }
}