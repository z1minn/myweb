document.addEventListener('DOMContentLoaded', () => {
    const namesInput = document.getElementById('namesInput');
    const assignGroupsBtn = document.getElementById('assignGroupsBtn');
    const groupAList = document.getElementById('groupAList');
    const groupBList = document.getElementById('groupBList');
    const countA = document.getElementById('countA');
    const countB = document.getElementById('countB');

    assignGroupsBtn.addEventListener('click', assignGroups);

    function assignGroups() {
        // 쉼표로 구분된 이름을 배열로 변환하고, 공백 제거 및 빈 문자열 필터링
        const inputNames = namesInput.value.split(',').map(name => name.trim()).filter(name => name !== '');

        // 입력 유효성 검사
        if (inputNames.length < 2) {
            alert('그룹을 나누려면 2명 이상의 이름을 쉼표로 구분하여 입력해주세요!');
            return;
        }

        // 사람들의 순서를 무작위로 섞습니다 (Fisher-Yates 셔플 알고리즘)
        // inputNames 배열을 복사하여 원본 배열을 변경하지 않도록 합니다.
        const shuffledNames = [...inputNames]; // 스프레드 연산자로 배열 복사
        for (let i = shuffledNames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]]; // 배열 요소 교환
        }

        const groupA = [];
        const groupB = [];
        const totalPeople = shuffledNames.length;

        // 그룹 A와 B의 목표 인원 설정
        const idealGroupSize = Math.floor(totalPeople / 2);
        const remainder = totalPeople % 2;

        // 섞인 배열에서 A 그룹에 먼저 할당
        for (let i = 0; i < idealGroupSize; i++) {
            groupA.push(shuffledNames.pop());
        }

        // 남은 인원 (홀수인 경우 1명)을 A 그룹에 추가 (선택 사항: B에 줄 수도 있음)
        if (remainder === 1) {
            groupA.push(shuffledNames.pop());
        }

        // 남은 모든 사람들을 B 그룹에 할당
        while (shuffledNames.length > 0) {
            groupB.push(shuffledNames.pop());
        }

        // 결과를 화면에 표시
        displayGroups(groupA, groupB);
    }

    function displayGroups(groupA, groupB) {
        // 이전 결과 초기화
        groupAList.innerHTML = '';
        groupBList.innerHTML = '';

        // 각 그룹의 멤버를 ul 리스트에 추가
        groupA.forEach(person => {
            const li = document.createElement('li');
            li.textContent = person;
            groupAList.appendChild(li);
        });

        groupB.forEach(person => {
            const li = document.createElement('li');
            li.textContent = person;
            groupBList.appendChild(li);
        });

        // 인원수 업데이트
        countA.textContent = groupA.length;
        countB.textContent = groupB.length;
    }

    // 페이지 로드 시 초기 플레이스홀더 텍스트로 그룹 나누기 (예시)
    // assignGroups(); // 필요하다면 초기 로드 시 자동으로 실행
});