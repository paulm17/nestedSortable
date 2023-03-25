import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Paper } from "@mantine/core";
import { Item } from "./Item";
import Sortable from "./Sortable";

interface sortableItemProps {
  item: any;
  activeId: string;
  parentId?: any;
  items: any[];
}

function SortableItem({ item, activeId, parentId, items }: sortableItemProps) {
  const { id } = item;
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition
  } = useSortable({
    id,
    data: {
      id: id,
      type: "item",
      parent: parentId
    },
    disabled: activeId === item.id,
    transition: null
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: activeId !== null && id === activeId ? 0.3 : 1,
    backgroundColor: activeId !== null && id === activeId ? "green" : ""
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
        <Box ref={setNodeRef} sx={{ ...style }}>
          <Item
            item={item}
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
          />
        </Box>
      </Paper>

      {activeId !== item.id && (
        <Sortable
          items={item.items}
          parentId={item.id}
          activeId={activeId}
          allItems={items}
        />
      )}
    </>
  );
}

export default memo(SortableItem);
