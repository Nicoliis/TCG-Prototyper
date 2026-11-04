import { IndexedDbAdapter } from "./storage/indexeddb-adapter.mjs?v=34";
import { mountProjectList } from "./views/project-list/project-list.mjs?v=34";

const storage = new IndexedDbAdapter();
const root = document.getElementById("view-root");

mountProjectList(root, storage);
