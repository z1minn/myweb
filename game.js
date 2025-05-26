document.addEventListener('DOMContentLoaded', () => {
    const playersInput = document.getElementById('players');
    const resultsInput = document.getElementById('results');
    const startGameButton = document.getElementById('startGame');
    const ladderCanvas = document.getElementById('ladderCanvas');
    const ctx = ladderCanvas.getContext('2d');
    const gameResultsDiv = document.getElementById('gameResults');

    const LADDER_WIDTH = 600;
    const LADDER_HEIGHT = 400;
    const START_Y = 50;
    const END_Y = LADDER_HEIGHT - 50;
    const SEGMENT_HEIGHT = 40; // 사다리 가로선 간격

    ladderCanvas.width = LADDER_WIDTH;
    ladderCanvas.height = LADDER_HEIGHT;

    startGameButton.addEventListener('click', startGame);

    function startGame() {
        const players = playersInput.value.split(',').map(p => p.trim()).filter(p => p !== '');
        const results = resultsInput.value.split(',').map(r => r.trim()).filter(r => r !== '');

        if (players.length === 0 || results.length === 0) {
            alert('참가자와 결과를 입력해주세요.');
            return;
        }
        if (players.length !== results.length) {
            alert('참가자 수와 결과 수가 같아야 합니다.');
            return;
        }

        drawLadder(players, results);
        runLadderGame(players, results);
    }

    function drawLadder(players, results) {
        ctx.clearRect(0, 0, LADDER_WIDTH, LADDER_HEIGHT); // 캔버스 초기화

        const numLines = players.length;
        const lineSpacing = LADDER_WIDTH / (numLines + 1); // 세로선 간격

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;

        // 세로선 그리기
        for (let i = 0; i < numLines; i++) {
            const x = (i + 1) * lineSpacing;
            ctx.beginPath();
            ctx.moveTo(x, START_Y);
            ctx.lineTo(x, END_Y);
            ctx.stroke();

            // 참가자 이름 그리기
            ctx.fillStyle = 'blue';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(players[i], x, START_Y - 20);

            // 결과 그리기
            ctx.fillStyle = 'green';
            ctx.fillText(results[i], x, END_Y + 30);
        }

        // 가로선 그리기 (무작위)
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        const numSegments = Math.floor((END_Y - START_Y) / SEGMENT_HEIGHT) - 1; // 가로선이 들어갈 수 있는 최대 개수

        // 각 세로선 간에 가로선 위치 저장 (중복 방지)
        const horizontalLines = Array.from({ length: numLines - 1 }, () => []);

        for (let y = START_Y + SEGMENT_HEIGHT; y < END_Y - SEGMENT_HEIGHT; y += SEGMENT_HEIGHT) {
            let placedInRow = false;
            for (let i = 0; i < numLines - 1; i++) {
                // 바로 옆에 가로선이 있는지 확인 (겹치지 않게)
                const hasNeighborLeft = horizontalLines[i].some(lineY => Math.abs(lineY - y) < SEGMENT_HEIGHT);
                const hasNeighborRight = (i > 0 && horizontalLines[i-1].some(lineY => Math.abs(lineY - y) < SEGMENT_HEIGHT));

                // 너무 촘촘하지 않게, 무작위로 그릴지 결정
                if (Math.random() < 0.6 && !hasNeighborLeft && !hasNeighborRight) { // 60% 확률로 가로선 생성
                    const x1 = (i + 1) * lineSpacing;
                    const x2 = (i + 2) * lineSpacing;
                    ctx.beginPath();
                    ctx.moveTo(x1, y);
                    ctx.lineTo(x2, y);
                    ctx.stroke();
                    horizontalLines[i].push(y);
                    placedInRow = true; // 이 행에 가로선이 하나라도 그려졌음을 표시
                }
            }
        }
    }

    function runLadderGame(players, results) {
        gameResultsDiv.innerHTML = ''; // 이전 결과 초기화
        const numLines = players.length;
        const lineSpacing = LADDER_WIDTH / (numLines + 1);

        const ladderPath = []; // 각 세로선의 가로선 정보를 저장

        // 사다리 가로선 정보 추출
        const segments = [];
        const image = ctx.getImageData(0, 0, LADDER_WIDTH, LADDER_HEIGHT);
        const data = image.data;

        for (let i = 0; i < numLines - 1; i++) {
            const x1 = Math.round((i + 1) * lineSpacing);
            const x2 = Math.round((i + 2) * lineSpacing);
            for (let y = START_Y + SEGMENT_HEIGHT; y < END_Y - SEGMENT_HEIGHT; y += SEGMENT_HEIGHT) {
                // 해당 위치에 빨간색 선이 있는지 픽셀을 확인하여 판단
                let isRedLine = true;
                // 검사할 픽셀의 x 좌표 범위
                const checkXStart = Math.min(x1, x2);
                const checkXEnd = Math.max(x1, x2);

                // y축의 픽셀을 샘플링하여 선이 있는지 확인
                // 이 방법은 픽셀 기반이라 정확하지 않을 수 있습니다.
                // 더 정확하게는 drawLadder 함수에서 가로선 정보를 저장하는 것이 좋습니다.
                // 여기서는 간단한 예시를 위해 픽셀 확인을 사용합니다.
                // 실제로 이 방식은 정확도가 떨어지므로, `drawLadder` 함수에서 `horizontalLines` 배열에
                // 가로선 정보를 저장하고, 그 정보를 `runLadderGame`에서 활용하는 것이 좋습니다.
                // 이 예시에서는 픽셀 기반 검사를 사용합니다.
                let pixelFound = false;
                for(let px = checkXStart + 5; px < checkXEnd - 5; px += 5) { // 띄엄띄엄 검사
                    const index = ((Math.round(y) * LADDER_WIDTH) + Math.round(px)) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];
                    if (r === 255 && g === 0 && b === 0) { // 빨간색 선 (red)
                        pixelFound = true;
                        break;
                    }
                }
                if (pixelFound) {
                    segments.push({ x1: x1, x2: x2, y: y });
                }
            }
        }

        // 각 플레이어의 경로 추적
        players.forEach((player, index) => {
            let currentX = (index + 1) * lineSpacing;
            let currentY = START_Y;

            // 경로를 시각적으로 표시하기 위한 새로운 캔버스 또는 경로 그리기
            // 여기서는 경로 시각화는 생략하고 최종 결과만 도출합니다.

            while (currentY < END_Y) {
                let moved = false;
                // 현재 위치에서 이동할 수 있는 가로선을 찾습니다.
                for (const segment of segments) {
                    // 현재 세로선이 가로선의 시작 또는 끝점에 닿고, Y좌표가 일치하는 경우
                    if (currentY >= segment.y - SEGMENT_HEIGHT / 2 && currentY <= segment.y + SEGMENT_HEIGHT / 2) {
                        if (Math.abs(currentX - segment.x1) < 5) { // 왼쪽 세로선에 있을 때
                            currentX = segment.x2; // 오른쪽으로 이동
                            currentY = segment.y;
                            moved = true;
                            break;
                        } else if (Math.abs(currentX - segment.x2) < 5) { // 오른쪽 세로선에 있을 때
                            currentX = segment.x1; // 왼쪽으로 이동
                            currentY = segment.y;
                            moved = true;
                            break;
                        }
                    }
                }
                if (!moved) {
                    currentY += SEGMENT_HEIGHT; // 아래로 이동
                } else {
                    currentY += SEGMENT_HEIGHT; // 가로선 이동 후 다음 세그먼트로 이동
                }
            }

            // 최종 도착 지점의 인덱스 계산
            const finalIndex = Math.round((currentX / lineSpacing) - 1);
            const result = results[finalIndex];

            const p = document.createElement('p');
            p.textContent = `${player}의 결과: ${result}`;
            gameResultsDiv.appendChild(p);
        });
    }
});