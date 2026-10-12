export class StorageAdapter {
  async listProjects() {
    throw new Error("listProjects not implemented");
  }

  async getProject(id) {
    throw new Error("getProject not implemented");
  }

  async createProject(name) {
    throw new Error("createProject not implemented");
  }

  async renameProject(id, name) {
    throw new Error("renameProject not implemented");
  }

  async duplicateProject(id) {
    throw new Error("duplicateProject not implemented");
  }

  async deleteProject(id) {
    throw new Error("deleteProject not implemented");
  }

  async saveCardType(projectId, cardType) {
    throw new Error("saveCardType not implemented");
  }

  async deleteCardType(projectId, cardTypeId) {
    throw new Error("deleteCardType not implemented");
  }
}
