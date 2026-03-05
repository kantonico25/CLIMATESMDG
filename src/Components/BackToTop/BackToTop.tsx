import React from "react";
import Icon from "../Icon/Icon";

const BackToTop: React.FC = () => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      id="back-to-top"
      type="button"
      aria-label="Back to top"
      onClick={handleClick}
      className="fixed bottom-8 right-8 w-12 h-12 bg-yellow-400 text-black rounded-full shadow-2xl flex items-center justify-center opacity-0 invisible z-[100] transition-all duration-300 hover:bg-yellow-500 hover:-translate-y-1"
    >
      <Icon name="arrow-up" />
    </button>
  );
};

export default BackToTop;

