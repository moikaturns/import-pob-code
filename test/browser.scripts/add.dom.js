function add(a, b) {
  const answer = a + b;
  return answer;
}
document.getElementById("btn").addEventListener("click", function () {
  document.getElementById("answer").innerHTML = add(40, 2);
});
