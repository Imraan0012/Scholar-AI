"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
    badge?: string;
    category?: string;
    grant?: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] z-10"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-32 px-4 w-full left-0 top-0 text-center md:text-left">
      <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20 inline-block mb-4">
        Verified Indian & Global Scholarships Mapped
      </span>
      <h1 className="text-3xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
        Discover Verified <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-cyan-200 to-emerald-300">
          National & Global Grants
        </span>
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-6 text-gray-300 leading-relaxed font-normal">
        From Central Government portfolios to prestigious research fellowships, Scholar AI connects your eligibility directly to authentic funding bodies.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
    badge?: string;
    category?: string;
    grant?: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-80 w-[26rem] md:h-96 md:w-[30rem] relative shrink-0 rounded-3xl overflow-hidden border border-white/15 bg-[#121420] shadow-2xl backdrop-blur-xl"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl h-full w-full relative"
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0 transition-transform duration-500 group-hover/product:scale-105"
          alt={product.title}
        />
        
        {/* Sleek Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090f] via-[#08090f]/50 to-transparent pointer-events-none" />
      </a>

      {/* Hover Reveal Card */}
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-90 bg-[#08090f]/80 backdrop-blur-md transition-opacity duration-300 p-6 flex flex-col justify-between pointer-events-none">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            {product.category || "Verified Scheme"}
          </span>
          <h3 className="text-xl font-bold text-white mt-3">
            {product.title}
          </h3>
        </div>
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-cyan-300 font-semibold">{product.grant || "Full Tuition Aid"}</span>
          <span className="text-gray-300">Click to View Details →</span>
        </div>
      </div>

      {/* Bottom Title Bar (Visible by default) */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent pointer-events-none flex items-center justify-between">
        <h2 className="text-base font-bold text-white tracking-wide">
          {product.title}
        </h2>
        {product.grant && (
          <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded bg-black/60 border border-emerald-500/30">
            {product.grant}
          </span>
        )}
      </div>
    </motion.div>
  );
};
