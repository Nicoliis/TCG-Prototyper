import { IndexedDbAdapter } from "./storage/indexeddb-adapter.mjs?v=25";
import { mountProjectList } from "./views/project-list/project-list.mjs?v=25";

const storage = new IndexedDbAdapter();
const root = document.getElementById("view-root");

mountProjectList(root, storage);
