// const basic = 'http://quan-dev.xiaoheiban.cn'

//const token = '593d1f70af36444423ebc533'
const token = ''

export const API = {
  get: (url) => {
    return window.fetch(`${url}&token=${token}`, {
      method: "GET",
      mode: "cors",
      redirect: "follow",
      headers: {
        "Content-Type": 'application/json',
        //"Set-Cookie": 'token=NTlhNGU0M2QwMTc5YjA0YjUwNTYxNzhi'
        //authorization: store.get("user") && store.get("user").clientToken,
      },  //从store中获取用户的token
    })
      .then(res => {
        return res.json();
      },
        err => {
        	console.log(err);
        return err.json()
        }
      );
  },
  post: (url, body) => {
    return window.fetch(`${url}&token=${token}`, {
      method: "POST",
      mode: "cors",
      redirect: "follow",
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(res => {
        return res.json()
      },
        err => {
          return err.json()
        })
  },
};



