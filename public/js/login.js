const handleLoginSubmit = async (event) => {
    event.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    const url = "/auth/login";
    const body = {
      username,
      password,
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      // if (response.ok) {
      //   const data = await response.json();
      //   const jwt = data.data;
  
      //   // Lưu accessToken vào localStorage
      //   localStorage.setItem("accessToken", jwt);
  
      //   // // Tạo yêu cầu HTTP tới /index
      //   // const request = new Request("/index", {
      //   //   method: "GET",
      //   //   headers: {
      //   //     "Authorization": `Bearer ${jwt}`,
      //   //   },
      //   // });
  
      //   // const indexResponse = await fetch(request);
      //   // console.log(indexResponse);
      //   // // Xử lý phản hồi
      //   // if (indexResponse.ok) {
      //   //   // Trang được tải thành công
      //   //   window.location.href = "/index";
      //   // } else {
      //   //   // Trang không được tải thành công
      //   // }
      // } else {
      //   const error = await response.json();
      //   alert(error.message);
      // }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  