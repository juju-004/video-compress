import Hero from "./components/hero";
import Footer from "~/components/Footer";
import VideoDemo from "./components/videoDemo";

const Page = () => (
  <>
    <div className="max-w-5xl mx-auto pt-32 space-y-16 sm:space-y-32">
      <Hero />
      <VideoDemo />
    </div>
    <Footer />
  </>
);

export default Page;
