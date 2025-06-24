import Image from "next/image";
import React from "react";

type DisplayProps = {
  url: string;
  type: "i" | "v";
};

export const Display = ({ url, type }: DisplayProps) =>
  type === "i" ? (
    <Image
      src={url}
      width={50}
      height={50}
      className="object-contain my-auto w-full "
      alt="image to be compressed"
    ></Image>
  ) : (
    <video
      id="compress-video-player"
      className="h-full w-full rounded-3xl"
      controls
    >
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
