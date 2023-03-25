import { ReactNode, useEffect } from "react";
import { Translate, useDraggable } from "@dnd-kit/core";

interface draggableProps {
  id: string;
  dragId: string;
  children: ReactNode;
  translate: Translate;
  setDragging: any;
}

function Draggable({
  id,
  dragId,
  translate,
  children,
  setDragging
}: draggableProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: {
      id: dragId,
      type: "draggable"
    }
  });

  useEffect(() => {
    setDragging(isDragging);
  }, [isDragging, setDragging]);

  return (
    <div
      ref={setNodeRef}
      style={
        {
          "--translate-x": `${translate?.x ?? 0}px`,
          "--translate-y": `${translate?.y ?? 0}px`
        } as React.CSSProperties
      }
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}

export default Draggable;
