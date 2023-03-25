import { Box } from "@mantine/core";
import { useDroppable } from "@dnd-kit/core";

interface droppableProps {
  id: string;
  parentId: string;
  activeId: string;
}

function Droppable({ id, parentId, activeId }: droppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${id}-droppable`,
    data: {
      type: "droppable",
      parent: parentId
    },
    disabled: activeId !== null && activeId === id
  });

  return (
    <Box
      ref={setNodeRef}
      style={{
        backgroundColor: isOver ? "#F0F9FF" : "#000",
        width: "25%",
        height: isOver ? "50px" : "25px",
        display: activeId !== null && activeId === id ? "none" : "block"
      }}
    />
  );
}

export default Droppable;
