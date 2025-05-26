// 텍스트를 변경하는 함수
function changeText() {
    const title = document.getElementById("title");
    if (title) {
      title.innerText = "반갑습니다!";
    }
  }
  
  // 버튼에 이벤트 리스너 연결
  document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("changeButton");
    if (button) {
      button.addEventListener("click", changeText);
    }
  });
  