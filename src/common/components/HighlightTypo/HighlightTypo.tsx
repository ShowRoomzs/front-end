import Typography, { TypographyProps } from "@/common/components/Typography/Typography";

interface HighlightTypoProps extends TypographyProps {
  keyword: string;
  highlightClassName?: string;
}

export default function HighlightTypo(props: HighlightTypoProps) {
  const { keyword, highlightClassName, children, ...typoProps } = props;

  if (!keyword || typeof children !== "string") {
    return <Typography {...typoProps}>{children}</Typography>;
  }

  const regex = new RegExp(`(${keyword})`, "gi");
  const parts = children.split(regex);

  return (
    <Typography {...typoProps}>
      {parts.map((part, index) => {
        const isHighlight = part.toLowerCase() === keyword.toLowerCase();

        return (
          <Typography key={index} {...typoProps} className={isHighlight ? highlightClassName : undefined}>
            {part}
          </Typography>
        );
      })}
    </Typography>
  );
}
