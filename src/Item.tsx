import { forwardRef } from "react";
import { Box, Group, Stack } from "@mantine/core";

interface ItemProps {
  item: any;
  sx?: any;
}

export const Item = forwardRef<any, ItemProps>(
  ({ item, sx, ...others }: ItemProps, ref) => {
    const { id } = item;
    return (
      <Stack sx={sx}>
        <Group
          ref={ref}
          sx={{
            minWidth: 0,
            mr: "0px",
            cursor: "grab"
          }}
          {...others}
        >
          <Box
            component="span"
            sx={{
              width: "20px",
              height: "20px",
              textAlign: "center",
              lineHeight: "15px",
              borderRadius: "10px",
              border: `2px solid gray`,
              fontSize: "0.8rem",
              display: "inline-block",
              color: "gray",
              backgroundColor: "white",
              zIndex: 1
            }}
          />
          <Box> {id}</Box>
        </Group>
      </Stack>
    );
  }
);
