import { useState } from "react";
import { createPortal } from "react-dom";
import { Box, Container, Divider, Grid } from "@mantine/core";
import {
  rectIntersection,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  Translate
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Draggable from "./Draggable";
import Sortable from "./Sortable";
import { Item } from "./Item";
import {
  getItem,
  getParentId,
  getParentItems,
  flattenItems,
  generateRandomId,
  addNode,
  updateNode,
  removeNode,
  getParentArray
} from "./utils";
import Clonedeep from "lodash.clonedeep";
import { useSnapshot } from "valtio";
import { useStore } from "./store";

const defaultCoordinates = {
  x: 0,
  y: 0
};

function MultipleContainer() {
  const store = useSnapshot(useStore);
  const [activeId, setActiveId] = useState<any>(null);
  const [dragging, setDragging] = useState(false);
  const [dragId, setDragId] = useState(generateRandomId(8));
  const [dragType, setDragType] = useState<"sortable" | "draggable" | null>(
    null
  );

  const [{ translate }, setTranslate] = useState<{
    initialTranslate: Translate;
    translate: Translate;
  }>({ initialTranslate: defaultCoordinates, translate: defaultCoordinates });
  const [initialWindowScroll, setInitialWindowScroll] = useState(
    defaultCoordinates
  );

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragStart = ({ active }: any) => {
    if (active.data.current.type !== "draggable") {
      setActiveId(active.id);
      setDragType("sortable");
    } else {
      setDragType("draggable");
    }

    setInitialWindowScroll({
      x: window.scrollX,
      y: window.scrollY
    });
  };

  const flat = flattenItems(Clonedeep(store.items));

  const handleDragOver = ({ active, over }: any) => {
    if (active === null || over === null) {
      return false;
    }

    let newItems = Clonedeep(store.items);

    const activeId = dragType === "draggable" ? dragId : active?.id;
    const overId =
      over.data.current.type === "droppable"
        ? over.data.current.parent
        : over?.id;

    // Draggable
    const activeIndex = flat.findIndex((item) => item.id === activeId);

    if (activeIndex === -1) {
      if (flat.findIndex((x) => x.id === activeId) === -1) {
        const newItem = {
          id: activeId,
          items: []
        };

        addNode(newItems, undefined, newItem);
      }
    } else {
      // Sortable
      const overParentId = over.data.current.parent;
      const activeParentId = getParentId(activeId, newItems);
      const activeItem = getItem(activeId, newItems);

      if (over.data.current.type === "droppable") {
        // Remove from original
        removeNode(activeId, newItems);

        // Add new
        newItems = addNode(newItems, over.data.current.parent, activeItem);
      } else {
        // Same region
        if (activeParentId === undefined && overParentId === undefined) {
          const activeOverId = getParentId(overId, newItems);
          const parentItems = getParentItems(activeOverId, newItems);
          const activeIndex = parentItems.findIndex(
            (item) => item.id === activeId
          );
          const overIndex = parentItems.findIndex((item) => item.id === overId);
          const moveItems = arrayMove(parentItems, activeIndex, overIndex);

          newItems = updateNode(newItems, activeOverId, moveItems);
        } else {
          const items = getParentArray(overId, newItems);

          // Ensure drop of sortItem into sortable occurs once
          if (items.find((item) => item.id === activeId)) {
            return false;
          }

          if (overParentId === undefined) {
            // Remove from original
            removeNode(activeId, newItems);

            // Add new
            newItems = addNode(newItems, undefined, activeItem);

            // Move to new place
            const activeOverId = getParentId(overId, newItems);
            const parentItems = getParentItems(activeOverId, newItems);
            const activeIndex = parentItems.findIndex(
              (item) => item.id === activeId
            );
            const overIndex = parentItems.findIndex(
              (item) => item.id === overId
            );
            const moveItems = arrayMove(parentItems, activeIndex, overIndex);
            newItems = updateNode(newItems, activeOverId, moveItems);
          } else {
            // Remove from original
            removeNode(activeId, newItems);

            // Add new
            newItems = addNode(newItems, overParentId, activeItem);

            // Move to new place
            const parentItems = getItem(overParentId, newItems).items;
            const activeIndex = parentItems.findIndex(
              (item) => item.id === activeId
            );
            const overIndex = parentItems.findIndex(
              (item) => item.id === overId
            );
            const moveItems = arrayMove(parentItems, activeIndex, overIndex);
            newItems = updateNode(newItems, overParentId, moveItems);
          }
        }
      }
    }

    useStore.items = newItems;
  };

  const handleDragMove = ({ delta }: any) => {
    setTranslate(({ initialTranslate }) => ({
      initialTranslate,
      translate: {
        x: initialTranslate.x + delta.x - initialWindowScroll.x,
        y: initialTranslate.y + delta.y - initialWindowScroll.y
      }
    }));
  };

  const handleDragEnd = () => {
    setDragId(generateRandomId(8));
    setActiveId(null);
    setDragType(null);

    setTranslate(({ translate }) => {
      return {
        translate,
        initialTranslate: translate
      };
    });
    setInitialWindowScroll(defaultCoordinates);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDragType(null);
  };

  const getDragLayer = () => {
    if (dragType === null) {
      return null;
    }

    const layerId = dragType === "draggable" ? dragId : activeId;

    const overLayStyles = {
      opacity: 1,
      backgroundColor: "gray",
      border: `1px solid gray`
    };

    return (
      <>
        {dragType === "draggable" && (
          <Box
            sx={{ width: "400px", height: "30px", backgroundColor: "green" }}
          >
            <Item item={{ id: layerId, items: [] }} sx={overLayStyles} />
          </Box>
        )}
        {dragType === "sortable" && getItem(layerId, flat) ? (
          <Item item={getItem(layerId, flat)} sx={overLayStyles} />
        ) : null}
      </>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      //modifiers={modifiers}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <Grid m={0}>
        <Grid.Col span={6} pr={0}>
          <Draggable
            id="draggable"
            dragId={dragId}
            setDragging={setDragging}
            translate={translate}
          >
            <Box
              sx={{ width: "100px", height: "30px", backgroundColor: "green" }}
            >
              Drag Me!
            </Box>
          </Draggable>
        </Grid.Col>
        <Grid.Col span={6} pl={0}>
          <Box sx={{ width: "100%" }}>
            <Divider color="gray.4" />

            <Container sx={{ height: "100%" }}>
              <Box sx={{ width: "100%", textAlign: "left" }}>
                <Sortable
                  items={store.items}
                  activeId={dragging ? dragId : activeId}
                  allItems={[...store.items]}
                />
              </Box>
            </Container>
          </Box>
        </Grid.Col>
      </Grid>

      {createPortal(<DragOverlay>{getDragLayer()}</DragOverlay>, document.body)}
    </DndContext>
  );
}

export default MultipleContainer;
