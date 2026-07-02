import React from "react";
import { Card } from "heroui-native";
import { twMerge } from "tailwind-merge";

type CardUniversalProps = React.ComponentPropsWithoutRef<typeof Card>;

const CardUniversalRoot = ({ children, className, ...props }: CardUniversalProps) => {
  return (
    <Card
      className={twMerge(
        "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};

const CardUniversal = Object.assign(CardUniversalRoot, {
  Header: Card.Header,
  Body: Card.Body,
  Footer: Card.Footer,
});

export default CardUniversal;
