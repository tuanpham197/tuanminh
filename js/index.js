const myForm = document.getElementById("myForm");
const btnSubmit = document.getElementById("btnSubmit");
const scriptUrl =
  "https://script.google.com/macros/s/AKfycbzBsqVp9R6ndq7tpPlNnIlV0tCLBWS42jerkt-9J0hNcD4z2xH2l3iDOShqIOE8034k/exec";

// 3) Hoặc Cách 2: Bắt sự kiện click của riêng nút
btnSubmit.addEventListener("click", function (e) {
  // Lưu ý: Nút 'submit' mặc định sẽ submit form => load lại trang
  // nên nếu bạn cần chặn, phải gọi e.preventDefault()
  e.preventDefault();
  console.log("Nút submit được click!");
  const nameVal = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();

  console.log(nameVal, "Debug ");
  if (!nameVal || !message) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const data = {
    name: nameVal,
    email: "john@example.com",
    message: message,
  };

  const deployID =
    "AKfycbxGOyZwR8H7mWnhMefG6hYgsq4dhwCykUyuyUbLcokucbhD1IG4ujX_XV1YdnYzzn2A";
  // Thay URL dưới bằng URL Web App bạn vừa deploy

  fetch(scriptUrl, {
    method: "POST",
    // Chú ý: Nếu script của bạn ở chế độ “Anyone”,
    // có thể cần dùng mode: "no-cors" nếu không yêu cầu lấy response
    // Tuy nhiên, nếu muốn lấy response, để "cors" + cấu hình Apps Script
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json()) // parse JSON từ response
    .then((result) => {
      console.log("Phản hồi từ server:", result);
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
});

function fetchAndRenderData() {
  fetch(scriptUrl)
    .then((response) => response.json())
    .then((result) => {
      if (result.status === "success") {
        const data = result.data;
        const reversedData = data.reverse(); 
        const container = document.getElementById("scrollBox");

        let html = "";
        reversedData.forEach((item) => {
          html += `<div class="message"><span id="name_guest">${item.name}</span>:<i> ${item.message}</i></div>`;
        });
        // html += "</ul>";

        container.innerHTML = html;
      } else {
        console.error("Server error:", result.message);
      }
    })
    .catch((err) => {
      console.error("Lỗi fetch:", err);
    });
}

// Gọi hàm lần đầu
fetchAndRenderData();

// Đặt polling: 5000ms = 5 giây (tùy ý)
setInterval(fetchAndRenderData, 5000);

const scrollBox = document.getElementById("scrollBox");
let scrollInterval;

function startScrolling() {
  scrollInterval = setInterval(() => {
    // Mỗi lượt tăng scrollTop lên 1px
    scrollBox.scrollTop += 1;

    // Nếu đã cuộn tới đáy (scrollTop + chiều cao khung >= chiều cao tổng)
    // => quay về đầu để chạy lại từ đầu
    if (
      scrollBox.scrollTop + scrollBox.clientHeight >=
      scrollBox.scrollHeight
    ) {
      scrollBox.scrollTop = 0;
    }
  }, 40); // tốc độ cuộn (ms)
}

// Tự động bắt đầu cuộn khi trang vừa load
window.addEventListener("DOMContentLoaded", startScrolling);
