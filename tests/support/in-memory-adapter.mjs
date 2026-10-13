import { StorageAdapter } from "../../js/storage/storage-adapter.mjs";
import { createProject, validateProjectName, cloneProjectForDuplicate } from "../../js/models/project.mjs";
import { validateCardTypeName } from "../../js/models/card-type.mjs";
import { upsertDeck, removeDeck, pruneDecks } from "../../js/models/deck.mjs";

export class InMemoryAdapter extends StorageAdapter {
  #projects = new Map();

  async listProjects() {
    return [...this.#projects.values()].map(({ id, name }) => ({ id, name }));
  }

  async getProject(id) {
    return this.#projects.get(id) ?? null;
  }

  async createProject(name) {
    const existing = [...this.#projects.values()].map((p) => p.name);
    const project = createProject(name, existing);
    this.#projects.set(project.id, project);
    return project;
  }

  async renameProject(id, name) {
    const project = this.#projects.get(id);
    if (!project) throw new Error(`Project not found: ${id}`);
    const otherNames = [...this.#projects.values()].filter((p) => p.id !== id).map((p) => p.name);
    project.name = validateProjectName(name, otherNames);
    project.updatedAt = Date.now();
    return project;
  }

  async duplicateProject(id) {
    const project = this.#projects.get(id);
    if (!project) throw new Error(`Project not found: ${id}`);
    const existing = [...this.#projects.values()].map((p) => p.name);
    const duplicate = cloneProjectForDuplicate(project, existing);
    this.#projects.set(duplicate.id, duplicate);
    return duplicate;
  }

  async deleteProject(id) {
    this.#projects.delete(id);
  }

  async saveCardType(projectId, cardType) {
    const project = this.#projects.get(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    const otherNames = project.cardTypes.filter((ct) => ct.id !== cardType.id).map((ct) => ct.name);
    validateCardTypeName(cardType.name, otherNames);
    const saved = cardType.id ? cardType : { ...cardType, id: crypto.randomUUID() };
    const index = project.cardTypes.findIndex((ct) => ct.id === saved.id);
    if (index === -1) project.cardTypes.push(saved);
    else project.cardTypes[index] = saved;
    pruneDecks(project);
    project.updatedAt = Date.now();
    return saved;
  }

  async saveDeck(projectId, deck) {
    const project = this.#projects.get(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    const saved = upsertDeck(project, deck);
    project.updatedAt = Date.now();
    return saved;
  }

  async deleteDeck(projectId, deckId) {
    const project = this.#projects.get(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    removeDeck(project, deckId);
    project.updatedAt = Date.now();
  }

  async deleteCardType(projectId, cardTypeId) {
    const project = this.#projects.get(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    project.cardTypes = project.cardTypes.filter((ct) => ct.id !== cardTypeId);
    pruneDecks(project);
    project.updatedAt = Date.now();
  }
}
