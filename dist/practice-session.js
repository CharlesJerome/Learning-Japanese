'use strict';
(() => {
  // A practice turn and a source card are different: review turns share a saved
  // lesson:index key, but each position counts once toward this session's goal.
  class PracticeSession {
    constructor(lessonId, cardCount, startIndex = 0) {
      this.length = 15;
      this.reset(lessonId, cardCount, startIndex);
    }
    reset(lessonId, cardCount, startIndex = 0) {
      if (typeof lessonId !== 'string' || !lessonId || !Number.isInteger(cardCount) || cardCount < 1 || !Number.isInteger(startIndex) || startIndex < 0 || startIndex >= cardCount) {
        throw new Error('Choose a valid lesson and source card.');
      }
      this.lessonId = lessonId;
      this.cardCount = cardCount;
      this.startIndex = startIndex;
      this.index = 0;
      this.completed = new Set();
    }
    get sourceIndex() { return (this.startIndex + this.index) % this.cardCount; }
    get key() { return `${this.lessonId}:${this.sourceIndex}`; }
    get isReview() { return this.index >= this.cardCount; }
    get done() { return this.completed.has(this.index); }
    complete() {
      const firstTime = !this.done;
      this.completed.add(this.index);
      return firstTime;
    }
    move(step) {
      if (step !== -1 && step !== 1) throw new Error('Move one practice card at a time.');
      if (step === 1 && this.index === this.length - 1) {
        // Start again is a fresh session, including for a lesson resumed from history.
        this.reset(this.lessonId, this.cardCount, this.startIndex);
      } else {
        this.index = Math.max(0, this.index + step);
      }
    }
  }
  window.NihongoPracticeSession = PracticeSession;
})();
