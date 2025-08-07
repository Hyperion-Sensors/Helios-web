import { ReactNode } from "react";

/*---------------------Components-------------------------- */
import ReactTooltip from "react-tooltip";

type Props = {
  id: string; //id triggered by hover
  content: string; //whatever you want the tooltip to say
  orient: string; // left, right, bottom, top
};
export default function Tooltip({ id, content, orient }: Props) {
  return (
    <ReactTooltip
      id={id}
      effect="float"
      //@ts-ignore
      place={orient}
      className="custom-color-no-arrow"
      backgroundColor="rgb(234,235,238)"
    >
      <span data-tip={id} className="text-accent font-bold">
        {content}
      </span>
    </ReactTooltip>
  );
}

{
  /* <>
  const [tooltip, showTooltip] = useState(true);

 {tooltip && <ReactTooltip effect="solid" />}
 <p
   data-tip="hello world"
   onMouseEnter={() => showTooltip(true)}
   onMouseLeave={() => {
     showTooltip(false);
     setTimeout(() => showTooltip(true), 50);
   }}
 />
</> */
}
