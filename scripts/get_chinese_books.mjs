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
                    `https://api-takumi-static.mihoyo.com/hoyowiki/genshin/wapi/entry_page?app_sn=ys_obc&entry_page_id=${id}&lang=zh-cn`,
                    {
                        headers: {
                            accept: "application/json, text/plain, */*",
                            "sec-ch-ua":
                                '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": '"Windows"',
                            "x-rpc-wiki_app": "genshin",
                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
                        },
                        referrer: "https://bbs.mihoyo.com/",
                        referrerPolicy: "strict-origin-when-cross-origin",
                        body: null,
                        method: "GET",
                        mode: "cors",
                        credentials: "omit",
                    }
                ).then((res) => res.json());
                fse.outputJSON(
                    "./book/chinese/" + name + ".json",
                    content.data.page
                );
                console.log(name);
            } catch (e) {
                console.log(name, e);
            }
        }
    });
