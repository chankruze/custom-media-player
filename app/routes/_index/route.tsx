import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { Media, mediaList } from "~/db/media-list";
import { MiniPlayer } from "./mini-player";

export const meta: MetaFunction = () => {
  return [
    { title: "Custom Media Player" },
    { name: "description", content: "Custom Media Player" },
  ];
};

export default function IndexPage() {
  const [selectedMedia, setSelectedMedia] = useState<Media>();

  return (
    <main className="w-full h-full flex flex-col">
      {mediaList.length > 0 ? (
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
          {mediaList.map((media) => (
            <button
              key={media.id}
              className="inline-block w-36 space-y-2"
              onClick={() => setSelectedMedia(media)}
            >
              <div className="size-36 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={media.thumbnail}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-center text-sm line-clamp-1">
                {media.name} (From &quot;{media.album}&quot;)
              </div>
            </button>
          ))}
        </div>
      ) : null}

      {selectedMedia ? (
        <div className="mt-auto">
          <MiniPlayer media={selectedMedia} />
        </div>
      ) : null}
    </main>
  );
}
