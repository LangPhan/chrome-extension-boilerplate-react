import React from 'react';
import './Popup.css';

const Popup = () => {
  const handleDeletePost = () => {
    // Gửi message sang content script để xóa bài viết Facebook
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'DELETE_FACEBOOK_POST' });
    });
  };

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'DELETE_FACEBOOK_POST') {
      // Tìm nút ba chấm "Hành động với bài viết này" trong bài viết đầu tiên
      const post = document.querySelector('[role="article"]');
      if (post) {
        const actionBtn = post.querySelector(
          'div[aria-label="Hành động với bài viết này"]'
        );
        if (actionBtn) {
          actionBtn.click();
          setTimeout(() => {
            // Tìm nút "Move to trash" hoặc "Xóa bài viết"
            const deleteBtn = Array.from(
              document.querySelectorAll('span')
            ).find(
              (el) =>
                el.textContent.includes('Xóa bài viết') ||
                el.textContent.includes('Move to trash')
            );
            if (deleteBtn) {
              deleteBtn.click();
              setTimeout(() => {
                // Tìm nút xác nhận xóa
                const confirmBtn = Array.from(
                  document.querySelectorAll('span')
                ).find(
                  (el) =>
                    el.textContent.includes('Xóa') ||
                    el.textContent.includes('Move')
                );
                if (confirmBtn) {
                  confirmBtn.click();
                }
              }, 1000);
            }
          }, 1000);
        }
      }
    }
  });
  return (
    <div className="App">
      <button onClick={handleDeletePost}>Xóa bài viết Facebook</button>
    </div>
  );
};

export default Popup;
