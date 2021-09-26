import { Button } from "@smartworld-libs/uikit";
import { Link } from "react-router-dom";

interface HeadCircleProps {
  positionX: number;
  positionY: number;
  textPos: number;
  size: number;
  number: number;
  text: string;
  link: string;
  onClick: () => void;
  active: boolean;
  icon: JSX.Element;
}

export const HeadCircle: React.FC<HeadCircleProps> = ({
  positionX,
  positionY,
  size,
  number,
  onClick,
  active,
  text,
  link,
  icon,
  textPos,
}) => {
  return (
    <foreignObject
      x={positionX}
      y={positionY}
      width={size}
      height={size}
      overflow="visible"
    >
      <Button
        shape="circle"
        variant={active ? "primary" : "secondary"}
        as={Link}
        onClick={onClick}
        to={link}
        size={size}
      >
        {text ? (
          <p style={{ fontSize: 10, textDecoration: "none" }}>{text}</p>
        ) : (
          icon
        )}
      </Button>
    </foreignObject>
  );
};
