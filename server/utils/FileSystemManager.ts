import fs from "fs";

class FileSystemManager {
  
  async readFile(path: string) {
    return (await fs.promises.readFile(path)).toString("utf8");
  }

  async writeFile(path: string, content: string) {
    await fs.promises.writeFile(path, content);
  }
}

export default FileSystemManager;