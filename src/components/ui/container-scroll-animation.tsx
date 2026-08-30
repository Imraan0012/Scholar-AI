import React, { useRef } from "react";
import { useScroll, useTransform, useSpring, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Smooth spring physics for silky-smooth scroll tracking
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.0005,
  });

  const scaleDimensions = () => {
    return isMobile ? [0.82, 0.95] : [0.93, 1.0];
  };

  const rotate = useTransform(smoothProgress, [0.08, 0.45], [20, 0]);
  const scale = useTransform(smoothProgress, [0.08, 0.45], scaleDimensions());
  const translate = useTransform(smoothProgress, [0.08, 0.45], [0, -60]);

  return (
    <div
      className="h-[52rem] md:h-[68rem] flex items-center justify-center relative px-2 sm:px-6 md:px-8 pt-12 md:pt-20 pb-12"
      ref={containerRef}
    >
      <div
        className="py-2 md:py-6 w-full relative"
        style={{
          perspective: "1400px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-6xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        willChange: "transform",
        boxShadow:
          "0 0 0 1.5px rgba(56, 189, 248, 0.25), 0 30px 70px -15px rgba(0,0,0,0.95), 0 0 80px rgba(56, 189, 248, 0.12)",
      }}
      className="max-w-7xl -mt-8 mx-auto h-[38rem] md:h-[50rem] w-full border-2 border-white/10 p-2 md:p-3 bg-[#0a0c18] rounded-[32px] shadow-2xl transition-all"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-[#070913]">
        {children}
      </div>
    </motion.div>
  );
};
