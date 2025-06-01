export async function loadSplash() {
  const res = await fetch("components/splash.html");
  const html = await res.text();
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);
}
