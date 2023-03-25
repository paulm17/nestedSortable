import { MantineProvider } from "@mantine/core";
import MultipleContainer from "./MultipleContainer";

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <MultipleContainer />
    </MantineProvider>
  );
}
