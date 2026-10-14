import { IndexedDbAdapter } from "./storage/indexeddb-adapter.mjs?v=27";
import { mountProjectList } from "./views/project-list/project-list.mjs?v=27";

const storage = new IndexedDbAdapter();
const root = document.getElementById("view-root");

mountProjectList(root, storage);
