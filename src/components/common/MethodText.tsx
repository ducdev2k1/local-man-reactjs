import React from "react";
import type { TypeHttpMethod } from "../../Types";

interface IProps {
  method: TypeHttpMethod | string;
}

export const MethodText: React.FC<IProps> = ({ method }) => {
  const colors: Record<string, string> = {
    GET: "text-green-600 dark:text-green-400",
    POST: "text-orange-600 dark:text-orange-400",
    PUT: "text-yellow-600 dark:text-yellow-400",
    DELETE: "text-red-600 dark:text-red-400",
    PATCH: "text-purple-600 dark:text-purple-400",
  };
  return (
    <span
      className={`font-bold ${colors[method as string] || "text-gray-500"}`}
    >
      {method}
    </span>
  );
};
