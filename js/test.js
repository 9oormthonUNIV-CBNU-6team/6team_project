const questions = [
  {
    q: "자기소개 질문을 받았을 때 나는...",
    a: ["두루뭉술하게 인생 전체의 흐름을 말한다", "직무와 관련된 키워드를 중심으로 간결히 말한다"]
  },
  {
    q: "내가 경험을 설명할 때는...",
    a: ["멋져 보이는 단어로 꾸미는 편이다", "구체적인 상황, 숫자, 결과를 강조한다"]
  },
  {
    q: "압박 질문이 나왔을 때 나는...",
    a: ["순간 멘붕이 오고, 머릿속이 하얘진다", "당황하더라도 일단 말하고 정리해간다"]
  },
  {
    q: "마지막 질문으로 “하고 싶은 말이 있나요?”가 나오면...",
    a: ["준비한 말을 꺼내다가도 어버버한다", "핵심 한 줄로 인상을 남기려 한다"]
  },
  {
    q: "나의 말버릇은...",
    a: ["‘어... 음...’ 같은 추임새가 자주 나온다", "말을 시작할 때 정리된 문장으로 시작한다"]
  },
  {
    q: "예상 못한 질문을 받았을 때 나는...",
    a: ["너무 솔직하거나 말이 헛나온다", "돌려 말하거나 말한 맥락부터 찾으려 노력한다"]
  },
  {
    q: "내가 말한 뒤에 가장 자주 드는 생각은...",
    a: ["‘내가 왜 그렇게 말했지?’", "‘그래도 말은 이어졌네’"]
  },
  {
    q: "면접 전에 나는...",
    a: ["전체 시나리오를 외우듯 준비한다", "키워드 중심으로 말 흐름만 정리한다"]
  },
  {
    q: "나는 보통 말을...",
    a: ["길게 늘어지게 하는 편이다", "짧고 핵심 있게 말하려 한다"]
  },
  {
    q: "나의 말투는...",
    a: ["방어적이고 자신 없게 들릴 수 있다", "침착하지만 건조하게 들릴 수 있다"]
  }
];

let current = 0;

function nextQuestion(choice) {
  current++;
  if (current >= questions.length) {
    showResult();
  } else {
    updateQuestion();
  }
}

function updateQuestion() {
  const q = questions[current];
  document.getElementById("question").textContent = "Q. " + q.q;
  document.getElementById("btn1").textContent = q.a[0];
  document.getElementById("btn2").textContent = q.a[1];
  document.getElementById("step").textContent = `${current + 1}/${questions.length}`;
  document.getElementById("progressBar").style.width = `${((current + 1) / questions.length) * 100}%`;
}

function showResult() {
  document.querySelector(".wrapper").innerHTML = `
    <header><img src="assets/images/upbeat-logo.png" class="logo" alt="upbeat"></header>
    <div class="result-msg">나의 면접 유형은...</div>
    <img src="assets/images/result-bunny.png" alt="결과" style="width: 120px; margin-top: 20px;">
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  updateQuestion();
});
