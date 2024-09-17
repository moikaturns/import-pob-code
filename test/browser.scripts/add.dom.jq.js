function add(a, b) {
  const answer = a + b;
  return answer;
}
$(document).ready(function () {
  document.getElementById("answer").innerHTML = add(40, 2);
});
