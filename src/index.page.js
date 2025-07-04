export const layout = "index-layout.vto";
export const titel = "postpost";
export const openGraphLayout = "/og_billede_normal_side.jsx";

export default function* ({ search, paginate }) {
  const posts = search.pages("type=opslag|svar udgivet=ja", "dato=desc");
  const options = {
    url: (n) => n === 1 ? '/' : `/side/${n}/`,
    size: 6,
  };

  for (const page of paginate(posts, options)) {
    yield page;
  }
}