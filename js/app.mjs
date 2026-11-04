import { IndexedDbAdapter } from "./storage/indexeddb-adapter.mjs?v=32";
import { mountProjectList } from "./views/project-list/project-list.mjs?v=32";

const storage = new IndexedDbAdapter();
const root = document.getElementById("view-root");

mountProjectList(root, storage);
