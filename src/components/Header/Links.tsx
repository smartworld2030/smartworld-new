import { InvestLogo } from "./InvestLogo";
import { SwapLogo } from "./SwapLogo";
import { SttLogo } from "./SttLogo";

export const sizeCalculator = (width: number) => {
  const half = width / 2;
  let quarter = half / 2;
  let eighth = quarter / 2;
  const height = 170;
  let fristHeight = height;
  let secondHeight = height;
  let querylimiter = true;
  if (width < 600) {
    quarter = half / 1.2;
    eighth = quarter / 1.6;
    fristHeight = height - 40;
    secondHeight = height - 15;
    querylimiter = false;
  }
  const linkArray = [
    {
      positionX: half - quarter,
      positionY: fristHeight - 80,
      size: 30,
      link: "/info",
      text: "Info",
      textPos: fristHeight - 69,
      number: 0,
      icon: <div></div>,
    },
    {
      positionX: half - eighth - 10,
      positionY: secondHeight - 69,
      size: 40,
      link: "/pool",
      text: "",
      textPos: secondHeight - 55,
      number: 2,
      icon: <SttLogo width={45} x={half - eighth - 23} y={secondHeight - 74} />,
    },
    {
      positionX: half - 20,
      positionY: height - 80,
      size: 70,
      link: "/invest",
      text: "",
      textPos: height - 66,
      number: 1,
      icon: <InvestLogo width={70} x={half - 35} y={height - 81} />,
    },
    {
      positionX: half + eighth,
      positionY: secondHeight - 69,
      size: 40,
      link: "/swap",
      text: "",
      textPos: secondHeight - 55,
      number: 2,
      icon: (
        <SwapLogo width={42} x={half + eighth - 21} y={secondHeight - 70} />
      ),
    },
    {
      positionX: half + quarter - 20,
      positionY: fristHeight - 84,
      size: 30,
      link: "/stb",
      text: "STB",
      number: 0,
      textPos: fristHeight - 69,
      icon: <div></div>,
    },
  ];
  return { half, quarter, linkArray, eighth, height, querylimiter };
};
