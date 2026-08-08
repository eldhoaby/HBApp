import React from 'react';

const Title = ({ title, subTitle, align, font }) => {
  return (
    <div className={`flex flex-col justify-center items-center text-center ${align === "left" ? "md:items-start md:text-left" : ""}`}>
      <h1 className={`text-3xl md:text-[40px] text-gray-900 dark:text-white ${font || "font-playfair"}`}>
        {title}
      </h1>
      {subTitle && (
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
          {subTitle}
        </p>
      )}
    </div>
  );
};

export default Title;
