export class LocalStorageSaver {
  constructor() {
    this.bestScoreKey = "bestScore";
    this.gameStateKey = "gameState";

    this.storage = localStorage;
    this.cachedBestScore = this.getBestScoreFromStorage();
  }

  getBestScoreFromStorage() {
    const score = this.storage.getItem(this.bestScoreKey);
    return score ? parseInt(score, 10) : 0;
  }

  getBestScore() {
    return this.cachedBestScore;
  }

  setBestScore(score) {
    this.cachedBestScore = score;
    this.storage.setItem(this.bestScoreKey, score);
  }

  getGameState() {
    return null;
  }

  set;
}
