import { StorageAdapter } from "./storage-adapter.mjs?v=11";
import { createProject, validateProjectName, cloneProjectForDuplicate } from "../models/project.mjs?v=11";
import { validateCardTypeName } from "../models/card-type.mjs?v=11";
import { upsertDeck, removeDeck } from "../models/deck.mjs?v=11";

const DB_VERSION = 1;
const STORE_NAME = "projects";

function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export class IndexedDbAdapter extends StorageAdapter {
  #dbPromise;

  constructor(dbName = "cardgame-prototyper") {
    super();
    this.#dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, DB_VERSION);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async #store(mode) {
    const db = await this.#dbPromise;
    return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
  }

  async #getAllProjects() {
    const store = await this.#store("readonly");
    return promisifyRequest(store.getAll());
  }

  async #putProject(project) {
    const store = await this.#store("readwrite");
    await promisifyRequest(store.put(project));
    return project;
  }

  async listProjects() {
    const all = await this.#getAllProjects();
    return all.map(({ id, name }) => ({ id, name }));
  }

  async getProject(id) {
    const store = await this.#store("readonly");
    const result = await promisifyRequest(store.get(id));
    return result ?? null;
  }

  async createProject(name) {
    const existing = await this.#getAllProjects();
    const project = createProject(name, existing.map((p) => p.name));
    return this.#putProject(project);
  }

  async renameProject(id, name) {
    const project = await this.getProject(id);
    if (!project) throw new Error(`Project not found: ${id}`);
    const existing = await this.#getAllProjects();
    const otherNames = existing.filter((p) => p.id !== id).map((p) => p.name);
    project.name = validateProjectName(name, otherNames);
    project.updatedAt = Date.now();
    return this.#putProject(project);
  }

  async duplicateProject(id) {
    const project = await this.getProject(id);
    if (!project) throw new Error(`Project not found: ${id}`);
    const existing = await this.#getAllProjects();
    const duplicate = cloneProjectForDuplicate(project, existing.map((p) => p.name));
    return this.#putProject(duplicate);
  }

  async deleteProject(id) {
    const store = await this.#store("readwrite");
    await promisifyRequest(store.delete(id));
  }

  async saveCardType(projectId, cardType) {
    const project = await this.getProject(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    const otherNames = project.cardTypes
      .filter((ct) => ct.id !== cardType.id)
      .map((ct) => ct.name);
    validateCardTypeName(cardType.name, otherNames);
    const saved = cardType.id ? cardType : { ...cardType, id: crypto.randomUUID() };
    const index = project.cardTypes.findIndex((ct) => ct.id === saved.id);
    if (index === -1) project.cardTypes.push(saved);
    else project.cardTypes[index] = saved;
    project.updatedAt = Date.now();
    await this.#putProject(project);
    return saved;
  }

  async saveDeck(projectId, deck) {
    const project = await this.getProject(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    const saved = upsertDeck(project, deck);
    project.updatedAt = Date.now();
    await this.#putProject(project);
    return saved;
  }

  async deleteDeck(projectId, deckId) {
    const project = await this.getProject(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    removeDeck(project, deckId);
    project.updatedAt = Date.now();
    await this.#putProject(project);
  }

  async deleteCardType(projectId, cardTypeId) {
    const project = await this.getProject(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    project.cardTypes = project.cardTypes.filter((ct) => ct.id !== cardTypeId);
    project.updatedAt = Date.now();
    await this.#putProject(project);
  }
}
