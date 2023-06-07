import cheerio from "cheerio";
import fse from "fs-extra";

fetch(
  "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list?app_sn=ys_obc&channel_id=189",
  {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "sec-ch-ua":
        '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      Referer: "https://bbs.mihoyo.com/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: null,
    method: "GET",
  }
)
  .then((res) => res.json())
  .then((json) => {
    return json.data.list[0].children[9].list.map((i) => ({
      name: i.title,
      id: i.content_id,
    }));
  })
  .then(async (res) => {
    for (const { id, name } of res) {
      try {
        const content = await fetch(
          "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/content/info?app_sn=ys_obc&content_id=" +
            id,
          {
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
              "sec-ch-ua":
                '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
              "sec-ch-ua-mobile": "?1",
              "sec-ch-ua-platform": '"Android"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-site",
              Referer: "https://bbs.mihoyo.com/",
              "Referrer-Policy": "strict-origin-when-cross-origin",
            },
            body: null,
            method: "GET",
          }
        ).then((res) => res.json());
        const $ = cheerio.load(
          content.data.content?.content || content.data.content.contents[0].text
        );
        const section = $('[data-tmpl="fold"]')
          .toArray()
          .map((i, el) => {
            return {
              name: $(".h1", el).text(),
              text: $(".obc-tmpl__paragraph-box", el)
                .children()
                .toArray()
                .map((el) => $(el).text()),
            };
          });
        fse.outputJSON("./book/chinese/" + name + ".json", { name, section });
        console.log(name);
        // break;
      } catch (e) {
        console.log(name, e);
      }
    }
  });
