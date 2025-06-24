"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { toast } from "sonner";
import convertFile from "~/utils/convert";
import { VideoInputControl } from "../core/video/videoInputControl";
import { VideoOutputDetails } from "../core/video/videoOutputDetails";
import { CompressProgress } from "../core/compressProgress";
import { VideoTrim } from "../core/video/videoTrim";
import {
  FileActions,
  QualityType,
  VideoFormats,
  VideoInputSettings,
} from "~/types";
import { motion } from "framer-motion";

const CompressVideo = ({
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
  const [videoSettings, setVideoSettings] = useState<VideoInputSettings>({
    quality: QualityType.Hight,
    videoType: VideoFormats.MP4,
    customEndTime: 0,
    customStartTime: 0,
    removeAudio: false,
    twitterCompressionCommand: false,
  });
  const ffmpegRef = useRef(new FFmpeg());
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
    try {
      setTime({ ...time, startTime: new Date() });
      setStatus("compressing");
      ffmpegRef.current.on("progress", ({ progress: completion, time }) => {
        const percentage = completion * 100;
        setProgress(percentage);
      });
      ffmpegRef.current.on("log", ({ message }) => {
        console.log(message);
      });
      const { url, output, outputBlob } = await convertFile(
        ffmpegRef.current,
        file,
        videoSettings
      );

      console.log(url, output, outputBlob);

      setFile({
        ...file,
        url,
        output,
        outputBlob,
      });
      setTime((oldTime) => ({ ...oldTime, startTime: undefined }));
      setStatus("converted");
      setProgress(0);
    } catch (err) {
      console.log(err);
      setStatus("notStarted");
      setProgress(0);
      setTime({ elapsedSeconds: 0, startTime: undefined });
      toast.error("Error Compressing Video");
    }
  };

  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.load({
      coreURL: await toBlobURL(
        `${process.env.NEXT_PUBLIC_URL}/download/ffmpeg-core.js`,
        "text/javascript"
      ),
      wasmURL: await toBlobURL(
        `${process.env.NEXT_PUBLIC_URL}/download/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  };

  const loadWithToast = () => {
    toast.promise(load, {
      loading: "Downloading necessary packages from FFmpeg for offline use.",
      success: () => {
        return "All necessary file downloaded";
      },
      error: "Error loading FFmpeg packages",
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => loadWithToast(), []);

  return (
    <>
      <VideoTrim
        disable={disableDuringCompression}
        onVideoSettingsChange={setVideoSettings}
        videoSettings={videoSettings}
      />
      <VideoInputControl
        disable={disableDuringCompression}
        onVideoSettingsChange={setVideoSettings}
        videoSettings={videoSettings}
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
        {status === "compressing" && (
          <CompressProgress progress={progress} seconds={time.elapsedSeconds} />
        )}

        {(status === "notStarted" || status === "converted") && (
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
        <VideoOutputDetails timeTaken={time.elapsedSeconds} videoFile={file} />
      )}
    </>
  );
};

export default CompressVideo;
