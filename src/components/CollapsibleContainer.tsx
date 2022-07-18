import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useState } from "react";
import Collapsible from "react-collapsible";

type CollapsibleContainerProps = {
  title: string;
  titleClassName?: string;
  open?: boolean;
  children: ReactNode;
};
const CollapsibleContainer = (props: CollapsibleContainerProps) => {
  const {
    title,
    titleClassName = "text-2xl font-bold font-novaMono",
    open = false,
    children,
  } = props;

  const [isOpen, setIsOpen] = useState(open);

  return (
    <Collapsible
      open={open}
      onTriggerOpening={() => setIsOpen(true)}
      onTriggerClosing={() => setIsOpen(false)}
      trigger={
        <div className="p-2 mb-1 flex items-center justify-center bg-secondary/40 hover:bg-secondary/80 transition-all rounded-xl text-center">
          <button className={titleClassName}>
            {title}{" "}
            {isOpen ? (
              <FontAwesomeIcon icon={faAngleUp} />
            ) : (
              <FontAwesomeIcon icon={faAngleDown} />
            )}
          </button>
        </div>
      }
      triggerStyle={{ textAlign: "center" }}
    >
      {children}
    </Collapsible>
  );
};

export default CollapsibleContainer;
