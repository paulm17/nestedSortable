import { Box } from "@mantine/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import EmptySortableItem from "./EmptySortableItem";
import { getItem } from "./utils";

interface sortableProps {
  items: any;
  parentId?: string;
  activeId: string;
  allItems: any;
}

function Sortable({ items, parentId, activeId, allItems }: sortableProps) {
  return (
    <>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <>
          {items.map((item: any) => (
            <Box
              key={item.id}
              pl={20}
              pt={!items.length ? 0 : 10}
              sx={{ border: "1px solid #000" }}
            >
              <Box mb={!items.length ? 0 : 10}>
                <SortableItem
                  parentId={parentId}
                  item={getItem(item.id, allItems)}
                  items={items}
                  activeId={activeId}
                />
              </Box>
            </Box>
          ))}
          {items.length === 0 && (
            <EmptySortableItem
              parentId={parentId}
              item={{ id: parentId, items: [] }}
              activeId={activeId}
            />
          )}
        </>
      </SortableContext>

      {/* {items.length === 0 && parentId && <Sortable />} */}
    </>
  );
}

export default Sortable;
