import styles from '@pages/board/board.module.css';

const ROW = 10;
const COL = 10;

const dx = [0, 1, 1, 1, 0, -1, -1, -1];
const dy = [1, 1, 0, -1, -1, -1, 0, 1];

const INIT_BOARD = Array(ROW)
  .fill(0)
  .map((_, row) =>
    Array(COL)
      .fill(0)
      .map((_, col) => {
        if ((row === ROW / 2 - 1 && col === COL / 2 - 1) || (row === ROW / 2 && col === COL / 2))
          return { location: [row, col], color: 'black', hint: false };
        if ((row === ROW / 2 - 1 && col === COL / 2) || (row === ROW / 2 && col === COL / 2 - 1))
          return { location: [row, col], color: 'white', hint: false };
        return { location: [row, col], color: null, hint: false };
      }),
  );

class Board {
  #container;
  #board = INIT_BOARD;
  #turn: 'black' | 'white' = 'black';
  #blackScore = 2;
  #whiteScore = 2;
  #params?: Record<string, string>;

  constructor(container: HTMLElement, params?: Record<string, string>) {
    this.#params = params;
    this.#container = container;
    this.clickBoard();
    this.hint();
    this.updateScores();
    this.initRender();

    if (this.#params?.mod !== 'ai' && this.#params?.mod !== 'normal') window.history.go(-1);
  }

  // 스코어 업데이트
  private updateScores() {
    const blackScoreElement = this.#container.querySelector(`.${styles.blackStone} + .${styles.scoreTitle}`);
    const whiteScoreElement = this.#container.querySelector(`.${styles.whiteStone} + .${styles.scoreTitle}`);

    if (blackScoreElement) blackScoreElement.textContent = `: ${this.#blackScore}`;
    if (whiteScoreElement) whiteScoreElement.textContent = `: ${this.#whiteScore}`;
  }

  // 초기 렌더링
  private initRender() {
    const mainHTML = `
      <main class=${styles.main}>
        <div class=${styles.info}>
          <h1 class=${styles.h1}>${this.#params?.mod === 'ai' ? 'AI' : 'Normal'} Mode</h1>

          <div class=${styles.score}>
            <div class=${styles.scoreSection}>
              <div class=${styles.blackStone}></div>
              <div class=${styles.scoreTitle}>: ${this.#blackScore}</div>
            </div>

            <div class=${styles.scoreSection}>
              <div class=${styles.whiteStone}></div>
              <div class=${styles.scoreTitle}>: ${this.#whiteScore}</div>
            </div>
          </div>
        </div>

          <section class=${styles.section}>
        ${this.#board
          .flat()
          .map(
            (item, index) =>
              `<div 
                  class=${(Math.floor(index / 10) + index) % 2 ? styles.evenCell : styles.oddCell}
                  data-row=${item.location[0]}
                  data-col=${item.location[1]}
                >
            ${
              item.color === 'black'
                ? `<div class=${styles.blackStone} data-row=${item.location[0]} data-col=${item.location[1]}></div>`
                : item.color === 'white'
                  ? `<div class=${styles.whiteStone} data-row=${item.location[0]} data-col=${item.location[1]}></div>`
                  : item.hint
                    ? `<div class=${`${styles.hint} ${this.#turn === 'black' ? styles.blackHover : styles.whiteHover}`} data-row=${item.location[0]} data-col=${item.location[1]}></div>`
                    : `<div></div>`
            }
          </div>`,
          )
          .join('')}
      </section>
        </main>
      `;

    this.#container.innerHTML = mainHTML;
  }

  // 셀 업데이트
  private updateCell(row: number, col: number) {
    const cell = this.#container.querySelector(`[data-row='${row}'][data-col='${col}']`);
    if (!cell) return;

    const item = this.#board[row][col];
    let content = '';

    if (item.color === 'black') {
      content = `<div class=${styles.blackStone} data-row=${item.location[0]} data-col=${item.location[1]}></div>`;
    } else if (item.color === 'white') {
      content = `<div class=${styles.whiteStone} data-row=${item.location[0]} data-col=${item.location[1]}></div>`;
    } else if (item.hint) {
      content = `<div class="${`${styles.hint} ${this.#turn === 'black' ? styles.blackHover : styles.whiteHover}`}" data-row=${item.location[0]} data-col=${item.location[1]}></div>`;
    }

    cell.innerHTML = content;
  }

  // 주변 돌 뒤집을 수 있는지 계산
  private calculateFlip(row: number, col: number) {
    const flips: [number, number][] = [];

    for (let i = 0; i < 8; i++) {
      let x = row + dx[i];
      let y = col + dy[i];
      const potentialFlips: [number, number][] = [];

      while (
        x >= 0 &&
        x < ROW &&
        y >= 0 &&
        y < COL &&
        this.#board[x][y].color &&
        this.#board[x][y].color !== this.#turn
      ) {
        potentialFlips.push([x, y]);
        x += dx[i];
        y += dy[i];
      }

      if (x >= 0 && x < ROW && y >= 0 && y < COL && this.#board[x][y].color === this.#turn) {
        flips.push(...potentialFlips);
      }
    }

    return flips;
  }

  // 힌트 표시
  private hint() {
    for (let i = 0; i < ROW; i++) {
      for (let j = 0; j < COL; j++) {
        if (this.#board[i][j].color) {
          this.#board[i][j].hint = false;
          continue;
        }

        const flips = this.calculateFlip(i, j);
        this.#board[i][j].hint = flips.length > 0;
        this.updateCell(i, j);
      }
    }
  }

  // 돌 뒤집기
  private flip(row: number, col: number) {
    const flips = this.calculateFlip(row, col);
    let changeBlack = 0;
    let changeWhite = 0;

    flips.forEach(([x, y]) => {
      this.#board[x][y].color = this.#turn;
      this.updateCell(x, y);
      if (this.#turn === 'black') {
        changeBlack++;
        changeWhite--;
      } else {
        changeBlack--;
        changeWhite++;
      }
    });

    if (this.#turn === 'black') changeBlack++;
    if (this.#turn === 'white') changeWhite++;

    this.updateScore(changeBlack, changeWhite); // Including the placed stone
  }

  // 스코어 업데이트
  private updateScore(changeBlack: number, changeWhite: number) {
    this.#blackScore += changeBlack;
    this.#whiteScore += changeWhite;
    this.updateScores();
  }

  // 클릭 이벤트
  private clickBoard() {
    this.#container.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.dataset.row && target.dataset.col) {
        const [row, col] = [Number(target.dataset.row), Number(target.dataset.col)];

        // Check if the cell is empty
        if (this.#board[row][col].color || !this.#board[row][col].hint) return;

        // Place the stone
        this.#board[row][col].color = this.#turn;
        this.updateCell(row, col);

        // Flip the stones
        this.flip(row, col);

        // Change turn
        this.#turn = this.#turn === 'black' ? 'white' : 'black';

        this.hint();

        if (this.#turn === 'white' && this.#params?.mod === 'ai') {
          setTimeout(() => {
            this.whiteMove();
          }, 1000);
        }
      }
    });
  }

  // 흰색 돌이 자동으로 놓을 수 있는 로직
  private whiteMove() {
    let bestMove: { row: number; col: number; flips: number } | null = null;

    for (let i = 0; i < ROW; i++) {
      for (let j = 0; j < COL; j++) {
        if (!this.#board[i][j].color && this.#board[i][j].hint) {
          const flips = this.calculateFlip(i, j).length;
          if (!bestMove || flips > bestMove.flips) {
            bestMove = { row: i, col: j, flips };
          }
        }
      }
    }

    if (bestMove) {
      this.#board[bestMove.row][bestMove.col].color = 'white';
      this.updateCell(bestMove.row, bestMove.col);
      this.flip(bestMove.row, bestMove.col);
      this.#turn = 'black';
      this.hint();
    }
  }
}

export default Board;
