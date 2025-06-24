"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import { CompressProgress } from "../core/compressProgress";
import { FileActions, ImageInputSettings, MaxSize, MaxWidth } from "~/types";
import { motion } from "framer-motion";
import { ImageInputControl } from "../core/image/imageInputControl";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { ImageOutputDetails } from "../core/image/imageOutputDetails";

const CompressImage = ({
  file,
  setFile,
}: {
  file: FileActions;
  setFile: (f: FileActions) => void;
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [time, setTime] = useState<{
    startTime?: Date;
    elapsedSeconds: number;
  }>({ elapsedSeconds: 0 });
  const [status, setStatus] = useState<
    "notStarted" | "converted" | "compressing"
  >("notStarted");
  const [imageSettings, setImageSettings] = useState<ImageInputSettings>({
    maxSize: MaxSize.Full,
    maxWidth: MaxWidth.Full,
  });
  const disableDuringCompression = status === "compressing";

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (time?.startTime) {
      timer = setInterval(() => {
        const endTime = new Date();
        const timeDifference = endTime.getTime() - time.startTime!.getTime();
        setTime({ ...time, elapsedSeconds: timeDifference });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [time]);

  const compress = async () => {
    if (!file) return;

    const imgBlobUrl = URL.createObjectURL(file.file);
    const image = new Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Failed to load image"));
      image.src = imgBlobUrl;
    });

    const fileSizeInMB = file.fileSize / (1024 * 1024); // dynamic size from file
    const fileOriginalWidth = image.naturalWidth; // use actual image width

    const options = {
      maxSizeMB: (parseInt(imageSettings.maxSize) / 100) * fileSizeInMB,
      maxWidthOrHeight:
        (parseInt(imageSettings.maxSize) / 100) * fileOriginalWidth,
      useWebWorker: true,
      onProgress: (p: number) => setProgress(p),
    };

    try {
      setTime({ ...time, startTime: new Date() });
      setStatus("compressing");

      const compressed = await imageCompression(file.file, options);
      console.log(compressed);
      setFile({ ...file, outputBlob: compressed });
      setStatus("converted");
      setTime((oldTime) => ({ ...oldTime, startTime: undefined }));
      setProgress(0);
    } catch (err) {
      console.error(err);
      setStatus("notStarted");
      setProgress(0);
      setTime({ elapsedSeconds: 0, startTime: undefined });
      toast.error("Error Compressing Image");
    }
  };

  return (
    <>
      <ImageInputControl
        disable={disableDuringCompression}
        onImageSettingsChange={setImageSettings}
        imageSettings={imageSettings}
      />
      <motion.div
        layout
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        key="button"
        transition={{ type: "tween" }}
        className="bg-gray-100 border border-gray-200 rounded-2xl p-3 h-fit"
      >
        {status === "compressing" ? (
          <CompressProgress progress={progress} seconds={time.elapsedSeconds} />
        ) : (
          <button
            onClick={compress}
            type="button"
            className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-700 via-zinc-950 to-zinc-950 rounded-lg text-white/90 px-3.5 py-2.5 relative text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-500 focus:ring-zinc-950 w-full plausible-event-name=Compressed"
          >
            Compress
          </button>
        )}
      </motion.div>
      {status === "converted" && file && (
        <ImageOutputDetails timeTaken={time.elapsedSeconds} file={file} />
      )}
    </>
  );
};

export default CompressImage;
