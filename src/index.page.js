export const layout = "index-layout.vto";

export default function* ({ search, paginate }) {
  const posts = search.pages("type=opslag", "dato=desc");
  const options = {
    url: (n) => n === 1 ? '/' : `/side/${n}/`,
    size: 3,
  };

  for (const page of paginate(posts, options)) {
    yield page;
  }
}