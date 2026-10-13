import { StorageAdapter } from "../../js/storage/storage-adapter.mjs";
import { createProject, validateProjectName, cloneProjectForDuplicate } from "../../js/models/project.mjs";
import { validateCardTypeName } from "../../js/models/card-type.mjs";
import { upsertDeck, removeDeck } from "../../js/models/deck.mjs";

/**
 * A second, structurally distinct test adapter (array-backed rather than
 * Map-backed) used alongside InMemoryAdapter to prove the app's logic
 * only depends on the storage-adapter contract, not any one backend.
 */
export class ArrayStoreAdapter extends StorageAdapter {
  #projects = [];

  async listProjects() {
    return this.#projects.map(({ id, name }) => ({ id, name }));
  }

  async getProject(id) {
    return this.#projects.find((p) => p.id === id) ?? null;
  }

  async createProject(name) {
    const project = createProject(name, this.#projects.map((p) => p.name));
    this.#projects.push(project);
    return project;
  }

  async renameProject(id, name) {
    const project = await this.getProject(id);
    if (!project) throw new Error(`Project not found: ${id}`);
    const otherNames = this.#projects.filter((p) => p.id !== id).map((p) => p.name);
    project.name = validateProjectName(name, otherNames);
    project.updatedAt = Date.now();
    return project;
  }

  async duplicateProject(id) {
    const project = await this.getProject(id);
    if (!project) throw new Error(`Project not found: ${id}`);
    const duplicate = cloneProjectForDuplicate(project, this.#projects.map((p) => p.name));
    this.#projects.push(duplicate);
    return duplicate;
  }

  async deleteProject(id) {
    this.#projects = this.#projects.filter((p) => p.id !== id);
  }

  async saveCardType(projectId, cardType) {
    const project = await this.getProject(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    const otherNames = project.cardTypes.filter((ct) => ct.id !== cardType.id).map((ct) => ct.name);
    validateCardTypeName(cardType.name, otherNames);
    const saved = cardType.id ? cardType : { ...cardType, id: crypto.randomUUID() };
    const index = project.cardTypes.findIndex((ct) => ct.id === saved.id);
    if (index === -1) project.cardTypes.push(saved);
    else project.cardTypes[index] = saved;
    project.updatedAt = Date.now();
    return saved;
  }

  async saveDeck(projectId, deck) {
    const project = await this.getProject(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    const saved = upsertDeck(project, deck);
    project.updatedAt = Date.now();
    return saved;
  }

  async deleteDeck(projectId, deckId) {
    const project = await this.getProject(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    removeDeck(project, deckId);
    project.updatedAt = Date.now();
  }

  async deleteCardType(projectId, cardTypeId) {
    const project = await this.getProject(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    project.cardTypes = project.cardTypes.filter((ct) => ct.id !== cardTypeId);
    project.updatedAt = Date.now();
  }
}
