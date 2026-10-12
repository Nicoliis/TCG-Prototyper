import { IndexedDbAdapter } from "./storage/indexeddb-adapter.mjs";
import { mountProjectList } from "./views/project-list/project-list.mjs";

const storage = new IndexedDbAdapter();
const root = document.getElementById("view-root");

mountProjectList(root, storage);
