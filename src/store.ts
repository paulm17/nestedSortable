import { proxy } from "valtio";
import { data } from "./data";

export const useStore = proxy({
  items: data.items
});
