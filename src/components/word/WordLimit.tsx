const WordLimit = ({ text, limit }: { text: string; limit: number }) => {
  const words = text.trim().split(" ");
  const truncated = words.slice(0, limit).join(" ");

  return (
    <span>
      {truncated}
      {words.length > limit && "..."}
    </span>
  );
};

export default WordLimit;
