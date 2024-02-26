/** @format */

export const generateCode = () => {
  return new Date().getTime().toString().split("").slice(-5).join("");
};
