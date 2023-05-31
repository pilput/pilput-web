import React from "react";

interface Props {
    title: string
}

const ButtonPrimary: React.FC<Props> = ({ title }) => {
  return <button className="bg-blue-600 px-3 text-white py-2 rounded-lg hover:bg-blue-700">{title}</button>;
};

export default ButtonPrimary;
