/**
 *
 * @param {MouseEvent<HTMLDivElement>} evt
 */
function toggleNib(evt) {
  /** @type {HTMLDivElement} */
  const target = evt.target;

  if (target.classList.contains('active'))  {
    target.classList.remove('active');
  } else {
    target.classList.add('active');
  }
}

function sendAlert() {
  alert("Yes, this still listens");
}
