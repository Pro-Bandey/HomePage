document.addEventListener('DOMContentLoaded', () => {
  const steps = Array.from(document.querySelectorAll('.step'));
  const progress = document.getElementById('progress');
  const progressContainer = document.getElementById('progress-container');
  const totalSteps = steps.length;
  let currentStep = 0;

  // Create progress circles
  for (let i = 0; i < totalSteps; i++) {
    const circle = document.createElement('div');
    circle.className = 'circle' + (i === 0 ? ' active' : '');
    circle.textContent = i + 1;
    circle.dataset.step = i;
    circle.addEventListener('click', () => goToStep(i));
    progressContainer.appendChild(circle);
  }
  const circles = Array.from(progressContainer.querySelectorAll('.circle'));

  function updateProgress() {
    circles.forEach((c, i) => c.classList.toggle('active', i <= currentStep));
    progress.style.width = (currentStep / Math.max(1, totalSteps - 1)) * 100 + '%';
    document.querySelectorAll('.prev').forEach(btn => btn.disabled = (currentStep === 0));
  }

  function showStep(index, direction = 'next') {
    if (index === currentStep) return;
    if (index < 0 || index >= totalSteps) return;

    const old = steps[currentStep];
    const neu = steps[index];

    old.classList.remove('active');
    old.classList.add(direction === 'next' ? 'left-exit' : 'right-exit');

    setTimeout(() => old.classList.remove('left-exit', 'right-exit'), 480);

    neu.classList.add('active');
    currentStep = index;
    updateProgress();
  }

  function nextStep() {
    if (currentStep < totalSteps - 1) showStep(currentStep + 1, 'next');
    else openDefaultTab();
  }

  function prevStep() {
    if (currentStep > 0) showStep(currentStep - 1, 'prev');
  }

  function openDefaultTab() {
    let newTabURL = '';

    // Detect browser
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      newTabURL = 'chrome://newtab'; // Chrome, Edge, Brave
    } else if (typeof browser !== 'undefined' && browser.runtime) {
      newTabURL = 'about:newtab'; // Firefox
    } else {
      newTabURL = './index.html'; // fallback
    }

    // Open new tab and close wizard if popup
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: newTabURL });
      window.close();
    } else if (typeof browser !== 'undefined' && browser.tabs) {
      browser.tabs.create({ url: newTabURL });
      window.close();
    } else {
      window.location.href = newTabURL;
    }
  }

  function skipSteps() { openDefaultTab(); }
  function finish() { openDefaultTab(); }
  function goToStep(index) {
    const dir = index > currentStep ? 'next' : 'prev';
    showStep(index, dir);
  }

  // Event delegation for all buttons
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'next') nextStep();
    else if (action === 'prev') prevStep();
    else if (action === 'skip') skipSteps();
    else if (action === 'finish') finish();
  });

  updateProgress();
});
