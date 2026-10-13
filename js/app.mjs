import { IndexedDbAdapter } from "./storage/indexeddb-adapter.mjs?v=8";
import { mountProjectList } from "./views/project-list/project-list.mjs?v=8";

const storage = new IndexedDbAdapter();
const root = document.getElementById("view-root");

mountProjectList(root, storage);
