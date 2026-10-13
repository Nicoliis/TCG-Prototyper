import { IndexedDbAdapter } from "./storage/indexeddb-adapter.mjs?v=5";
import { mountProjectList } from "./views/project-list/project-list.mjs?v=5";

const storage = new IndexedDbAdapter();
const root = document.getElementById("view-root");

mountProjectList(root, storage);
