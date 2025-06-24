"use client";

import React from "react";
import { useState } from "react";
import { acceptedFiles } from "~/utils/formats";
import { Display } from "./core/display";
import { CustomDropZone } from "./core/customDropZone";
import { FileInputDetails } from "./core/fileInputDetails";
import { FileActions } from "~/types";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const CompressImage = dynamic(() => import("./image/compress"), {
  ssr: false,
});
const CompressVideo = dynamic(() => import("./video/compress"), {
  ssr: false,
});

const Compress = () => {
  const [currentFile, setCurrentFile] = useState<FileActions>();

  const handleUpload = (file: File) => {
    setCurrentFile({
      fileName: file.name,
      fileSize: file.size,
      from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
      fileType: file.type,
      fileCategory: file.type.includes("image") ? "i" : "v",
      file,
      isError: false,
    });
  };

  return (
    <>
      <motion.div
        layout
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        key="drag"
        transition={{ type: "tween" }}
        className="flex border rounded-3xl col-span-5 overflow-hidden md:h-full w-full bg-gray-50/35"
      >
        {currentFile ? (
          <Display
            type={currentFile.fileCategory}
            url={URL.createObjectURL(currentFile.file)}
          />
        ) : (
          <CustomDropZone
            acceptedFiles={acceptedFiles}
            handleUpload={handleUpload}
          />
        )}
      </motion.div>
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          key="size"
          transition={{ type: "tween" }}
          className="flex border rounded-3xl col-span-3 h-full w-full bg-gray-50/35 p-4 relative"
        >
          <div className="flex flex-col gap-4 w-full">
            <FileInputDetails
              onClear={() => window.location.reload()}
              file={currentFile}
            />
            {currentFile && (
              <>
                {currentFile.fileCategory === "i" && (
                  <CompressImage
                    setFile={(f) => setCurrentFile(f)}
                    file={currentFile}
                  />
                )}
                {currentFile.fileCategory === "v" && (
                  <CompressVideo
                    setFile={(f) => setCurrentFile(f)}
                    file={currentFile}
                  />
                )}
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Compress;
