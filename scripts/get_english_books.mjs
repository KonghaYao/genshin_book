import cheerio from "cheerio";
import fse from "fs-extra";
fetch("https://genshin-impact.fandom.com/wiki/Book")
  .then((res) => res.text())
  .then((res) => {
    const $ = cheerio.load(res);
    const table = $(".article-table").toArray()[0];
    return $(" tr > td:nth-child(2) >a", table)
      .toArray()
      .map((i) => {
        const item = $(i);
        return {
          link: item.attr("href"),
          name: item.text(),
        };
      });
  })
  .then(async (res) => {
    console.log(res.name);
    for (const { link, name } of res) {
      const html = await fetch("https://genshin-impact.fandom.com" + link).then(
        (res) => res.text()
      );
      const $ = cheerio.load(html);
      const section = $("div.mw-parser-output")
        .children()
        .toArray()
        .reduce((col, cur) => {
          if (cur.tagName.toLowerCase() === "h2") {
            col.push({
              name: $($(cur).children()[0]).text(),
              text: [],
            });
          } else if (cur.tagName.toLowerCase() === "p") {
            if (col[col.length - 1] !== undefined) {
              col[col.length - 1].text.push($(cur).text());
            }
          }
          return col;
        }, [])
        .filter((i) => i?.text?.length);
      fse.outputJSON("./book/english/" + name + ".json", { name, section });
    }
  });
