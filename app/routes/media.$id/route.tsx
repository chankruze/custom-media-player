import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { mediaList } from "~/db/media-list";
import { Player } from "./player";

export const loader = ({ params }: LoaderFunctionArgs) => {
  const media = mediaList.find((m) => m.id === Number(params.id));
  return json({ media });
};

export default function MediaPage() {
  const { media } = useLoaderData<typeof loader>();

  if (media)
    return (
      <Player
        length={media.duration}
        thumbnail={media.thumbnail}
        source={media.url}
      />
    );
}
