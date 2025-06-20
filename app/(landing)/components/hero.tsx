import Link from "next/link";
import React from "react";

const Hero = () => (
  <div className="pt-10 md:pt-20 pb-28 px-6 lg:px-0">
    <h1 className="text-center text-4xl font-bold md:text-5xl lg:text-7xl lg lg:font-semibold text-gray-900 text-balance">
      Compress Videos & Images.
    </h1>
    <h2 className="sm:text-lg max-w-xl mx-auto text-gray-500 max-w text-center mt-9">
      Say goodbye to bulky files! Crush video sizes by{" "}
      <span className="text-black font-medium">90%</span> with no quality loss,
      even offline.
    </h2>
    <div className="flex gap-4 items-center justify-center mt-10">
      <Link
        href="/video"
        className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-700 via-zinc-950 to-zinc-950 rounded-lg text-white/90 px-3.5 py-2.5 relative text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-500 focus:ring-zinc-950 flex-shrink-0"
      >
        Compress Now
      </Link>
    </div>
  </div>
);

export default Hero;
