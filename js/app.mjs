import { IndexedDbAdapter } from "./storage/indexeddb-adapter.mjs?v=2";
import { mountProjectList } from "./views/project-list/project-list.mjs?v=2";

const storage = new IndexedDbAdapter();
const root = document.getElementById("view-root");

mountProjectList(root, storage);
