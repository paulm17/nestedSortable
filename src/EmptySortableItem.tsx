import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Paper } from "@mantine/core";

interface sortableItemProps {
  item: any;
  activeId: string;
  parentId?: any;
}

function EmptySortableItem({ item, activeId, parentId }: sortableItemProps) {
  const { id } = item;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    over
  } = useSortable({
    id: `droppable-${id}`,
    data: {
      id: id,
      type: "droppable",
      parent: parentId
    },
    transition: null
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: activeId !== null && id === activeId ? 0.3 : 1,
    backgroundColor:
      over && over.id === `droppable-${id}` ? "green" : "rgb(212,212,216)",
    height: activeId === item.id ? 0 : "40px",
    width: "100%"
  };

  return (
    <>
      <Paper
        sx={{
          height: "100%",
          width: "100%",
          margin: "0 10px 5px"
        }}
      >
        <Box
          ref={setNodeRef}
          sx={{ ...style }}
          {...listeners}
          {...attributes}
        />
      </Paper>
    </>
  );
}

export default memo(EmptySortableItem);
