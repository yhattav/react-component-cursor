interface EmojiCursorProps {
  emoji: string;
}

function EmojiCursor({ emoji }: EmojiCursorProps) {
  return (
    <div className="text-2xl select-none pointer-events-none">
      {emoji}
    </div>
  );
}

export { EmojiCursor };
export type { EmojiCursorProps }; 