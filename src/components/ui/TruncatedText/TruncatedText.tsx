interface TruncatedTextProps {
  text: string;
  className?: string;
  as?: 'p' | 'span' | 'h3';
}

export function TruncatedText({
  text,
  className = '',
  as: Component = 'span',
}: TruncatedTextProps) {
  return (
    <Component className={`truncate ${className}`} title={text}>
      {text}
    </Component>
  );
}
