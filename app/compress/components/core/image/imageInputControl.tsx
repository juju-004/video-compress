import React from "react";
import { ImageInputSettings, MaxSize, MaxWidth } from "~/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { motion } from "framer-motion";

type ImageControlDetailsProps = {
  imageSettings: ImageInputSettings;
  onImageSettingsChange: (value: ImageInputSettings) => void;
  disable: boolean;
};

export const ImageInputControl = ({
  imageSettings,
  onImageSettingsChange,
  disable,
}: ImageControlDetailsProps) => (
  <motion.div
    layout
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    transition={{ type: "tween" }}
    key="input"
    className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 h-fit"
  >
    <div className="text-sm">
      <div className="flex justify-between items-center border-b mb-2 pb-2">
        <p>Max Size</p>
        <Select
          disabled={disable}
          value={imageSettings.maxSize}
          onValueChange={(value: string) => {
            const maxSize = value as MaxSize;
            onImageSettingsChange({ ...imageSettings, maxSize });
          }}
        >
          <SelectTrigger className="w-[100px] text-sm">
            <SelectValue placeholder="Select Quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {maxsize.map(({ label, value }) => (
                <SelectItem value={value} key={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-between items-center">
        <p>Max Width</p>
        <Select
          disabled={disable}
          value={imageSettings.maxWidth}
          onValueChange={(value: string) => {
            const maxWidth = value as MaxWidth;
            onImageSettingsChange({ ...imageSettings, maxWidth });
          }}
        >
          <SelectTrigger className="w-[100px] text-sm">
            <SelectValue placeholder="Select Quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {maxwidth.map(({ label, value }) => (
                <SelectItem value={value} key={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  </motion.div>
);

const maxsize: { label: string; value: MaxSize }[] = [
  { label: "100%", value: MaxSize.Full },
  { label: "90%", value: MaxSize.Ninety },
  { label: "75%", value: MaxSize.SeventyFive },
  { label: "50%", value: MaxSize.Half },
];
const maxwidth: { label: string; value: MaxWidth }[] = [
  { label: "100%", value: MaxWidth.Full },
  { label: "90%", value: MaxWidth.Ninety },
  { label: "75%", value: MaxWidth.SeventyFive },
  { label: "50%", value: MaxWidth.Half },
];
