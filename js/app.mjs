import { IndexedDbAdapter } from "./storage/indexeddb-adapter.mjs?v=16";
import { mountProjectList } from "./views/project-list/project-list.mjs?v=16";

const storage = new IndexedDbAdapter();
const root = document.getElementById("view-root");

mountProjectList(root, storage);
