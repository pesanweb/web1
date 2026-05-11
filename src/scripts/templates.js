export const generateSubscribeButtonTemplate = () => {
  const button = document.createElement('button');
  button.id = 'subscribe-button';
  button.textContent = 'Subscribe';
  button.className = 'btn btn-primary';
  return button.outerHTML;
};
