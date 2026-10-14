import { IndexedDbAdapter } from "./storage/indexeddb-adapter.mjs?v=28";
import { mountProjectList } from "./views/project-list/project-list.mjs?v=28";

const storage = new IndexedDbAdapter();
const root = document.getElementById("view-root");

mountProjectList(root, storage);
