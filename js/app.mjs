import { IndexedDbAdapter } from "./storage/indexeddb-adapter.mjs?v=10";
import { mountProjectList } from "./views/project-list/project-list.mjs?v=10";

const storage = new IndexedDbAdapter();
const root = document.getElementById("view-root");

mountProjectList(root, storage);
