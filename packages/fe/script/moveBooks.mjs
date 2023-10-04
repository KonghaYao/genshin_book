import fs from "fs";

["../../book/chinese/"].forEach((dir) => {
    const books = fs.readdirSync(dir);
    const index = [];
    books.forEach((i) => {
        fs.copyFileSync(dir + i, "./public/data/" + i);
        const data = JSON.parse(fs.readFileSync(dir + i, "utf-8"));
        index.push(
            Object.fromEntries(
                ["id", "name", "icon_url"].map((i) => [i, data[i]])
            )
        );
    });

    fs.writeFileSync("./public/data/index.json", JSON.stringify(index));
});
