import { For, createResource } from "solid-js";
import {
    A,
    RouteDataArgs,
    createRouteData,
    useParams,
    useRouteData,
} from "solid-start";
import { createServerData$ } from "solid-start/server";

export function routeData({ location }: RouteDataArgs) {
    // load some data
    const article = createRouteData(async () => {
        return fetch(
            new URL(
                "/data/" +
                    decodeURI(location.pathname).replace("/books/", "") +
                    ".json",
                "http://localhost:3000"
            )
        ).then((res) => res.json());
    });
    const bookIndex = createServerData$(() =>
        fetch(new URL("/data/index.json", "http://localhost:3000")).then(
            (res) => res.json()
        )
    );
    return { article, bookIndex };
}

export default () => {
    const { article, bookIndex } = useRouteData<typeof routeData>();
    return (
        <main class="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-blue-950 to-black grid grid-cols-12 grid-rows-6 h-screen w-screen gap-4 overflow-hidden text-white">
            <nav class="overflow-y-scroll col-span-2 col-start-2 row-span-6">
                <ul class="">
                    {bookIndex()?.map((i) => {
                        return (
                            <a href={"/books/" + i.name} class="flex ">
                                <img
                                    class="aspect-square w-12"
                                    src={i.icon_url}
                                    alt=""
                                    loading="lazy"
                                />
                                <span>{i.name}</span>
                            </a>
                        );
                    })}
                </ul>
            </nav>
            <div class="flex col-span-6 row-span-6 flex-col ">
                <h1 class="text-orange-200 py-4  text-xl sticky top-0">
                    {article()?.name}
                </h1>
                <div class="overflow-y-scroll flex-1">
                    <article class="text-white text-sm pb-12">
                        <For each={article()?.modules.slice(1)}>
                            {(module) => {
                                return (
                                    <>
                                        {module.name && (
                                            <h2 class="text-orange-200 font-bold text-lg py-2 sticky top-0 backdrop-blur-sm">
                                                ◆ {module.name}
                                            </h2>
                                        )}
                                        <For each={module.components}>
                                            {(comp) => {
                                                if (comp.data) {
                                                    const data = JSON.parse(
                                                        comp.data
                                                    );
                                                    return (
                                                        <div
                                                            innerHTML={
                                                                data.rich_text
                                                            }></div>
                                                    );
                                                }
                                                return <></>;
                                            }}
                                        </For>
                                    </>
                                );
                            }}
                        </For>
                    </article>
                </div>
            </div>
        </main>
    );
};
