import { Platform } from '/src/enums/platform';

export class Env {
  constructor(readonly mode: string) {}

  isDevelopment() {
    return this.mode === Platform.development;
  }

  isCrazyGames() {
    return this.mode === Platform.crazyGames;
  }

  isItchIo() {
    return this.mode === Platform.itchIo;
  }

  isPoki() {
    return this.mode === Platform.poki;
  }
  isGithubPages() {
    return this.mode === Platform.githubPages;
  }

  isUnitTest() {
    return this.mode === Platform.unitTest;
  }

  isE2ETest() {
    return this.mode === Platform.e2eTest;
  }
}

export default new Env(import.meta.env.MODE);
